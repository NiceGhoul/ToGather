import { Link } from "@inertiajs/react";

export default function Navbar_Guest() {
    return (
        <>
            <header>
                <nav className="flex justify-between items-center px-6 py-4">
                    <div>
                        <Link className="nav-link" href="/">
                            Home 
                        </Link>
                        <Link className="nav-link" href="/">
                            Campaign 
                        </Link>
                        <Link className="nav-link" href="/">
                            Article 
                        </Link>
                    </div>

                    <div className="flex gap-4">
                        <Link className="nav-link" href="/users/create">
                            SignUp
                        </Link>
                        <Link className="nav-link" href="/login">
                            Login
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}
