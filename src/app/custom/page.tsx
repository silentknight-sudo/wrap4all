'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Info, ArrowRight, Layers, Box, Cpu, RefreshCw, ShoppingCart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function CustomLab() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [deviceType, setDeviceType] = useState('phone');
  const [selectedTexture, setSelectedTexture] = useState(PlaceHolderImages[1].imageUrl);
  const [price, setPrice] = useState(250);

  // Filter textures suitable for skins
  const textures = PlaceHolderImages.filter(img => 
    img.imageHint.includes('skin') || 
    img.imageHint.includes('texture') || 
    img.imageHint.includes('3d') ||
    img.imageHint.includes('carbon')
  );

  useEffect(() => {
    // Update price based on device type and texture properties (simulated)
    const basePrice = deviceType === 'phone' ? 250 : 349;
    const isPremium = selectedTexture.includes('3d') || selectedTexture.includes('gtr');
    setPrice(basePrice + (isPremium ? 50 : 0));

    // Trigger scanning animation
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 800);
    return () => clearTimeout(timer);
  }, [deviceType, selectedTexture]);

  const handleInitiateOrder = () => {
    const customItem = {
      id: `custom-${Date.now()}`,
      name: `Custom ${deviceType === 'phone' ? 'Mobile' : 'Laptop'} Skin`,
      price: price,
      imageUrl: selectedTexture,
      quantity: 1,
      category: deviceType === 'phone' ? 'Mobile & Device Skins' : 'Laptop Skins & Protection',
      isCustom: true
    };

    const cart = JSON.parse(localStorage.getItem('wrap4all-cart') || '[]');
    cart.push(customItem);
    localStorage.setItem('wrap4all-cart', JSON.stringify(cart));
    
    // Notify navbar to update cart count
    window.dispatchEvent(new Event('cart-updated'));

    toast({
      title: "Simulation Finalized",
      description: "Custom configuration added to your stash terminal.",
    });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-32 max-w-7xl">
        <div className="mb-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-primary blur-[100px] rounded-full pointer-events-none"
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-6xl font-black uppercase tracking-tighter md:text-8xl lg:text-9xl z-10 relative"
          >
            NEURAL <span className="text-primary glow-text-primary">LAB</span>
          </motion.h1>
          <p className="font-body text-muted-foreground mt-6 max-w-2xl mx-auto text-lg leading-relaxed uppercase tracking-widest text-[10px] font-black opacity-60">
            Precision Material Mapping & 1:1 Hardware Synthesis
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* Left Panel: Preview Hub */}
          <div className="lg:col-span-7 relative">
            <div className="sticky top-32">
              <div className="relative aspect-square rounded-[3rem] bg-card/20 backdrop-blur-3xl border border-white/5 flex items-center justify-center p-8 overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                
                {/* Holographic Grid Lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${deviceType}-${selectedTexture}`}
                    initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: -90, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full perspective-1000 z-10 flex items-center justify-center"
                  >
                    <div className={`relative transition-all duration-1000 ${deviceType === 'phone' ? 'h-[85%] w-[45%]' : 'h-[60%] w-[90%]'} overflow-hidden rounded-[3rem] border-[12px] border-background shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]`}>
                       <img 
                        src={selectedTexture} 
                        alt="Skin Preview" 
                        className={`h-full w-full object-cover transition-all duration-500 ${isScanning ? 'brightness-150 contrast-125' : ''}`}
                       />
                       <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
                       
                       {/* Hardware Details Overlay */}
                       <div className="absolute inset-0 border-[2px] border-white/5 rounded-[inherit] pointer-events-none" />
                       {deviceType === 'phone' && (
                         <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full" />
                       )}
                       
                       {/* Scanning Beam */}
                       <AnimatePresence>
                         {isScanning && (
                           <motion.div 
                            initial={{ top: '-10%' }}
                            animate={{ top: '110%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_5px_hsla(var(--primary),0.5)] z-20"
                           />
                         )}
                       </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Simulation HUD */}
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-headline font-black tracking-widest text-primary">
                    <Cpu className="h-3 w-3" /> PROCESSOR ACTIVE
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-headline font-black tracking-widest text-muted-foreground">
                    LATENCY: 1.2MS
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1">
                   <p className="text-[10px] font-headline font-black uppercase tracking-widest opacity-40">ESTIMATED MASS</p>
                   <p className="text-xl font-headline font-black text-primary">0.05 MM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Parameters */}
          <div className="lg:col-span-5 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Box className="h-5 w-5 text-primary" />
                  <h3 className="font-headline uppercase tracking-[0.3em] text-foreground text-xs font-black">Chassis Protocol</h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">01 / 03</span>
              </div>
              
              <RadioGroup value={deviceType} onValueChange={setDeviceType} className="grid grid-cols-2 gap-4">
                {['phone', 'laptop'].map((type) => (
                  <div key={type} className="relative group">
                    <RadioGroupItem value={type} id={type} className="peer sr-only" />
                    <Label 
                      htmlFor={type} 
                      className="flex flex-col items-center justify-center gap-3 h-24 rounded-2xl border-2 border-white/5 bg-card/40 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="font-headline font-black text-[10px] uppercase tracking-widest z-10">
                        {type === 'phone' ? 'Mobile Chassis' : 'Laptop Deck'}
                      </span>
                      {deviceType === type && (
                        <motion.div layoutId="chassis-glow" className="absolute inset-0 bg-primary/5 blur-xl" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-primary" />
                  <h3 className="font-headline uppercase tracking-[0.3em] text-foreground text-xs font-black">Material Matrix</h3>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">02 / 03</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {textures.map((texture, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTexture(texture.imageUrl)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedTexture === texture.imageUrl ? 'border-primary shadow-[0_0_20px_hsla(var(--primary),0.3)]' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={texture.imageUrl} alt="" className="h-full w-full object-cover" />
                    {selectedTexture === texture.imageUrl && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 text-white animate-spin-slow" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            <section className="bg-card/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Sparkles className="h-32 w-32" />
              </div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-headline uppercase font-black tracking-widest text-muted-foreground">Manufacturing Protocol</p>
                   <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    Armor deployments are laser-etched within a <span className="text-foreground font-bold">0.05mm</span> tolerance. 
                    <span className="text-primary/80"> Heat-resistant adhesion protocol included.</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-headline font-black uppercase tracking-widest text-muted-foreground opacity-50">Unit Cost</p>
                  <p className="text-3xl font-headline font-black text-foreground">₹{price}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-headline font-black uppercase tracking-widest text-muted-foreground opacity-50">Logistics</p>
                  <p className="text-xs font-headline font-black text-accent">PRIORITY DROP</p>
                </div>
              </div>
              
              <Button 
                onClick={handleInitiateOrder}
                className="w-full h-16 font-headline uppercase font-black tracking-[0.3em] rounded-2xl glow-primary text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
              >
                INITIATE DEPLOYMENT <ShoppingCart className="h-4 w-4" />
              </Button>
              
              <div className="flex justify-center items-center gap-4 text-[8px] uppercase font-headline text-muted-foreground font-black tracking-[0.3em]">
                <span>SSL ENCRYPTED</span>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <span>HARDWARE VERIFIED</span>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
