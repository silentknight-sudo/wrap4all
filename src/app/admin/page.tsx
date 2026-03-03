'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Package, ShoppingBag, DollarSign, AlertCircle, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [seeding, setSeeding] = useState(false);

  const chartData = [
    { day: 'Mon', sales: 4500 },
    { day: 'Tue', sales: 6000 },
    { day: 'Wed', sales: 3000 },
    { day: 'Thu', sales: 8000 },
    { day: 'Fri', sales: 9500 },
    { day: 'Sat', sales: 12000 },
    { day: 'Sun', sales: 11000 },
  ];

  const chartConfig = {
    sales: {
      label: 'Revenue (INR)',
      color: 'hsl(var(--primary))',
    },
  };

  const seedCatalog = async () => {
    if (!db) return;
    setSeeding(true);
    
    const products = [
      // Mobile & Device Skins (₹250 - ₹300)
      { name: "Standard Matrix Mobile Skin", category: "Mobile & Device Skins", price: 250, stockCount: 50, customizable: true, description: "Precision-cut industrial vinyl. Matte finish, zero-bulk protection for the daily grind.", imageUrl: "https://images.unsplash.com/photo-1601592690120-a7cefd9c477a?q=80&w=600" },
      { name: "3D Dragon Scale Embossed", category: "Mobile & Device Skins", price: 300, stockCount: 30, customizable: true, description: "Tactile 3D dragon scale texture. High-grip polymer armor for ultimate device handling.", imageUrl: "https://images.unsplash.com/photo-1678446332668-301c5ea11739?q=80&w=600" },
      { name: "iPad Pro Stealth Wrap", category: "Mobile & Device Skins", price: 425, stockCount: 15, customizable: false, description: "Aerospace-grade matte wrap. Heat-sync optimized for heavy workstation usage.", imageUrl: "https://images.unsplash.com/photo-1636997112337-4f0a138fd377?q=80&w=600" },
      { name: "AirPods Pro Neon Glow", category: "Mobile & Device Skins", price: 250, stockCount: 40, customizable: true, description: "Bioluminescent glow-in-the-dark skin. Never lose your audio gear in the void again.", imageUrl: "https://images.unsplash.com/photo-1748369830076-54433f54a74d?q=80&w=600" },
      { name: "DSLR Master Pro Wrap", category: "Mobile & Device Skins", price: 799, stockCount: 10, customizable: false, description: "Weather-sealed professional camera skin. Non-slip texture for high-stakes photography.", imageUrl: "https://images.unsplash.com/photo-1732861612232-50cbe19c1ae5?q=80&w=600" },

      // Laptop Skins & Protection (₹349 - ₹999)
      { name: "Cyber-Carbon Laptop Skin", category: "Laptop Skins & Protection", price: 349, stockCount: 25, customizable: true, description: "3M high-performance carbon fiber wrap. 1:1 CAD mapping for perfect edge-to-edge finish.", imageUrl: "https://images.unsplash.com/photo-1632893037520-7c223d9495f0?q=80&w=600" },
      { name: "GTR 3D Gaming Series", category: "Laptop Skins & Protection", price: 499, stockCount: 20, customizable: false, description: "Automotive-inspired 3D embossed texture. Aggressive styling for high-performance rigs.", imageUrl: "https://images.unsplash.com/photo-1718607601475-3ff032a2322b?q=80&w=600" },
      { name: "MacBook Crystal Hard Shell", category: "Laptop Skins & Protection", price: 999, stockCount: 12, customizable: false, description: "Ultra-tough polycarbonate crystal shell. Preserves aesthetics while absorbing lethal impacts.", imageUrl: "https://images.unsplash.com/photo-1676567463926-b0378e36a209?q=80&w=600" },
      { name: "Universal Retina Guard", category: "Laptop Skins & Protection", price: 350, stockCount: 50, customizable: false, description: "Anti-glare, UV-blocking screen protection. Scratch-resistant layer for high-res displays.", imageUrl: "https://images.unsplash.com/photo-1636997112337-4f0a138fd377?q=80&w=600" },

      // Bags, Sleeves & Organizers (₹349 - ₹799)
      { name: "Vegan Leather Tech Sleeve", category: "Bags, Sleeves & Organizers", price: 649, stockCount: 15, customizable: false, description: "Sustainably sourced leather with plush microfiber lining. Secure docking for your laptop.", imageUrl: "https://images.unsplash.com/photo-1509291832281-6323f499fc80?q=80&w=600" },
      { name: "Handle-Ready Designer Sleeve", category: "Bags, Sleeves & Organizers", price: 799, stockCount: 10, customizable: true, description: "Reinforced handles and custom designer patterns. The ultimate commuter's companion.", imageUrl: "https://images.unsplash.com/photo-1761345880123-c7c3b160c1d4?q=80&w=600" },
      { name: "Geometric Deluxe Tote", category: "Bags, Sleeves & Organizers", price: 799, stockCount: 20, customizable: false, description: "High-vibrancy geometric prints on heavy canvas. Internal organizers for all your gear.", imageUrl: "https://images.unsplash.com/photo-1761345880123-c7c3b160c1d4?q=80&w=600" },

      // Cards & Add-ons (₹19 - ₹700)
      { name: "Vinyl Debit Card Skin", category: "Cards, Stickers & Add-ons", price: 149, stockCount: 100, customizable: true, description: "Upgrade your plastic. Full-access vinyl skins compatible with all chip readers.", imageUrl: "https://images.unsplash.com/photo-1678554832890-2ea5d37278af?q=80&w=600" },
      { name: "Keyboard Meme Stickers", category: "Cards, Stickers & Add-ons", price: 19, stockCount: 500, customizable: false, description: "High-durability keyset stickers. Infuse your typing experience with digital culture.", imageUrl: "https://images.unsplash.com/photo-1678446332668-301c5ea11739?q=80&w=600" },
      { name: "Neon Grid Desk Tech Mat", category: "Cards, Stickers & Add-ons", price: 450, stockCount: 40, customizable: false, description: "Precision tracking surface with anti-slip base. Optimized for laser and optical mice.", imageUrl: "https://images.unsplash.com/photo-1760462787860-e2b245ed55ed?q=80&w=600" }
    ];

    try {
      for (const product of products) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      toast({ title: "Full Catalog Synchronized", description: "20 premium items have been deployed to the armory." });
    } catch (e) {
      toast({ variant: "destructive", title: "Deployment Failed", description: "Database rejected the inventory manifest." });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-headline text-4xl font-black uppercase tracking-tight glow-text-primary">Mission Control</h1>
          <p className="font-body text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Real-time status of the Wrap4all ecosystem.</p>
        </motion.div>
        <Button 
          onClick={seedCatalog} 
          disabled={seeding}
          className="font-headline uppercase tracking-widest glow-primary h-14 px-10 rounded-2xl shadow-2xl transition-transform hover:scale-105"
        >
          <Sparkles className="mr-2 h-5 w-5" /> 
          {seeding ? "Synchronizing..." : "Seed Full Catalog"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Revenue (INR)", value: "₹5,40,000", sub: "+20.1% growth", icon: DollarSign, color: "text-primary" },
          { title: "Orders", value: "+573", sub: "+12% throughput", icon: ShoppingBag, color: "text-accent" },
          { title: "Inventory", value: "1,248", sub: "Active Units", icon: Package, color: "text-primary" },
          { title: "Growth", value: "+842", sub: "New Acquisitions", icon: TrendingUp, color: "text-accent" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card border-white/5 shadow-xl hover:border-primary/20 transition-all rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-headline uppercase tracking-widest font-black opacity-60">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass-card border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline uppercase font-bold text-lg">Sales Velocity (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass-card border-destructive/20 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline uppercase font-bold text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Critical Protocols
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-medium opacity-50">Attention required for stock replenishing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/10 group hover:bg-destructive/10 transition-all">
                <span className="font-body font-bold text-sm">Cyber Carbon V1</span>
                <span className="font-headline font-black text-destructive text-xs tracking-widest animate-pulse">4 LEFT</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/10 group hover:bg-destructive/10 transition-all">
                <span className="font-body font-bold text-sm">Retro Wave Shell</span>
                <span className="font-headline font-black text-destructive text-xs tracking-widest animate-pulse">8 LEFT</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center italic mt-6 uppercase tracking-widest opacity-50">Stock manifests synchronize on customer checkout.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}