import { Link, usePage, router } from "@inertiajs/react";

export default function Navbar_User() {
    const handleLogout = () => {
        router.post("/logout");
    };
    const { props } = usePage();
    const auth = props.auth;

    return (
        <header>
            <nav>
                <Link className="nav-link" href="/">
                    Home for User
                </Link>
                <span className="nav-link font-semibold">
                    Welcome {auth?.user?.nickname ?? "Guest"}
                </span>
                <button
                    onClick={handleLogout}
                    className="nav-link bg-transparent border-none cursor-pointer"
                    type="button"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
}
