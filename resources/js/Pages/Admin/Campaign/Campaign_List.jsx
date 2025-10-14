                            import * as React from "react"
import Layout_Admin from "@/Layouts/Layout_Admin";
import Data_Table from "@/Components/Data_Table"; // Import the reusable component
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
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

const statusVariantMap = {
    active: 'default',
    completed: 'secondary',
    rejected: 'destructive',
    banned: 'destructive',
};
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
        accessorKey: "user.nickname", // Access the user's nickname
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Creator
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize ml-1">{row.original.user?.nickname || 'N/A'}</div>
    },
    {
        accessorKey: "verifier.nickname", // Access the verifier's nickname
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Verifier
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize ml-1">{row.original.verifier?.nickname || 'N/A'}</div>
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize ml-1">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status");
            return (
                <Badge variant={statusVariantMap[status] || 'default'}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "goal_amount",
        header: "Goal Amount",
        cell: ({ row }) => <div className="capitalize">{row.getValue("goal_amount")}</div>,
    },
    {
        accessorKey: "collected_amount",
        header: "Collected",
        cell: ({ row }) => <div className="capitalize">{row.getValue("collected_amount")}</div>,
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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id.toString())}
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View user details</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

// The page component is now much cleaner.
export default function Campaign_List({ campaigns }) {
    const { filters } = usePage().props;
    const handleFilterChange = (status) => {
            router.get('/admin/campaigns/list', { status }, {
            preserveState: true,
            replace: true,
        });
    }
    return (
        <Layout_Admin title="Campaign List">
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
                        variant={filters.status === 'completed' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('completed')}
                    >
                        Completed
                    </Button>
                    <Button
                        variant={filters.status === 'rejected' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('rejected')}
                    >
                        Rejected
                    </Button>
                    <Button
                        variant={filters.status === 'banned' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('banned')}
                    >
                        banned
                    </Button>
                </div>
                <Data_Table columns={columns} data={campaigns} />
            </div>
        </Layout_Admin>
    );
}
