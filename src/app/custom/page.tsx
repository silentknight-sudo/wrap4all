
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Info, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CustomLab() {
  const [selectedTexture, setSelectedTexture] = useState(PlaceHolderImages[1].imageUrl);
  const [deviceType, setDeviceType] = useState('phone');

  const textures = PlaceHolderImages.filter(img => img.imageHint.includes('skin') || img.imageHint.includes('texture'));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-5xl font-black uppercase tracking-tight md:text-7xl">
            Custom <span className="text-primary">Lab</span>
          </h1>
          <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
            Engineered styling for your specific hardware. Select your base and apply high-performance textures in real-time.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Preview Area */}
          <div className="relative aspect-square rounded-[3rem] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-8 border border-primary/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${deviceType}-${selectedTexture}`}
                initial={{ opacity: 0, scale: 0.9, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -45 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-full perspective-1000"
              >
                <div className={`relative mx-auto h-full w-full max-w-[400px] overflow-hidden rounded-[2.5rem] border-8 border-background shadow-2xl`}>
                   <img 
                    src={selectedTexture} 
                    alt="Skin Preview" 
                    className="h-full w-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
                   
                   {/* Device Specific Mockup elements */}
                   {deviceType === 'phone' && (
                     <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full" />
                   )}
                   {deviceType === 'laptop' && (
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full" />
                   )}
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2 text-xs font-headline uppercase tracking-widest">
              <Sparkles className="h-3 w-3 text-primary" /> Real-time Simulation
            </div>
          </div>

          {/* Configurator Area */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="font-headline uppercase tracking-widest text-muted-foreground text-xs">01 Select Platform</Label>
              <RadioGroup value={deviceType} onValueChange={setDeviceType} className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <RadioGroupItem value="phone" id="phone" className="peer sr-only" />
                  <Label htmlFor="phone" className="flex items-center justify-center p-4 rounded-xl border-2 border-muted hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all uppercase font-headline font-bold text-sm">
                    Mobile Armor
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="laptop" id="laptop" className="peer sr-only" />
                  <Label htmlFor="laptop" className="flex items-center justify-center p-4 rounded-xl border-2 border-muted hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all uppercase font-headline font-bold text-sm">
                    Laptop Deck
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="font-headline uppercase tracking-widest text-muted-foreground text-xs">02 Choose Texture</Label>
              <div className="grid grid-cols-4 gap-4">
                {textures.map((texture, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTexture(texture.imageUrl)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedTexture === texture.imageUrl ? 'border-primary scale-105 glow-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={texture.imageUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-1" />
                <p className="text-sm font-body text-muted-foreground">
                  Custom skins are laser-cut within 0.05mm of your device's CAD files. Our heat-resistant adhesive ensures zero residue upon removal.
                </p>
              </div>
              <Button className="w-full h-14 font-headline uppercase tracking-widest glow-primary text-lg">
                Submit Design <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-[10px] uppercase font-headline text-muted-foreground">Starts at ₹250 • Free Shipping</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
