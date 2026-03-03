
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Package, ShoppingBag, DollarSign, AlertCircle, Database } from 'lucide-react';
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
      // Mobile & Device Skins
      { name: "Standard Matrix Mobile Skin", category: "Mobile & Device Skins", price: 250, stockCount: 50, customizable: true, description: "A high-precision vinyl skin with a matte finish, offering sleek protection without the bulk. Perfect for daily tech armor.", imageUrl: "https://picsum.photos/seed/stdmob1/600/600" },
      { name: "3D Dragon Scale Embossed Skin", category: "Mobile & Device Skins", price: 300, stockCount: 30, customizable: true, description: "Premium 3D textured skin featuring realistic dragon scale embossing. Provides exceptional grip and a tactile futuristic feel.", imageUrl: "https://picsum.photos/seed/3dmob1/600/600" },
      { name: "iPad Pro Stealth Wrap", category: "Mobile & Device Skins", price: 399, stockCount: 15, customizable: false, description: "Full-body coverage for your iPad Pro. Engineered with heat-sync technology to keep your device cool during heavy usage.", imageUrl: "https://picsum.photos/seed/ipadwrap1/600/600" },
      { name: "AirPods Pro Neon Glow", category: "Mobile & Device Skins", price: 250, stockCount: 40, customizable: true, description: "Custom glow-in-the-dark wrap for AirPods Pro. Ensure your buds are never lost in the dark with this vibrant tech skin.", imageUrl: "https://picsum.photos/seed/audiobuds1/600/600" },
      { name: "DSLR Master Pro Wrap", category: "Mobile & Device Skins", price: 799, stockCount: 10, customizable: false, description: "Professional grade camera wrap designed for the toughest shoots. Weather-resistant and provides superior handling grip.", imageUrl: "https://picsum.photos/seed/campro1/600/600" },

      // Laptop Skins & Protection
      { name: "Cyber-Carbon Laptop Skin", category: "Laptop Skins & Protection", price: 349, stockCount: 25, customizable: true, description: "Total lid protection with a high-performance carbon fiber finish. Precision cut for all major laptop models.", imageUrl: "https://picsum.photos/seed/lapstd1/600/600" },
      { name: "GTR 3D Gaming Series Skin", category: "Laptop Skins & Protection", price: 499, stockCount: 20, customizable: false, description: "Inspired by automotive precision, this 3D textured gaming skin adds a layer of aggressive style and protection to your rig.", imageUrl: "https://picsum.photos/seed/lapgtr1/600/600" },
      { name: "MacBook Crystal Hard Shell", category: "Laptop Skins & Protection", price: 999, stockCount: 12, customizable: false, description: "Ultra-tough transparent shell that preserves the sleek aesthetic of your MacBook while shielding it from impacts.", imageUrl: "https://picsum.photos/seed/macshell1/600/600" },
      { name: "Universal Retina Guard", category: "Laptop Skins & Protection", price: 350, stockCount: 50, customizable: false, description: "Anti-glare screen protection film. Blocks 99% of UV rays and prevents scratches on high-res laptop displays.", imageUrl: "https://picsum.photos/seed/screenguard1/600/600" },
      { name: "Full Body Matte Armor", category: "Laptop Skins & Protection", price: 349, stockCount: 15, customizable: true, description: "Complete 360-degree protection. Covers lid, trackpad, and palm rest in a consistent matte black finish.", imageUrl: "https://picsum.photos/seed/fullarmor1/600/600" },

      // Bags, Sleeves & Organizers
      { name: "Vegan Leather Tech Sleeve", category: "Bags, Sleeves & Organizers", price: 649, stockCount: 15, customizable: false, description: "Sustainably sourced vegan leather sleeve with a plush microfiber lining. The ultimate sanctuary for your mobile workstation.", imageUrl: "https://picsum.photos/seed/bagslv1/600/600" },
      { name: "Handle-Ready Designer Sleeve", category: "Bags, Sleeves & Organizers", price: 799, stockCount: 10, customizable: true, description: "Equipped with hidden handles and external pockets. Features custom designer patterns for the modern commuter.", imageUrl: "https://picsum.photos/seed/baghandle1/600/600" },
      { name: "Geometric Deluxe Tote", category: "Bags, Sleeves & Organizers", price: 799, stockCount: 20, customizable: false, description: "Large capacity tote bag with internal organizers. Durable canvas with high-vibrancy geometric prints.", imageUrl: "https://picsum.photos/seed/bagtote1/600/600" },
      { name: "Compact Cable Organizer", category: "Bags, Sleeves & Organizers", price: 349, stockCount: 30, customizable: false, description: "Keep your cables, chargers, and SD cards untangled. Fits easily into any backpack or messenger bag.", imageUrl: "https://picsum.photos/seed/bagorg1/600/600" },
      { name: "Pro Tech Case (Large)", category: "Bags, Sleeves & Organizers", price: 699, stockCount: 15, customizable: false, description: "Hard-shell tech organizer for heavy travelers. Stores power banks, external drives, and multiple charging blocks.", imageUrl: "https://picsum.photos/seed/bagpro1/600/600" },

      // Cards, Stickers & Add-ons
      { name: "Vinyl Debit Card Skin", category: "Cards, Stickers & Add-ons", price: 149, stockCount: 100, customizable: true, description: "Upgrade your plastic. High-quality vinyl skins that work with all card readers and ATMs. Scratch-resistant.", imageUrl: "https://picsum.photos/seed/cardv1/600/600" },
      { name: "Keyboard Meme Stickers", category: "Cards, Stickers & Add-ons", price: 19, stockCount: 500, customizable: false, description: "Individual button stickers to customize your typing experience. High-durability prints that don't fade.", imageUrl: "https://picsum.photos/seed/kbstick1/600/600" },
      { name: "Silicon Cable Armor", category: "Cards, Stickers & Add-ons", price: 99, stockCount: 200, customizable: false, description: "Reinforce your charging cables. Prevents fraying and adds a pop of neon color to your setup.", imageUrl: "https://picsum.photos/seed/cable1/600/600" },
      { name: "Neon Grid Desk Tech Mat", category: "Cards, Stickers & Add-ons", price: 450, stockCount: 40, customizable: false, description: "Extended desk pad with anti-slip rubber base. Features a stunning neon grid design optimized for optical mice.", imageUrl: "https://picsum.photos/seed/deskmat1/600/600" },
      { name: "Battery Armor Wrap", category: "Cards, Stickers & Add-ons", price: 200, stockCount: 50, customizable: true, description: "Custom skins for your external power banks. Tough vinyl that shields against scuffs during travel.", imageUrl: "https://picsum.photos/seed/batt1/600/600" }
    ];

    try {
      for (const product of products) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      toast({ title: "Full Catalog Synchronized", description: "20+ items across 4 categories have been deployed." });
    } catch (e) {
      toast({ variant: "destructive", title: "Deployment Failed", description: "Database rejected the manifest." });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tight">Mission Control</h1>
          <p className="font-body text-muted-foreground">Real-time status of the Wrap4all ecosystem.</p>
        </div>
        <Button 
          onClick={seedCatalog} 
          disabled={seeding}
          variant="outline" 
          className="border-primary/50 hover:bg-primary/10 text-primary font-headline uppercase text-xs glow-primary"
        >
          <Database className="mr-2 h-4 w-4" /> 
          {seeding ? "Initializing Protocols..." : "Deploy Full Catalog"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Revenue (INR)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">₹5,40,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">+573</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Inventory</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">1,248</div>
            <p className="text-xs text-muted-foreground">Active Units</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-accent/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">User Base</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">+842</div>
            <p className="text-xs text-muted-foreground">New Acquisitions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 border-primary/10">
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

        <Card className="lg:col-span-3 bg-card/50 border-destructive/20">
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
              <p className="text-xs text-muted-foreground text-center italic">Stock count automatically updates on customer checkout.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
