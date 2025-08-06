import * as React from "react"
import Layout_Admin from "@/Layouts/Layout_Admin";
import Data_Table from "@/Components/Data_Table"; // Import the reusable component
import { ArrowUpDown, MoreHorizontal, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { router } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { usePage } from '@inertiajs/react';


export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="ml-4">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "nickname",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nickname
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize ml-1">{row.getValue("nickname")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="ml-1">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Address
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="truncate max-w-xs ml-1">{row.getValue("address")}</div>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            // Use a Badge for better visual feedback
            return (
                <Badge variant={status === 'banned' ? 'destructive' : 'default'}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created_At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            const formatted = date.toLocaleDateString("en-US");
            return <div className="ml-5">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            const handleBlockToggle = () => {
                const url = `/admin/users/${user.id}/${user.status === 'banned' ? 'unblock' : 'block'}`;
                router.post(url, {}, {
                    preserveScroll: true, // Keep the user's scroll position after the action
                });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Add the dynamic Block/Unblock option */}
                        <DropdownMenuItem onClick={handleBlockToggle}>
                            {user.status === 'banned' ? (
                                <CheckCircle className="mr-1 h-4 w-4 text-black focus:text-black" />
                            ) : (
                                <Ban className="mr-1 h-4 w-4 text-red-600 focus:text-red-600" />
                            )}
                            {user.status === 'banned' ? 'Unban user' : 'Ban user'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

// The page component is now much cleaner.
export default function User_List({ users }) {
    const { filters } = usePage().props;

    // Handler to change filter status
    const handleFilterChange = (status) => {
        router.get('/admin/users/list', { status }, {
        preserveState: true,
        replace: true,
    });
    };
    return (
        <Layout_Admin title="User List">
            <div className="p-9">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant={!filters.status ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange(null)}
                    >
                        All
                    </Button>
                    <Button
                        variant={filters.status === 'active' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={filters.status === 'banned' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('banned')}
                    >
                        banned
                    </Button>
                </div>
                <Data_Table columns={columns} data={users} />
            </div>
        </Layout_Admin>
    );
}
