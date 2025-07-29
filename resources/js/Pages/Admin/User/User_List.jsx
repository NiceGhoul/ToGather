import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage } from "@inertiajs/react";

export default function UserList({users}) {
    const { auth } = usePage().props;

    return (
        <Layout_Admin>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    User List
                </h1>
                
            </div>
        </Layout_Admin>
    );
}