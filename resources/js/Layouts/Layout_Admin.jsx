import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar_Admin } from "@/components/Sidebar_Admin"

export default function Layout_admin({ children }) {
    return (
        <>
            <div className="scale-115 origin-top-left">
                <SidebarProvider>
                    <Sidebar_Admin />
                    <SidebarTrigger />
                    <main>
                        {children}
                    </main>
                </SidebarProvider>
            </div>
        </>
    )
}