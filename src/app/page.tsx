
'use client';

import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function Home() {
  const db = useFirestore();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl;

  const featuredQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), limit(4), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: featuredProducts, isLoading } = useCollection(featuredQuery);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-20 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.5 }}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="mb-4 inline-block font-headline text-xs font-bold uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              Future of Tech Styling
            </span>
            <h1 className="mb-6 font-headline text-6xl font-black uppercase leading-none tracking-tighter md:text-8xl lg:text-9xl">
              ARMOR <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">YOUR TECH</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-body text-lg text-muted-foreground md:text-xl">
              Precision-cut wraps starting at just ₹250. Engineered for the digital generation with premium high-performance materials.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group h-14 px-8 font-headline text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 glow-primary">
                <Link href="/products">
                  Shop Catalog <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 font-headline text-sm uppercase tracking-widest border-primary/50 hover:bg-primary/10">
                <Link href="/custom">Custom Lab</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-10 top-1/4 hidden lg:block"
        >
          <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-3xl border border-white/10" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-10 bottom-1/4 hidden lg:block"
        >
          <div className="h-48 w-48 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 backdrop-blur-3xl border border-white/5" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/30 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-xl font-bold uppercase">Zero-Bulk Armor</h3>
              <p className="font-body text-muted-foreground">Ultra-thin skins offering military-grade scratch protection without adding perceptible weight.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-xl font-bold uppercase">Laser Precision</h3>
              <p className="font-body text-muted-foreground">Every wrap is custom-designed using advanced CAD measurements for a 1:1 holographic fit.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-headline text-xl font-bold uppercase">Heat-Sync Grip</h3>
              <p className="font-body text-muted-foreground">Specialized micro-channel adhesive that actually improves grip as your device warms up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="font-headline text-4xl font-black uppercase tracking-tight md:text-5xl">New Drops</h2>
              <p className="font-body text-muted-foreground mt-2">Limited edition textures fresh from the lab.</p>
            </div>
            <Button asChild variant="link" className="font-headline uppercase tracking-widest text-accent hover:text-primary p-0">
              <Link href="/products">View All Arrivals</Link>
            </Button>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="h-96 rounded-xl bg-card animate-pulse border border-primary/5" />
               ))}
             </div>
          ) : (
            <div className="perspective-1000 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <span className="font-headline text-2xl font-bold tracking-tighter text-primary">
              WRAP<span className="text-accent">4</span>ALL
            </span>
            <div className="flex gap-8 font-headline text-xs uppercase tracking-widest">
              <Link href="/about" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/about" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/about" className="hover:text-primary transition-colors">Shipping</Link>
            </div>
            <p className="font-body text-xs text-muted-foreground">© 2024 WRAP4ALL. Engineered for the Gen-Z future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
