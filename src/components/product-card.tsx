
'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stockCount: number;
}

export function ProductCard({ name, price, imageUrl, category, stockCount }: ProductCardProps) {
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

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-96 w-full rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-px"
    >
      <Card
        className="h-full w-full overflow-hidden bg-card/80 backdrop-blur-sm transition-colors border-none"
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl || 'https://picsum.photos/seed/wrap/400/400'}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            data-ai-hint="phone skin"
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
        
        <div className="flex flex-col gap-3 p-5" style={{ transform: "translateZ(50px)" }}>
          <div>
            <h3 className="font-headline text-lg font-bold text-foreground leading-tight truncate">
              {name}
            </h3>
            <p className="font-body text-xl font-bold text-primary">${price.toFixed(2)}</p>
          </div>
          
          <Button className="mt-auto w-full group overflow-hidden relative" variant="outline">
            <span className="relative z-10 flex items-center gap-2 group-hover:text-primary-foreground transition-colors">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
