import { usePage } from "@inertiajs/react";
import Layout_User from "../Layouts/Layout_User";
import Layout_Guest from "../Layouts/Layout_Guest";

export default function Home() {
    const { auth } = usePage().props;
    const Layout = auth.user ? Layout_User : Layout_Guest;

    return (
        <Layout>
            <h1 className="title">This is Home</h1>
        </Layout>
    );
}
