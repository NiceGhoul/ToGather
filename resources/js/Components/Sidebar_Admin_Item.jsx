import * as React from "react" 
import { 
  LayoutDashboard, 
  Users, 
  Volume2, 
  ArrowLeftRight,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react" 
 
import { NavMain } from "@/Components/Sidebar_Admin" 
import { NavUser } from "@/Components/Sidebar_Admin_Profile" 
import { TeamSwitcher } from "@/components/team-switcher" 
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarRail, 
} from "@/components/ui/sidebar" 

// Data for the main navigation
const sidebarNavItems = [ 
  { 
    title: "Dashboard", 
    url: "#", 
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
        url: "#", 
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
        url: "#", 
      }, 
      { 
        title: "Campaign Verification", 
        url: "#", 
      }, 
    ], 
  }, 
  { 
    title: "Transaction", 
    url: "#", 
    icon: ArrowLeftRight, 
  }, 
] 

// Data for the user component in the footer
const userData = { 
  name: "Admin User", 
  email: "admin@example.com", 
  avatar: "/avatars/01.png", 
}
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
]

export function AppSidebar({ 
  ...props 
}) { 
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
  ) 
}