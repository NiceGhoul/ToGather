import { Calendar, Home, Inbox, Search, Settings, LogOut , Users, Megaphone, Receipt } from "lucide-react"
import { router } from "@inertiajs/react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },
    {
        title: "User",
        url: "#",
        icon: Users,
    },
    {
        title: "Campaign",
        url: "#",
        icon: Megaphone,
    },
    {
        title: "Transaction",
        url: "#",
        icon: Receipt,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function Sidebar_Admin() {
    const handleLogout = () => {
        router.post("/logout");
    };
    return (
        <Sidebar className="w-64">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-base mb-4">Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} className="mb-4">
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon className="scale-140"/>
                                            <span className="text-base">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleLogout}>
                                    <LogOut /> 
                                    <span className="text-base">Logout</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}