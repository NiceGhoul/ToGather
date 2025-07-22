import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar_Admin } from "@/components/Sidebar_Admin"
export default function Layout_admin({ children }) {
    return (
        <>
            <div className="flex h-screen w-screen overflow-hidden">
                <SidebarProvider>
                    <Sidebar_Admin />
                    <div className="flex flex-col flex-grow">
                        <div className="flex justify-between items-center w-full p-4 bg-[#f9f9f9]">
                            <SidebarTrigger />
                        </div>
                        <main className="flex-grow overflow-auto"> 
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
            </div>
        </>
    )
}