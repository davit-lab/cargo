import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Menu, 
  X, 
  User, 
  LogOut, 
  MessageSquare, 
  PlusCircle, 
  Map as MapIcon,
  Package,
  Construction,
  ChevronRight,
  CreditCard as CardIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile } = useAuthStore();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ka' ? 'en' : 'ka';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: t('common.home'), path: '/', icon: <Truck className="h-4 w-4" /> },
    { name: t('common.cargo'), path: '/cargo', icon: <Package className="h-4 w-4" /> },
    { name: t('common.routes'), path: '/routes', icon: <Truck className="h-4 w-4" /> },
    { name: t('common.heavyEquipment'), path: '/heavy-equipment', icon: <Construction className="h-4 w-4" /> },
    { name: t('common.map'), path: '/map', icon: <MapIcon className="h-4 w-4" /> },
    { name: t('common.packets'), path: '/packets', icon: <PlusCircle className="h-4 w-4" /> },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`mx-auto max-w-screen-2xl rounded-full transition-all duration-500 border ${
          scrolled 
            ? 'bg-background/80 backdrop-blur-xl py-3 px-6 shadow-2xl border-border/50' 
            : 'bg-transparent border-transparent py-3 px-6'
        }`}>
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase hidden sm:block">
                CargoConnect<span className="text-primary">GE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-border/50">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-black transition-all duration-500 flex items-center gap-2 group ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <span className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-primary'}`}>
                        {link.icon}
                      </span>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="rounded-full font-black text-[11px] uppercase tracking-widest h-10 px-4 hover:bg-secondary/50 transition-all active:scale-95"
              >
                {i18n.language === 'ka' ? 'English' : 'ქართული'}
              </Button>
              {user ? (
                <>
                  {profile?.role === 'owner' && (
                    <Link to="/owner">
                      <Button variant="ghost" size="sm" className="rounded-full font-black text-[11px] uppercase tracking-widest h-10 px-4 hover:bg-secondary/50 transition-all active:scale-95">
                        {t('common.dashboard')}
                      </Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <Link to="/messages">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 relative">
                        <MessageSquare className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full" />
                      </Button>
                    </Link>
                    <Link to="/billing">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50">
                        <CardIcon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  {profile?.role === 'owner' && (
                    <Link to="/create-post">
                      <Button className="rounded-full font-black text-[11px] uppercase tracking-widest px-6 h-11 shadow-xl shadow-primary/20">
                        {t('common.createPost')}
                      </Button>
                    </Link>
                  )}
                  <div className="h-6 w-[1px] bg-border mx-1" />
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all duration-500">
                      <AvatarImage src={profile?.photoURL} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black">
                        {profile?.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <Link to="/login">
                  <Button className="rounded-full font-black text-[11px] uppercase tracking-widest px-8 h-11 shadow-xl shadow-primary/20">{t('common.login')}</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="rounded-full font-black text-[11px] uppercase tracking-widest h-10 px-4 hover:bg-secondary/50 transition-all active:scale-95"
              >
                {i18n.language === 'ka' ? 'EN' : 'KA'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-6 space-y-8 shadow-2xl"
          >
            <div className="grid grid-cols-1 gap-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-5 rounded-3xl transition-all duration-500 group ${
                      location.pathname === link.path
                        ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20'
                        : 'bg-secondary/50 text-foreground hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl transition-colors ${location.pathname === link.path ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                        {link.icon}
                      </div>
                      <span className="font-black uppercase tracking-[0.2em] text-[10px]">{link.name}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 ${location.pathname === link.path ? 'opacity-100' : 'opacity-30'}`} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {user ? (
              <div className="space-y-6 pt-6 border-t">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary">
                    <AvatarImage src={profile?.photoURL} />
                    <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black uppercase tracking-tight">{profile?.displayName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t(`auth.${profile?.role}`)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-14">{t('common.profile')}</Button>
                  </Link>
                  <Link to="/messages" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-14">{t('common.chats')}</Button>
                  </Link>
                  <Link to="/billing" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-14">{t('common.billing')}</Button>
                  </Link>
                  {profile?.role === 'owner' && (
                    <Link to="/owner" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-14">{t('common.dashboard')}</Button>
                    </Link>
                  )}
                </div>
                {profile?.role === 'owner' && (
                  <Link to="/create-post" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-16 shadow-xl shadow-primary/20">
                      {t('common.createPost')}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full rounded-2xl h-14 text-destructive font-black text-[10px] uppercase tracking-widest"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('common.logout')}
                </Button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-16 shadow-xl shadow-primary/20">{t('common.login')}</Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
