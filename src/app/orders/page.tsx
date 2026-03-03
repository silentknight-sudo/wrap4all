
'use client';

import { Navbar } from '@/components/navbar';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Truck, CheckCircle, Package } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UserOrders() {
  const { user, loading } = useAuth();
  const db = useFirestore();

  const userOrdersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
  }, [db, user]);

  const { data: orders, isLoading } = useCollection(userOrdersQuery);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-headline text-4xl font-black uppercase tracking-tight mb-8">
          Order <span className="text-primary">History</span>
        </h1>

        {!user ? (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-primary/20">
             <p className="font-headline uppercase font-bold text-xl mb-4">Identification Required</p>
             <p className="text-muted-foreground mb-6">Connect your account to view your deployment history.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 w-full bg-card/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card/50 border-primary/10 overflow-hidden backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between bg-primary/5 py-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Order ID: {order.id}</p>
                    <p className="text-xs font-medium">
                      {order.timestamp?.toDate ? format(order.timestamp.toDate(), 'PPP p') : 'Just now'}
                    </p>
                  </div>
                  <Badge className="font-headline uppercase text-[10px] tracking-widest">
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden border border-primary/20">
                          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-headline font-bold text-sm uppercase">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-black text-primary">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                    <div className="border-t border-primary/10 pt-4 flex justify-between items-center">
                      <p className="font-headline uppercase text-sm font-bold">Total Deployment Cost</p>
                      <p className="font-black text-xl text-primary">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-primary/20">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="font-headline uppercase font-bold text-xl mb-4">No deployments found</p>
            <Button asChild className="glow-primary">
              <Link href="/products">Visit the Armory</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
