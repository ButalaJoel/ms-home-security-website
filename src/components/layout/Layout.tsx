import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.tsx";
import MobileMenu from "./MobileMenu.tsx";
import SearchModal from "./SearchModal.tsx";
import CartDrawer from "./CartDrawer.tsx";
import Footer from "./Footer.tsx";
import SideButtons from "./SideButtons.tsx";

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // New page: go to the top, or to the #section the link names.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header onSearch={() => setSearchOpen(true)} onMenu={() => setMenuOpen(true)} />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <SideButtons />
      <SearchModal open={searchOpen} onClose={closeSearch} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <CartDrawer />
    </div>
  );
}
