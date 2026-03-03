
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Package, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const chartData = [
    { day: 'Mon', sales: 450 },
    { day: 'Tue', sales: 600 },
    { day: 'Wed', sales: 300 },
    { day: 'Thu', sales: 800 },
    { day: 'Fri', sales: 950 },
    { day: 'Sat', sales: 1200 },
    { day: 'Sun', sales: 1100 },
  ];

  const chartConfig = {
    sales: {
      label: 'Revenue',
      color: 'hsl(var(--primary))',
    },
  };

  const lowStockProducts = [
    { id: '1', name: 'Cyberpunk Glitch Skin', stock: 4 },
    { id: '2', name: 'Retro Wave 84 Skin', stock: 8 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-black uppercase tracking-tight">Mission Control</h1>
        <p className="font-body text-muted-foreground">Real-time status of the Wrap4all ecosystem.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">$5,400.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">+573</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">In Stock</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">1,248</div>
            <p className="text-xs text-muted-foreground">Across 42 product lines</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-headline uppercase tracking-widest font-bold">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">+18.2%</div>
            <p className="text-xs text-muted-foreground">New customer acquisition</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 border-primary/10">
          <CardHeader>
            <CardTitle className="font-headline uppercase font-bold text-lg">Revenue (7 Days)</CardTitle>
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
              <AlertCircle className="h-5 w-5 text-destructive" /> Low Stock Alerts
            </CardTitle>
            <CardDescription>Restock these items ASAP to avoid missed sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <span className="font-body font-medium">{p.name}</span>
                  <span className="font-headline font-black text-destructive">{p.stock} LEFT</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
