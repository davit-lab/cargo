import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ka" ? "en" : "ka";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">EquipGeo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/equipment" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.equipment", "სერვისები")}
          </Link>
          <button onClick={toggleLanguage} className="text-sm font-medium hover:text-primary transition-colors">
            {i18n.language === "ka" ? "EN" : "KA"}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={userRole === "admin" ? "/admin" : "/owner"} className="text-sm font-medium hover:text-primary transition-colors">
                {t("nav.dashboard", "პანელი")}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav.signOut", "გამოსვლა")}
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm">{t("nav.signIn", "შესვლა")}</Button>
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <Link to="/equipment" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
            {t("nav.equipment", "სერვისები")}
          </Link>
          <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="block text-sm font-medium">
            {i18n.language === "ka" ? "English" : "ქართული"}
          </button>
          {user ? (
            <>
              <Link to={userRole === "admin" ? "/admin" : "/owner"} className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                {t("nav.dashboard", "პანელი")}
              </Link>
              <button onClick={handleSignOut} className="block text-sm font-medium text-red-500">
                {t("nav.signOut", "გამოსვლა")}
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">{t("nav.signIn", "შესვლა")}</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
