"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Eye, Edit, Plus, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MarkdownEditor } from "@/components/markdown-editor"
import { cn } from "@/lib/utils"
import { updateNodeContent } from "@/services/note-service"
import type { ASTNodeType } from "@/types/ast-node"

interface ASTNodeProps {
  node: ASTNodeType
  level?: number
}

export function ASTNode({ node, level = 0 }: ASTNodeProps) {
  const [isExpanded, setIsExpanded] = useState(node.defaultExpanded)
  const [viewMode, setViewMode] = useState<"preview" | "edit" | "ast">("preview")
  const [content, setContent] = useState(node.context)
  const [isSaving, setIsSaving] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleContentChange = async (newContent: string) => {
    setContent(newContent)
    setIsSaving(true)
    try {
      await updateNodeContent(node.id, newContent)
    } catch (error) {
      console.error("Failed to save content:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const borderColor = () => {
    switch (node.status) {
      case "active":
        return "border-l-green-500"
      case "paused":
        return "border-l-gray-500"
      case "in-progress":
        return "border-l-purple-500"
      default:
        return "border-l-blue-500"
    }
  }

  const dotColor = () => {
    switch (node.status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-gray-500"
      case "in-progress":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className={cn("relative pl-6", level > 0 && "ml-6 mt-4")}>
      {/* Connection line */}
      {level > 0 && <div className="absolute -left-6 top-0 h-full w-6 border-l-2 border-t-2 border-border" />}

      {/* Status dot */}
      <div className={cn("absolute left-0 top-6 h-3 w-3 rounded-full", dotColor())} />

      <Card className={cn("border-l-4 transition-all", borderColor())}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              {node.date && <span className="text-xs text-muted-foreground">{node.date}</span>}
              <h3 className="font-medium">{node.title}</h3>
              {node.id.startsWith("floatlog::") && <span className="text-xs text-blue-400">{node.id}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{node.timestamp}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleExpand}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <>
            <CardContent className="p-4 pt-0">
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Context</h4>
                {viewMode === "edit" ? (
                  <MarkdownEditor
                    initialValue={content}
                    onChange={handleContentChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                ) : (
                  <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">{content}</div>
                )}
              </div>

              {node.resources && node.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Linked Resources</h4>
                  <ul className="space-y-1">
                    {node.resources.map((resource, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">›</span>
                        {resource.startsWith("http") ? (
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {resource.replace(/^https?:\/\//, "")}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <a href="#" className="text-blue-400 hover:underline">
                            {resource}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {node.tags && node.tags.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {node.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={cn(
                          "bg-opacity-30 hover:bg-opacity-50",
                          tag.includes("float") && "bg-blue-900 hover:bg-blue-900",
                          tag.includes("ritual") && "bg-purple-900 hover:bg-purple-900",
                          tag.includes("ast") && "bg-green-900 hover:bg-green-900",
                        )}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between p-4 pt-0">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-3 w-3" />
                  View Log
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewMode("edit")} disabled={isSaving}>
                  <Edit className="mr-2 h-3 w-3" />
                  {isSaving ? "Saving..." : "Edit"}
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-3 w-3" />
                Add Child Node
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      {/* Render children */}
      {isExpanded && node.children && node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child) => (
            <ASTNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
