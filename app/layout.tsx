import type React from "react"
import { Inter, Fira_Code } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "Worklog AST Explorer",
  description: "Visualizing work history as an abstract syntax tree",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
