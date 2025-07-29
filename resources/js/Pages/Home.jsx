import { usePage } from "@inertiajs/react";
import Layout_User from "../Layouts/Layout_User";
import Layout_Guest from "../Layouts/Layout_Guest";

export default function Home() {
    const { auth } = usePage().props;
    let Layout;

    if (!auth.user) {
        Layout = Layout_Guest;
    } else {
        Layout = Layout_User;
    }

    return (
        <Layout>
            
        </Layout>
    );
}
