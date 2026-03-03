'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Shield, ShoppingBag, User, LogOut, LayoutDashboard, UserPlus, Menu, X, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { user, signOut, isAdmin, grantAdminStatus } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('wrap4all-cart') || '[]');
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  return (
    <nav className={`fixed top-0 z-[100] w-full transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex h-16 items-center justify-between px-6 rounded-full border transition-all duration-500 ${isScrolled ? 'bg-background/70 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="font-headline text-2xl font-black tracking-tighter text-primary flex items-center"
            >
              WRAP<span className="text-foreground transition-colors group-hover:text-primary">4</span>ALL
            </motion.span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 font-headline text-[10px] uppercase tracking-[0.3em] font-black">
            <Link href="/products" className="hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-primary after:transition-all">Armory</Link>
            <Link href="/custom" className="hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-primary after:transition-all">Lab</Link>
            <Link href="/about" className="hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-primary after:transition-all">Drops</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="hidden xl:block">
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 font-headline uppercase text-[9px] tracking-[0.2em] gap-2 border border-accent/20 rounded-full px-4">
                  <Shield className="h-3 w-3" /> Dashboard
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 group">
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white/5 transition-all hover:ring-primary/50 overflow-hidden">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card/90 backdrop-blur-xl border-white/10 p-2 rounded-2xl shadow-2xl">
                  <div className="flex flex-col space-y-1 p-3">
                    <p className="text-xs font-headline uppercase font-black tracking-widest">{user.displayName || 'User Profile'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-xl py-2">
                     <Link href="/orders" className="font-headline uppercase text-[10px] tracking-widest">Orders</Link>
                  </DropdownMenuItem>
                  
                  {isAdmin ? (
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 text-primary rounded-xl py-2">
                      <Link href="/admin" className="flex items-center gap-2 font-headline uppercase text-[10px] tracking-widest">
                        <LayoutDashboard className="h-3 w-3" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="cursor-pointer focus:bg-accent/10 text-accent rounded-xl py-2" 
                      onClick={grantAdminStatus}
                    >
                      <UserPlus className="mr-2 h-3 w-3" /> <span className="font-headline uppercase text-[10px] tracking-widest">Become Admin (Dev)</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem className="cursor-pointer focus:bg-destructive/10 text-destructive rounded-xl py-2" onClick={signOut}>
                    <LogOut className="mr-2 h-3 w-3" /> <span className="font-headline uppercase text-[10px] tracking-widest">Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="font-headline uppercase text-[10px] tracking-[0.2em] rounded-full px-8 h-10 glow-primary transition-transform hover:scale-105">
                <Link href="/login">Connect</Link>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-24 left-4 right-4 bg-card/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 z-[90] shadow-2xl"
          >
            <div className="flex flex-col gap-6 font-headline text-lg uppercase font-black tracking-[0.2em] text-center">
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>Armory</Link>
              <Link href="/custom" onClick={() => setIsMobileMenuOpen(false)}>Lab</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Drops</Link>
              {isAdmin && (
                <Link href="/admin" className="text-accent" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              {!user && (
                <Link href="/login" className="text-primary" onClick={() => setIsMobileMenuOpen(false)}>Connect</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
