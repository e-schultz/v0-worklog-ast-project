"use client"

import { BarChart2, Calendar, FileText, Layers } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center gap-2 px-4 py-3">
        <Layers className="h-6 w-6 text-purple-400" />
        <span className="text-lg font-semibold">Worklog AST Explorer</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>VIEWS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="AST Explorer">
                  <Layers className="text-blue-400" />
                  <span>AST Explorer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Timeline View">
                  <Calendar />
                  <span>Timeline View</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Worklog Entries">
                  <FileText />
                  <span>Worklog Entries</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Insights">
                  <BarChart2 />
                  <span>Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>ACTIVE PROJECTS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  <span>FLOAT Microsite</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Active
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span className="flex h-2 w-2 rounded-full bg-gray-500"></span>
                  <span>Portfolio Update</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Paused
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
                  <span>AST Explorer</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    In Progress
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>TAGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 p-2">
              <Badge variant="secondary" className="bg-blue-900/30 hover:bg-blue-900/50">
                #float
              </Badge>
              <Badge variant="secondary" className="bg-purple-900/30 hover:bg-purple-900/50">
                #ritual
              </Badge>
              <Badge variant="secondary" className="bg-green-900/30 hover:bg-green-900/50">
                #ast_interface
              </Badge>
              <Badge variant="secondary" className="bg-amber-900/30 hover:bg-amber-900/50">
                #design
              </Badge>
              <Badge variant="secondary" className="bg-red-900/30 hover:bg-red-900/50">
                #ui
              </Badge>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">FLOAT System v0.4.2</div>
      </SidebarFooter>
    </Sidebar>
  )
}
