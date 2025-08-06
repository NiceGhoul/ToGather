import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <Layout_Admin>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                </p>
            </div>
        </Layout_Admin>
    );
}