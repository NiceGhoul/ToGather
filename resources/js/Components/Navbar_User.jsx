import { Link } from '@inertiajs/react';

export default function Navbar_User(){
    return (
        <>
            <header>
                <nav>
                    <Link className="nav-link" href="/">Home</Link>
                    <Link className="nav-link" href="/users/create">SignUp</Link>
                </nav>
            </header>
        </>
    )
}