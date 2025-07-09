import { Link } from "@inertiajs/react";

export default function Navbar_Guest() {
    return (
        <>
            <header>
                <nav>
                    <Link className="nav-link" href="/">
                        Home for Guest
                    </Link>
                    <Link className="nav-link" href="/users/create">
                        SignUp
                    </Link>
                    <Link className="nav-link" href="/login">
                        Login
                    </Link>
                </nav>
            </header>
        </>
    );
}
