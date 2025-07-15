import type { ASTNodeType } from "@/types/ast-node"

// Regular expressions for parsing
const CTX_BLOCK_REGEX = /## \[ctx:([^\]]+)\](.*)?/
const YAML_BLOCK_START = /---\s*\n/
const YAML_BLOCK_END = /\n\s*---/
const UID_REGEX = /uid:\s*([^\n]+)/
const TITLE_REGEX = /title:\s*([^\n]+)/
const TAGS_REGEX = /tags:\s*\[(.*?)\]/
const LINKED_TO_REGEX = /linkedTo:\s*\n((?:\s*-\s*[^\n]+\n)+)/

export function parseMarkdownToAST(markdown: string): ASTNodeType[] {
  const lines = markdown.split("\n")
  const nodes: ASTNodeType[] = []

  let currentNode: ASTNodeType | null = null
  let inYamlBlock = false
  let yamlContent = ""
  let lineIndex = 0

  while (lineIndex < lines.length) {
    const line = lines[lineIndex]

    // Check for ctx block headers
    const ctxMatch = line.match(CTX_BLOCK_REGEX)
    if (ctxMatch) {
      // If we have a current node, push it to the array
      if (currentNode) {
        nodes.push(currentNode)
      }

      // Extract date and timestamp from ctx block
      const ctxInfo = ctxMatch[1].trim()
      const title = ctxMatch[2]?.trim() || "Untitled"

      // Parse date and timestamp if available
      let date = ""
      let timestamp = ""

      const dateTimeMatch = ctxInfo.match(/(\d{4}-\d{2}-\d{2})\s*-\s*(.+)/)
      if (dateTimeMatch) {
        date = dateTimeMatch[1]
        timestamp = dateTimeMatch[2]
      } else {
        // If no clear date format, use the whole string as timestamp
        timestamp = ctxInfo
      }

      // Create a new node
      currentNode = {
        id: `ctx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: title,
        date: date,
        timestamp: timestamp,
        context: "",
        resources: [],
        tags: [],
        status: "active",
        defaultExpanded: true,
        children: [],
      }

      lineIndex++
      continue
    }

    // Check for YAML blocks (potential child nodes)
    if (line.match(YAML_BLOCK_START) && !inYamlBlock) {
      inYamlBlock = true
      yamlContent = ""
      lineIndex++
      continue
    }

    if (inYamlBlock) {
      if (line.match(YAML_BLOCK_END)) {
        inYamlBlock = false

        // Parse the YAML content
        const uidMatch = yamlContent.match(UID_REGEX)
        const titleMatch = yamlContent.match(TITLE_REGEX)
        const tagsMatch = yamlContent.match(TAGS_REGEX)
        const linkedToMatch = yamlContent.match(LINKED_TO_REGEX)

        if (uidMatch && currentNode) {
          const childNode: ASTNodeType = {
            id: uidMatch[1].trim(),
            title: titleMatch ? titleMatch[1].trim() : "Untitled",
            date: currentNode.date,
            timestamp: currentNode.timestamp,
            context: "",
            resources: [],
            tags: [],
            status: "in-progress",
            defaultExpanded: false,
            children: [],
          }

          // Extract tags
          if (tagsMatch) {
            childNode.tags = tagsMatch[1].split(",").map((tag) => `#${tag.trim()}`)
          }

          // Extract linked resources
          if (linkedToMatch) {
            childNode.resources = linkedToMatch[1]
              .split("\n")
              .filter((line) => line.trim().startsWith("-"))
              .map((line) => line.replace("-", "").trim())
          }

          currentNode.children.push(childNode)
        }

        lineIndex++
        continue
      }

      yamlContent += line + "\n"
      lineIndex++
      continue
    }

    // Parse tags
    if (line.trim().startsWith("- #") && currentNode) {
      const tags = line
        .substring(2)
        .split(",")
        .map((tag) => tag.trim())
      currentNode.tags = tags
      lineIndex++
      continue
    }

    // Parse linked resources
    if (line.trim().startsWith("### ") && currentNode) {
      const sectionTitle = line.substring(4).trim()

      // Check if this is a resources section
      if (sectionTitle.includes("Float Chats") || sectionTitle.includes("Linked Resources")) {
        const resources: string[] = []
        lineIndex++

        // Collect resources until we hit another section or end of node
        while (
          lineIndex < lines.length &&
          !lines[lineIndex].match(CTX_BLOCK_REGEX) &&
          !lines[lineIndex].startsWith("### ")
        ) {
          const resourceLine = lines[lineIndex].trim()
          if (resourceLine && !resourceLine.startsWith("---")) {
            resources.push(resourceLine)
          }
          lineIndex++
        }

        currentNode.resources = resources
        continue
      }
    }

    // Add content to current node or child node
    if (currentNode) {
      // Skip empty lines at the beginning of content
      if (line.trim() || currentNode.context) {
        currentNode.context += (currentNode.context ? "\n" : "") + line
      }
    }

    lineIndex++
  }

  // Add the last node
  if (currentNode) {
    nodes.push(currentNode)
  }

  return nodes
}
