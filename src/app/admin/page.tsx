
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Package, ShoppingBag, DollarSign, AlertCircle, Sparkles, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
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
      { name: "Cyber Carbon Skin", category: "Mobile & Device Skins", price: 250, stockCount: 50, customizable: true, description: "Classic carbon fiber texture with precision cut.", imageUrl: "https://picsum.photos/seed/cyber1/600/600" },
      { name: "Embossed Dragon 3D", category: "Mobile & Device Skins", price: 300, stockCount: 25, customizable: true, description: "Premium 3D embossed dragon scale texture.", imageUrl: "https://picsum.photos/seed/3dskin1/600/600" },
      { name: "iPad Pro Minimalist", category: "Mobile & Device Skins", price: 399, stockCount: 15, customizable: false, description: "Sleek protection for your iPad Pro.", imageUrl: "https://picsum.photos/seed/ipad1/600/600" },
      { name: "AirPods Glow Skin", category: "Mobile & Device Skins", price: 250, stockCount: 40, customizable: true, description: "Glow in the dark protection for AirPods.", imageUrl: "https://picsum.photos/seed/audio1/600/600" },
      { name: "DSLR Pro Matte", category: "Mobile & Device Skins", price: 799, stockCount: 10, customizable: false, description: "Professional grade camera skin.", imageUrl: "https://picsum.photos/seed/camera1/600/600" },
      { name: "Matrix Laptop Skin", category: "Laptop Skins & Protection", price: 349, stockCount: 30, customizable: true, description: "Full body protection with Matrix code design.", imageUrl: "https://picsum.photos/seed/laptop1/600/600" },
      { name: "GTR 3D Gaming Skin", category: "Laptop Skins & Protection", price: 499, stockCount: 20, customizable: false, description: "High-octane 3D textured gaming skin.", imageUrl: "https://picsum.photos/seed/gtr1/600/600" },
      { name: "MacBook Crystal Shell", category: "Laptop Skins & Protection", price: 999, stockCount: 12, customizable: false, description: "Tough transparent crystal case.", imageUrl: "https://picsum.photos/seed/shell1/600/600" },
      { name: "Leather Laptop Sleeve", category: "Bags, Sleeves & Organizers", price: 675, stockCount: 15, customizable: false, description: "Premium vegan leather organizer.", imageUrl: "https://picsum.photos/seed/sleeve1/600/600" },
      { name: "Neon Grid Tech Mat", category: "Cards, Stickers & Add-ons", price: 450, stockCount: 20, customizable: false, description: "Large anti-slip desk pad for pros.", imageUrl: "https://picsum.photos/seed/mat1/600/600" },
      { name: "Vinyl Card Skin", category: "Cards, Stickers & Add-ons", price: 149, stockCount: 100, customizable: true, description: "Upgrade your debit card style.", imageUrl: "https://picsum.photos/seed/card1/600/600" }
    ];

    try {
      for (const product of products) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: new Date().toISOString()
        });
      }
      toast({ title: "Catalog Seeded", description: "All product categories have been initialized." });
    } catch (e) {
      toast({ variant: "destructive", title: "Seeding Failed", description: "Check permissions." });
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
          className="border-primary/50 hover:bg-primary/10 text-primary font-headline uppercase text-xs"
        >
          <Database className="mr-2 h-4 w-4" /> 
          {seeding ? "Initializing..." : "Seed Full Catalog"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-primary/20 shadow-lg glow-primary/5">
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
              <AlertCircle className="h-5 w-5 text-destructive" /> Stock Alerts
            </CardTitle>
            <CardDescription>Decommissioned or low stock units.</CardDescription>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
