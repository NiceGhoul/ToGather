import Navbar_User from "../Components/Navbar_User"
export default function Layout_User({children}){
    return(
        <>
            <Navbar_User/>
            <main>
                {children}
            </main>
        </>
    )
}