
'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
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

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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
    // Simple local storage cart implementation
    const cart = JSON.parse(localStorage.getItem('wrap4all-cart') || '[]');
    const existing = cart.find((item: any) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, imageUrl, quantity: 1 });
    }
    localStorage.setItem('wrap4all-cart', JSON.stringify(cart));
    
    // Dispatch custom event for navbar update
    window.dispatchEvent(new Event('cart-updated'));

    toast({
      title: "Added to Cart",
      description: `${name} has been added to your bag.`,
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
      className="relative h-[420px] w-full rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-px"
    >
      <Card
        className="h-full w-full overflow-hidden bg-card/80 backdrop-blur-sm transition-colors border-none flex flex-col"
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
      >
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={imageUrl || 'https://picsum.photos/seed/wrap/400/400'}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            data-ai-hint="product skin"
          />
          <Badge className="absolute left-3 top-3 bg-primary text-white font-headline uppercase text-[10px]">
            {category}
          </Badge>
          {stockCount < 10 && (
            <Badge variant="destructive" className="absolute right-3 top-3 font-headline uppercase text-[10px] animate-pulse">
              Low Stock
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col flex-1 gap-3 p-5" style={{ transform: "translateZ(50px)" }}>
          <div className="flex-1">
            <h3 className="font-headline text-lg font-bold text-foreground leading-tight line-clamp-2">
              {name}
            </h3>
            <p className="font-body text-xl font-black text-primary mt-1">₹{price}</p>
          </div>
          
          <Button 
            onClick={addToCart}
            className="mt-auto w-full group overflow-hidden relative" 
            variant="outline"
            disabled={stockCount <= 0}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-primary-foreground transition-colors">
              <ShoppingCart className="h-4 w-4" /> {stockCount > 0 ? 'Add to Cart' : 'Out of Stock'}
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
