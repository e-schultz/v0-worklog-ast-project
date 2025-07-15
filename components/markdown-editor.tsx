"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Code, FileCode, Eye, Edit, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MarkdownEditorProps {
  initialValue: string
  onChange: (value: string) => void
  viewMode: "preview" | "edit" | "ast"
  onViewModeChange: (mode: "preview" | "edit" | "ast") => void
}

export function MarkdownEditor({ initialValue, onChange, viewMode, onViewModeChange }: MarkdownEditorProps) {
  const [lintResults, setLintResults] = useState<string[]>([])
  const [showLintDialog, setShowLintDialog] = useState(false)
  const [editorContent, setEditorContent] = useState(initialValue)

  // Debounce content changes to avoid excessive updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorContent !== initialValue) {
        onChange(editorContent)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [editorContent, initialValue, onChange])

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getText())
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[100px] p-3 rounded-md bg-muted/50",
      },
    },
  })

  // Update editor content when initialValue changes
  useEffect(() => {
    if (editor && editor.getText() !== initialValue) {
      editor.commands.setContent(initialValue)
    }
  }, [editor, initialValue])

  // Simple function to convert text to a basic AST representation
  const textToAst = (text: string) => {
    // Create a simple AST structure for demonstration
    const lines = text.split("\n").filter(Boolean)

    return {
      type: "doc",
      content: lines.map((line, index) => ({
        type: "paragraph",
        id: `p-${index}`,
        content: line.trim(),
      })),
      metadata: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
        lineCount: lines.length,
      },
    }
  }

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run()
  }

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run()
  }

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run()
  }

  const toggleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run()
  }

  const toggleCodeBlock = () => {
    editor?.chain().focus().toggleCodeBlock().run()
  }

  const lintMarkdown = () => {
    // Simulate LLM-based linting with mock results based on content
    const content = editor?.getText() || ""
    const results = []

    if (content.length > 200) {
      results.push("Consider breaking long content into smaller chunks for better readability.")
    }

    if (content.includes("FLOAT") && content.includes("float")) {
      results.push("The term 'FLOAT' is used inconsistently - sometimes capitalized, sometimes not.")
    }

    if (content.includes("chaos-ops") && !content.includes("chaos-ops concept")) {
      results.push("Missing context about 'chaos-ops' concept - consider adding a brief explanation.")
    }

    // If no issues found, provide a positive message
    if (results.length === 0) {
      results.push("No significant issues found. Content is well-structured and clear.")
    }

    setLintResults(results)
    setShowLintDialog(true)
  }

  const renderASTView = () => {
    // Generate a simple AST representation from the editor content
    const content = editor ? textToAst(editor.getText()) : { type: "doc", content: [] }
    return (
      <pre className="overflow-auto rounded-md bg-muted/50 p-3 text-xs font-mono">
        {JSON.stringify(content, null, 2)}
      </pre>
    )
  }

  return (
    <div className="space-y-2">
      {viewMode === "edit" && (
        <div className="flex flex-wrap gap-1 rounded-md bg-muted p-1">
          <Button variant="ghost" size="sm" onClick={toggleBold} className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleItalic} className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleBulletList} className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleOrderedList} className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleCodeBlock} className="h-8 w-8 p-0">
            <Code className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("preview")}
              className={viewMode === "preview" ? "bg-muted-foreground/20" : ""}
            >
              <Eye className="mr-1 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("edit")}
              className={viewMode === "edit" ? "bg-muted-foreground/20" : ""}
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("ast")}
              className={viewMode === "ast" ? "bg-muted-foreground/20" : ""}
            >
              <FileCode className="mr-1 h-4 w-4" />
              AST
            </Button>
            <Button variant="ghost" size="sm" onClick={lintMarkdown}>
              <AlertTriangle className="mr-1 h-4 w-4" />
              Lint
            </Button>
          </div>
        </div>
      )}

      {viewMode === "edit" && <EditorContent editor={editor} />}
      {viewMode === "preview" && (
        <div className="prose prose-invert max-w-none rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
          {editorContent}
        </div>
      )}
      {viewMode === "ast" && renderASTView()}

      <Dialog open={showLintDialog} onOpenChange={setShowLintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Markdown Linting Results</DialogTitle>
            <DialogDescription>AI-powered suggestions to improve your content</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {lintResults.map((result, index) => (
              <div key={index} className="flex gap-2 rounded-md bg-muted p-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                <p className="text-sm">{result}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowLintDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
