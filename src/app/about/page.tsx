
'use client';

import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Github, Twitter, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20 max-w-5xl">
        <section className="mb-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-6xl font-black uppercase tracking-tighter mb-8 md:text-8xl"
          >
            The <span className="text-primary">Manifesto</span>
          </motion.h1>
          <div className="grid gap-12 md:grid-cols-3">
             <div className="p-8 rounded-3xl bg-card/50 border border-primary/10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-headline font-bold uppercase">Armor Grade</h3>
                <p className="text-sm text-muted-foreground">We use high-performance vinyl materials traditionally reserved for aerospace and automotive sectors.</p>
             </div>
             <div className="p-8 rounded-3xl bg-card/50 border border-primary/10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-headline font-bold uppercase">Hyper Precision</h3>
                <p className="text-sm text-muted-foreground">Every wrap is designed using millimeter-perfect CAD measurements for a true 1:1 holographic fit.</p>
             </div>
             <div className="p-8 rounded-3xl bg-card/50 border border-primary/10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-headline font-bold uppercase">Ethical Drops</h3>
                <p className="text-sm text-muted-foreground">Our production lab operates on 100% renewable energy and maintains a zero-waste policy for all cut-offs.</p>
             </div>
          </div>
        </section>

        <section className="grid gap-12 md:grid-cols-2 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-headline text-4xl font-bold uppercase tracking-tight">Future <span className="text-accent">Drops</span></h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Wrap4all isn't just a store; it's a digital collective. We release limited edition textures every month—designed in collaboration with digital artists and cyberpunk creators from around the world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"><Github className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-primary/20 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/aboutdrop/800/600" 
              alt="Lab" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-6 left-6 font-headline">
              <p className="text-[10px] uppercase tracking-widest text-primary">Location</p>
              <p className="text-xl font-bold uppercase">Sub-Level Lab 04</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
