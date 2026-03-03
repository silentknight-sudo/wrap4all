
'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CartPage() {
  const { user, signIn } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('wrap4all-cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('wrap4all-cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('wrap4all-cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please connect your wallet/account to checkout." });
      signIn();
      return;
    }

    if (!db) return;

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cartItems,
        totalAmount: total,
        status: 'Pending',
        timestamp: serverTimestamp()
      });

      localStorage.removeItem('wrap4all-cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cart-updated'));
      
      toast({ title: "Order Placed", description: "Your tech armor is being prepared." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Checkout failed. System failure." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-headline text-4xl font-black uppercase tracking-tight mb-8">
          Your <span className="text-primary">Stash</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-primary/10 rounded-3xl bg-card/30">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="font-headline uppercase font-bold text-xl mb-4">Your bag is empty</p>
            <Button asChild className="glow-primary">
              <Link href="/products">Go to Armory</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-card/50 p-4 rounded-2xl border border-primary/10 backdrop-blur-sm">
                  <div className="h-20 w-20 rounded-xl overflow-hidden relative flex-shrink-0 border border-primary/20">
                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-sm truncate uppercase">{item.name}</h3>
                    <p className="text-primary font-black text-lg">₹{item.price}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-primary/10 transition-colors">-</button>
                        <span className="px-3 py-1 font-mono">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-primary/10 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-card/50 p-6 rounded-2xl border border-primary/20 backdrop-blur-sm sticky top-24">
                <h2 className="font-headline uppercase font-bold text-lg mb-4">Summary</h2>
                <div className="space-y-2 font-body">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-accent">FREE</span>
                  </div>
                  <div className="border-t border-primary/10 my-4 pt-4 flex justify-between font-black text-xl">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full mt-6 h-12 font-headline uppercase tracking-widest glow-primary">
                  Proceed to Terminal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
