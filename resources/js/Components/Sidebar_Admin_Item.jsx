import * as React from "react";
import {
    LayoutDashboard,
    Users,
    Volume2,
    List,
    ArrowLeftRight,
    GalleryVerticalEnd,
    AudioWaveform,
    Command,
    Settings,
} from "lucide-react";

import { NavMain } from "@/Components/Sidebar_Admin";
import { NavUser } from "@/Components/Sidebar_Admin_Profile";
import { TeamSwitcher } from "@/Components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";

// Data for the main navigation
const sidebarNavItems = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        isActive: true,
    },
    {
        title: "User",
        url: "#",
        icon: Users,
        items: [
            {
                title: "User List",
                url: "/admin/users/list",
            },
            {
                title: "Verification Request",
                url: "/admin/users/verification",
            },
        ],
    },
    {
        title: "Campaign",
        url: "#",
        icon: Volume2,
        items: [
            {
                title: "Campaign List",
                url: "/admin/campaigns/list",
            },
            {
                title: "Campaign Verification",
                url: "/admin/campaigns/verification",
            },
        ],
    },
    {
        title: "Article",
        url: "#",
        icon: List,
        items: [
            {
                title: "Article List",
                url: "/admin/articles/list",
            },
            {
                title: "Article Verification",
                url: "/admin/articles/requests",
            },
        ],
    },
    {
        title: "Transaction",
        url: "/admin/transactions",
        icon: ArrowLeftRight,
    },
    {
        title: "Lookup",
        url: "/admin/lookups",
        icon: Settings,
        isActive: true,
    },
];

// Data for the user component in the footer
const userData = {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/01.png",
};
const teamsData = [
    {
        name: "ToGather",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },
    {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
    },
    {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
    },
];

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teamsData} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={sidebarNavItems} />
            </SidebarContent>
            <SidebarFooter>
                {/* The NavUser component has been restored in the footer */}
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
