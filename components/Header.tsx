import { currentUser } from "@clerk/nextjs/server";
import CartIcon from "./CartIcon";
import Container from "./Container";
import FavoriteButton from "./FavoriteButton";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import SignIn from "./SignIn";
import { ClerkLoaded, Show, SignedIn, UserButton } from "@clerk/nextjs";

const Header = async() => {
    const user = await currentUser();
    return (
        <header className="bg-white/70 py-5 sticky top-0 z-50  backdrop-blur-md">
            <Container className="flex items-center justify-between text-lightColor">
                <div className="w-auto md:w-1/3 flex items-center justify-start gap-2.5 md:gap-0">
                    <MobileMenu/>
                    <Logo/>
                </div>
                <HeaderMenu/>
                <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
                    <SearchBar/>
                    <CartIcon/>
                    <FavoriteButton showProduct={true} />
                    <ClerkLoaded>
                        <Show when="signed-in">
                            <UserButton/>
                        </Show>
                        {!user && <SignIn/>}
                    </ClerkLoaded>
                </div>
                {/* Admin */}
            </Container>

        </header>
    )
}

export default Header;