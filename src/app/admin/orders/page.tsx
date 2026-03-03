
'use client';

import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminOrders() {
  const db = useFirestore();
  const { toast } = useToast();

  const ordersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast({ title: "Status Updated", description: `Order ${orderId} is now ${newStatus}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Failed to sync status with database." });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Shipped': return <Truck className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-black uppercase tracking-tight">Order Command</h1>
        <p className="font-body text-muted-foreground">Monitor and fulfill global tech armor deployments.</p>
      </div>

      <div className="rounded-xl border border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Order ID</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Timestamp</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Items</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Total</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Status</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 opacity-50">Fetching global orders...</TableCell></TableRow>
            ) : orders?.map((order) => (
              <TableRow key={order.id} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-mono text-[10px] text-muted-foreground uppercase">{order.id}</TableCell>
                <TableCell className="text-xs">
                  {order.timestamp?.toDate ? format(order.timestamp.toDate(), 'MMM dd, HH:mm') : 'Recently Placed'}
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted overflow-hidden">
                        <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold ring-2 ring-background">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-black text-primary text-sm">₹{order.totalAmount}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Pending' ? 'outline' : 'default'} className="flex items-center gap-1 w-fit text-[10px] uppercase font-headline">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                    <SelectTrigger className="h-8 w-[120px] bg-background/50 text-[10px] uppercase font-headline">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {(!orders || orders.length === 0) && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic">No orders detected in the system.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
