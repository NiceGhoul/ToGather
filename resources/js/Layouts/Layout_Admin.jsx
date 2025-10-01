import { AppSidebar } from "@/Components/Sidebar_Admin_Item"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, usePage, router } from "@inertiajs/react";

export default function Page({ children, title }) {
    const handleLogout = () => {
        router.post("/logout");
    };
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="w-full max-w-full h-screen overflow-hidden">
                    <header
                        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-5">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className=" data-[orientation=vertical]:h-4" />
                            <h1 className="text-lg font-semibold">{title}</h1>
                        </div>
                    </header>
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
