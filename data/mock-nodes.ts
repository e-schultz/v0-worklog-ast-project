import type { ASTNodeType } from "@/types/ast-node"

export const mockASTNodes: ASTNodeType[] = [
  {
    id: "1",
    title: "April 22, 2025 - FLOAT Microsite Project",
    date: "April 22, 2025",
    timestamp: "11:57 PM",
    context:
      "Collecting the Bones for later - chat log links and tweet links --- let the system rest and pick up tomorrow.\n\nI know these chat logs are saved all over, I don't need to copy-paste hi-fidelity right now, so gathering the bones for future reference - chat log links and tweet links --- let the system rest and pick up tomorrow.",
    resources: ["Float Chats - FLOAT Glitch Rituals Explained", "Brain Rest Mode", "Float Microsite Code"],
    tags: ["#float", "#floatctl", "#scratch"],
    status: "active",
    defaultExpanded: true,
    children: [],
  },
  {
    id: "2",
    title: "FLOAT Conversation AST Explorer",
    timestamp: "12:07 AM",
    context: "Useful Meta-prompt appears - #float, #floatctl, #scratch",
    tags: ["#float", "#floatctl", "#scratch"],
    status: "in-progress",
    defaultExpanded: false,
    children: [],
  },
]
