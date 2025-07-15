export interface ASTNodeType {
  id: string
  title: string
  date?: string
  timestamp: string
  context: string
  resources?: string[]
  tags?: string[]
  status: "active" | "paused" | "in-progress" | "completed"
  defaultExpanded: boolean
  children: ASTNodeType[]
}
