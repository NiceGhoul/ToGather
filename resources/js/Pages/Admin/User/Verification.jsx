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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { router } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { usePage } from '@inertiajs/react';

const handleVerification = async (user, action) => {
    try {
        const url = `/users/${user}/verify`;
        console.log("Requesting URL:", url);
        const response = await fetch(`/users/${user}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ acceptance: action })
        });

        if (!response.ok) {
            // Check for 404 specifically
            if (response.status === 404) {
                throw new Error('API route not found. Check the URL.');
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Verification failed');
        }

        const result = await response.json();
        console.log('Verification successful:', result);
        alert(`User has been ${action}.`);

        window.location.reload();

    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred: ${error.message}`);
    }
};
const statusVariantMap = {
    accepted: 'default',
    pending: 'secondary',
    rejected: 'destructive',
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
        accessorKey: "user.email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="ml-1">{row.original.user.email}</div>,
    },
    {
        accessorKey: "id_photo",
        header: "ID Photo",
        cell: ({ row }) => {
            const imageUrl = row.original.images?.id_photo_path;

            return (
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" disabled={!imageUrl}>
                                View ID Photo
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="ID Photo"
                                    className="w-full h-auto rounded-md object-cover border"
                                />
                            ) : (
                                <p className="text-sm text-gray-500">No ID photo provided.</p>
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
            );
        }
    },
    {
        accessorKey: "selfie_with_id",
        header: "Selfie with ID",
        cell: ({ row }) => {
            const imageUrl = row.original.images?.selfie_with_id_path;

            return (
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" disabled={!imageUrl}>
                                View Selfie
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Selfie with ID"
                                    className="w-full h-auto rounded-md object-cover border"
                                />
                            ) : (
                                <p className="text-sm text-gray-500">No selfie provided.</p>
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
            );
        }
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
            const request = row.original;
            const status = request.status;

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
                            onClick={() => navigator.clipboard.writeText(request.user.id.toString())}
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {/* --- Conditional Actions Start Here --- */}

                        {/* Show "Approve" button ONLY if status is 'pending' */}
                        {status === 'pending' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        Approve
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Approve Verification?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to approve this user's verification?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleVerification(request.user.id, 'accepted')}>
                                            Approve
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {/* Show "Reject" button if status is 'pending' OR 'accepted' */}
                        {(status === 'pending' || status === 'accepted') && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                        Reject
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reject Verification?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to reject this user's verification?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleVerification(request.user.id, 'rejected')}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Reject
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

// The page component is now much cleaner.
export default function Verification({ requests }) {
    const { filters } = usePage().props;
    const handleFilterChange = (status) => {
        router.get('/admin/users/verification', { status }, {
            preserveState: true,
            replace: true,
        });
    }
    return (
        <Layout_Admin title="User Verification List">
            <div className="p-9">
                <div className="flex items-center gap-2 mb-4">

                    <Button
                        variant={!filters.status ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange(null)}
                    >
                        All
                    </Button>
                    <Button
                        variant={filters.status === 'accepted' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('accepted')}
                    >
                        Accepted
                    </Button>
                    <Button
                        variant={filters.status === 'pending' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('pending')}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filters.status === 'rejected' ? 'secondary' : 'outline'}
                        onClick={() => handleFilterChange('rejected')}
                    >
                        Rejected
                    </Button>
                </div>
                <Data_Table columns={columns} data={requests} />
            </div>
        </Layout_Admin>
    );
}
