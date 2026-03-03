'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stockCount: number;
}

export function ProductCard({ id, name, price, imageUrl, category, stockCount }: ProductCardProps) {
  const { toast } = useToast();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('wrap4all-cart') || '[]');
    const existing = cart.find((item: any) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, imageUrl, quantity: 1 });
    }
    localStorage.setItem('wrap4all-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    toast({
      title: "Unit Secured",
      description: `${name} added to stash.`,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-[480px] w-full group"
    >
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <Card
        className="h-full w-full overflow-hidden bg-card/40 backdrop-blur-xl border border-white/5 transition-all duration-500 group-hover:border-primary/30 group-hover:bg-card/60 rounded-[2.5rem] flex flex-col relative"
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
      >
        <div className="relative h-64 w-full overflow-hidden p-4">
          <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/5 shadow-inner">
            <Image
              src={imageUrl || 'https://picsum.photos/seed/wrap/600/600'}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="tech wrap"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          <Badge className="absolute left-6 top-6 bg-background/80 backdrop-blur-md text-foreground border-white/10 font-headline uppercase text-[9px] tracking-widest px-3 py-1 rounded-full">
            {category}
          </Badge>
          
          {stockCount < 10 && stockCount > 0 && (
            <Badge variant="destructive" className="absolute right-6 top-6 font-headline uppercase text-[9px] tracking-widest px-3 py-1 rounded-full animate-pulse">
              LOW STOCK
            </Badge>
          )}
          
          {stockCount <= 0 && (
            <Badge variant="destructive" className="absolute right-6 top-6 font-headline uppercase text-[9px] tracking-widest px-3 py-1 rounded-full opacity-50">
              DEPLETED
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col flex-1 gap-4 p-8" style={{ transform: "translateZ(30px)" }}>
          <div className="flex-1">
            <h3 className="font-headline text-xl font-bold text-foreground leading-tight tracking-tight uppercase group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="font-headline text-[10px] uppercase tracking-widest text-muted-foreground">Retail Unit</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="font-headline text-3xl font-black text-foreground tracking-tighter">₹{price}</p>
            <Button 
              onClick={addToCart}
              className={`h-12 w-12 rounded-full p-0 flex items-center justify-center transition-all ${stockCount > 0 ? 'bg-primary text-primary-foreground hover:scale-110 glow-primary' : 'bg-muted text-muted-foreground'}`}
              disabled={stockCount <= 0}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}