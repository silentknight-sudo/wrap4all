
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
      // Mobile & Device Skins (Min 5)
      { name: "Standard Matrix Mobile Skin", category: "Mobile & Device Skins", price: 250, stockCount: 50, customizable: true, description: "Precision-cut industrial vinyl. Matte finish, zero-bulk protection for the daily grind.", imageUrl: "https://picsum.photos/seed/stdmob1/600/600" },
      { name: "3D Dragon Scale Embossed", category: "Mobile & Device Skins", price: 300, stockCount: 30, customizable: true, description: "Tactile 3D dragon scale texture. High-grip polymer armor for ultimate device handling.", imageUrl: "https://picsum.photos/seed/3dmob1/600/600" },
      { name: "iPad Pro Stealth Wrap", category: "Mobile & Device Skins", price: 425, stockCount: 15, customizable: false, description: "Aerospace-grade matte wrap. Heat-sync optimized for heavy workstation usage.", imageUrl: "https://picsum.photos/seed/ipadwrap1/600/600" },
      { name: "AirPods Pro Neon Glow", category: "Mobile & Device Skins", price: 250, stockCount: 40, customizable: true, description: "Bioluminescent glow-in-the-dark skin. Never lose your audio gear in the void again.", imageUrl: "https://picsum.photos/seed/audiobuds1/600/600" },
      { name: "DSLR Master Pro Wrap", category: "Mobile & Device Skins", price: 799, stockCount: 10, customizable: false, description: "Weather-sealed professional camera skin. Non-slip texture for high-stakes photography.", imageUrl: "https://picsum.photos/seed/campro1/600/600" },

      // Laptop Skins & Protection (Min 5)
      { name: "Cyber-Carbon Laptop Skin", category: "Laptop Skins & Protection", price: 349, stockCount: 25, customizable: true, description: "3M high-performance carbon fiber wrap. 1:1 CAD mapping for perfect edge-to-edge finish.", imageUrl: "https://picsum.photos/seed/lapstd1/600/600" },
      { name: "GTR 3D Gaming Series", category: "Laptop Skins & Protection", price: 499, stockCount: 20, customizable: false, description: "Automotive-inspired 3D embossed texture. Aggressive styling for high-performance rigs.", imageUrl: "https://picsum.photos/seed/lapgtr1/600/600" },
      { name: "MacBook Crystal Hard Shell", category: "Laptop Skins & Protection", price: 999, stockCount: 12, customizable: false, description: "Ultra-tough polycarbonate crystal shell. Preserves aesthetics while absorbing lethal impacts.", imageUrl: "https://picsum.photos/seed/macshell1/600/600" },
      { name: "Universal Retina Guard", category: "Laptop Skins & Protection", price: 350, stockCount: 50, customizable: false, description: "Anti-glare, UV-blocking screen protection. Scratch-resistant layer for high-res displays.", imageUrl: "https://picsum.photos/seed/screenguard1/600/600" },
      { name: "Full Body Matte Armor", category: "Laptop Skins & Protection", price: 349, stockCount: 15, customizable: true, description: "360-degree coverage for lid, palm rest, and trackpad. Uniform matte black aesthetic.", imageUrl: "https://picsum.photos/seed/fullarmor1/600/600" },

      // Bags, Sleeves & Organizers (Min 5)
      { name: "Vegan Leather Tech Sleeve", category: "Bags, Sleeves & Organizers", price: 649, stockCount: 15, customizable: false, description: "Sustainably sourced leather with plush microfiber lining. Secure docking for your laptop.", imageUrl: "https://picsum.photos/seed/bagslv1/600/600" },
      { name: "Handle-Ready Designer Sleeve", category: "Bags, Sleeves & Organizers", price: 799, stockCount: 10, customizable: true, description: "Reinforced handles and custom designer patterns. The ultimate commuter's companion.", imageUrl: "https://picsum.photos/seed/baghandle1/600/600" },
      { name: "Geometric Deluxe Tote", category: "Bags, Sleeves & Organizers", price: 799, stockCount: 20, customizable: false, description: "High-vibrancy geometric prints on heavy canvas. Internal organizers for all your gear.", imageUrl: "https://picsum.photos/seed/bagtote1/600/600" },
      { name: "Compact Cable Organizer", category: "Bags, Sleeves & Organizers", price: 349, stockCount: 30, customizable: false, description: "Zero-tangle protocol for your cables and SD cards. Slips into any pocket or bag.", imageUrl: "https://picsum.photos/seed/bagorg1/600/600" },
      { name: "Pro Tech Case (Large)", category: "Bags, Sleeves & Organizers", price: 699, stockCount: 15, customizable: false, description: "Hard-shell impact case for heavy travelers. Stores power banks and multiple drives.", imageUrl: "https://picsum.photos/seed/bagpro1/600/600" },

      // Cards, Stickers & Add-ons (Min 5)
      { name: "Vinyl Debit Card Skin", category: "Cards, Stickers & Add-ons", price: 149, stockCount: 100, customizable: true, description: "Upgrade your plastic. Full-access vinyl skins compatible with all chip readers.", imageUrl: "https://picsum.photos/seed/cardv1/600/600" },
      { name: "Keyboard Meme Stickers", category: "Cards, Stickers & Add-ons", price: 19, stockCount: 500, customizable: false, description: "High-durability keyset stickers. Infuse your typing experience with digital culture.", imageUrl: "https://picsum.photos/seed/kbstick1/600/600" },
      { name: "Silicon Cable Armor", category: "Cards, Stickers & Add-ons", price: 99, stockCount: 200, customizable: false, description: "Reinforced stress points for charging cables. Prevents fraying with neon accents.", imageUrl: "https://picsum.photos/seed/cable1/600/600" },
      { name: "Neon Grid Desk Tech Mat", category: "Cards, Stickers & Add-ons", price: 450, stockCount: 40, customizable: false, description: "Precision tracking surface with anti-slip base. Optimized for laser and optical mice.", imageUrl: "https://picsum.photos/seed/deskmat1/600/600" },
      { name: "Battery Armor Wrap", category: "Cards, Stickers & Add-ons", price: 200, stockCount: 50, customizable: true, description: "Ruggedized vinyl for external power banks. Shields against travel-induced scuffs.", imageUrl: "https://picsum.photos/seed/batt1/600/600" }
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
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tight">Mission Control</h1>
          <p className="font-body text-muted-foreground">Real-time status of the Wrap4all ecosystem.</p>
        </div>
        <Button 
          onClick={seedCatalog} 
          disabled={seeding}
          className="font-headline uppercase tracking-widest glow-primary h-12 px-8"
        >
          <Sparkles className="mr-2 h-4 w-4" /> 
          {seeding ? "Synchronizing..." : "Seed Full Catalog"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Revenue (INR)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">₹5,40,000</div>
            <p className="text-xs text-muted-foreground">+20.1% growth</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">+573</div>
            <p className="text-xs text-muted-foreground">+12% throughput</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Inventory</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">1,248</div>
            <p className="text-xs text-muted-foreground">Active Units</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">+842</div>
            <p className="text-xs text-muted-foreground">New Acquisitions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="font-headline uppercase font-bold text-lg">Sales Velocity (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 glass-card border-destructive/20">
          <CardHeader>
            <CardTitle className="font-headline uppercase font-bold text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> Critical Protocols
            </CardTitle>
            <CardDescription>Attention required for stock replenishing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <span className="font-body font-medium">Cyber Carbon V1</span>
                <span className="font-headline font-black text-destructive">4 LEFT</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <span className="font-body font-medium">Retro Wave Shell</span>
                <span className="font-headline font-black text-destructive">8 LEFT</span>
              </div>
              <p className="text-xs text-muted-foreground text-center italic">Stock manifests synchronize on customer checkout.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
