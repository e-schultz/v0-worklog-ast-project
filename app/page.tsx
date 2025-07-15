import { AppSidebar } from "@/components/app-sidebar"
import { ASTExplorerView } from "@/components/ast-explorer-view"
import { SidebarInset } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <ASTExplorerView />
      </SidebarInset>
    </main>
  )
}
