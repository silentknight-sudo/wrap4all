'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Info, ArrowRight, Layers, Box } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CustomLab() {
  const [selectedTexture, setSelectedTexture] = useState(PlaceHolderImages[1].imageUrl);
  const [deviceType, setDeviceType] = useState('phone');

  const textures = PlaceHolderImages.filter(img => img.imageHint.includes('skin') || img.imageHint.includes('texture') || img.imageHint.includes('3d'));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-32">
        <div className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-headline text-6xl font-black uppercase tracking-tighter md:text-8xl lg:text-9xl"
          >
            CUSTOM <span className="text-primary">LAB</span>
          </motion.h1>
          <p className="font-body text-muted-foreground mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Neural-mapped styling for your specific hardware. Select your chassis and apply high-performance polymer textures.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 items-center max-w-6xl mx-auto">
          {/* Preview Area - Simulation Hub */}
          <div className="relative group">
            <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full opacity-50" />
            <div className="relative aspect-square rounded-[4rem] bg-card/30 backdrop-blur-2xl border border-white/5 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${deviceType}-${selectedTexture}`}
                  initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateX: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full perspective-1000 z-10"
                >
                  <div className={`relative mx-auto h-full w-full max-w-[360px] overflow-hidden rounded-[3.5rem] border-[12px] border-background shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]`}>
                     <img 
                      src={selectedTexture} 
                      alt="Skin Preview" 
                      className="h-full w-full object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
                     
                     {/* Hardware Mockup details */}
                     <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 text-[10px] font-headline uppercase font-black tracking-[0.3em] z-20">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" /> SIMULATION ACTIVE
              </div>
            </div>
          </div>

          {/* Configurator Area - Parameters */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Box className="h-5 w-5 text-primary" />
                <Label className="font-headline uppercase tracking-[0.4em] text-muted-foreground text-[10px] font-black">Step 01: Chassis Selection</Label>
              </div>
              <RadioGroup value={deviceType} onValueChange={setDeviceType} className="grid grid-cols-2 gap-4">
                {['phone', 'laptop'].map((type) => (
                  <div key={type} className="relative">
                    <RadioGroupItem value={type} id={type} className="peer sr-only" />
                    <Label htmlFor={type} className="flex items-center justify-center h-16 rounded-2xl border border-white/5 bg-card/40 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all uppercase font-headline font-black text-xs tracking-widest">
                      {type === 'phone' ? 'Mobile Chassis' : 'Laptop Deck'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-primary" />
                <Label className="font-headline uppercase tracking-[0.4em] text-muted-foreground text-[10px] font-black">Step 02: Material Application</Label>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {textures.map((texture, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTexture(texture.imageUrl)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedTexture === texture.imageUrl ? 'border-primary shadow-[0_0_20px_hsla(var(--primary),0.3)]' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={texture.imageUrl} alt="" className="h-full w-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-card/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles className="h-20 w-20" />
              </div>
              
              <div className="flex items-start gap-4">
                <Info className="h-6 w-6 text-primary mt-1 shrink-0" />
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  Armor deployments are laser-etched within a <span className="text-foreground font-bold">0.05mm</span> tolerance. Heat-resistant adhesion protocol included.
                </p>
              </div>
              
              <Button className="w-full h-16 font-headline uppercase font-black tracking-[0.3em] rounded-full glow-primary text-sm hover:scale-[1.02] transition-transform">
                INITIATE ORDER <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              
              <div className="flex justify-between items-center text-[10px] uppercase font-headline text-muted-foreground font-black tracking-widest">
                <span>EST: ₹250.00</span>
                <span>SECURE CHECKOUT</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}