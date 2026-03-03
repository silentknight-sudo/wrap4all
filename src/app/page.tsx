'use client';

import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Zap, ShieldCheck, Cpu, ArrowDown } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function Home() {
  const db = useFirestore();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl;
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const featuredQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), limit(8), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: featuredProducts, isLoading } = useCollection(featuredQuery);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-20 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background z-10" />
          <motion.div 
            style={{ y: y1 }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        </div>

        <div className="container relative z-20 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-6 inline-block font-headline text-[10px] font-black uppercase tracking-[0.5em] text-primary bg-primary/10 px-6 py-2 rounded-full border border-primary/30 backdrop-blur-md">
              Evolved Hardware Protection
            </span>
            <h1 className="mb-8 font-headline text-7xl font-black uppercase leading-[0.9] tracking-tighter md:text-9xl lg:text-[11rem]">
              MATERIAL <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient">SHIFT</span>
            </h1>
            <p className="mx-auto mb-12 max-w-xl font-body text-lg text-muted-foreground/80 md:text-xl leading-relaxed">
              Industrial-grade tech armor for the digital avant-garde. Millimeter-perfect precision. Zero-bulk aesthetic.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button asChild size="lg" className="group h-16 px-10 rounded-full font-headline text-sm uppercase tracking-widest bg-primary text-primary-foreground hover:scale-105 transition-transform glow-primary">
                <Link href="/products">
                  Enter Armory <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-full font-headline text-sm uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:border-primary/50 backdrop-blur-md">
                <Link href="/custom">Custom Lab</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Material Elements */}
        <motion.div 
          style={{ y: y2 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute left-[10%] top-1/4 hidden lg:block"
        >
          <div className="h-40 w-40 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent backdrop-blur-3xl border border-white/10 rotate-12" />
        </motion.div>
        
        <motion.div 
          style={{ y: y1 }}
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[15%] bottom-1/4 hidden lg:block"
        >
          <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-secondary/10 to-transparent backdrop-blur-2xl border border-white/5" />
        </motion.div>

        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-primary/40"
        >
          <ArrowDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* Feature Section - The Manifesto */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {[
              { icon: Zap, title: "Hyper-Speed", desc: "Same-day deployment on all local armor orders." },
              { icon: ShieldCheck, title: "Void-Proof", desc: "Military-spec vinyl that resists the deepest scuffs." },
              { icon: Cpu, title: "CAD-Pure", desc: "1:1 hardware mapping for absolute zero-gap fit." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[2.5rem] bg-card/30 border border-white/5 hover:border-primary/20 transition-all hover:bg-card/50"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-headline text-2xl font-bold uppercase mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground/70 font-body leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid - New Arrivals */}
      <section className="py-32 bg-card/20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <h2 className="font-headline text-5xl font-black uppercase tracking-tighter md:text-7xl">
              RECENT <span className="text-primary">DROPS</span>
            </h2>
            <p className="text-muted-foreground mt-4 font-headline uppercase tracking-[0.2em] text-xs">Synchronizing with current trends</p>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="h-[450px] rounded-3xl bg-card/50 animate-pulse border border-white/5" />
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
          
          <div className="mt-20 text-center">
            <Button asChild variant="ghost" className="font-headline uppercase tracking-widest text-primary hover:bg-primary/10 rounded-full px-12 h-14">
              <Link href="/products">View Full Armory Manifest</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="text-center md:text-left">
              <span className="font-headline text-3xl font-black tracking-tighter text-primary">
                WRAP<span className="text-foreground">4</span>ALL
              </span>
              <p className="mt-2 text-xs font-headline uppercase tracking-[0.3em] text-muted-foreground">Premium Hardware Aesthetics</p>
            </div>
            
            <div className="flex gap-12 font-headline text-[10px] uppercase tracking-widest text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link>
              <Link href="#" className="hover:text-primary transition-colors">Usage Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Global Logistics</Link>
            </div>
            
            <div className="text-center md:text-right">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">© 2024 WRAP4ALL INDUSTRIAL. MADE FOR THE GRID.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}