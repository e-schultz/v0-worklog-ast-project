"use client"

import { useState, useEffect } from "react"
import { Search, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ASTNode } from "@/components/ast-node"
import { getASTNodes } from "@/services/note-service"
import type { ASTNodeType } from "@/types/ast-node"

export function ASTExplorerView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [nodes, setNodes] = useState<ASTNodeType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadNodes() {
      try {
        const astNodes = await getASTNodes()
        setNodes(astNodes)
      } catch (error) {
        console.error("Failed to load nodes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNodes()
  }, [])

  const filteredNodes = nodes.filter(
    (node) =>
      searchQuery === "" ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      node.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-2xl font-semibold">AST Explorer View</h1>
        <p className="text-sm text-muted-foreground">Visualizing work history as an abstract syntax tree</p>

        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1">
            {/* Timeline visualization */}
            <div className="relative h-1 w-full rounded-full bg-muted">
              <div className="absolute left-[10%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 ring-2 ring-background"></div>
              <div className="absolute left-[30%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 ring-2 ring-background"></div>
              <div className="absolute left-[50%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 ring-2 ring-background"></div>
              <div className="absolute left-[70%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500 ring-2 ring-background"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-2 border-b border-border/40 px-6 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading AST nodes...</div>
          </div>
        ) : filteredNodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">No nodes found matching your search.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNodes.map((node) => (
              <ASTNode key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
