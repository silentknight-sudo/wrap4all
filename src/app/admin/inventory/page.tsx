
'use client';

import { useState } from 'react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, AlertTriangle, Package, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function InventoryManager() {
  const db = useFirestore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('category', 'asc'));
  }, [db]);

  const { data: products, isLoading } = useCollection(productsQuery);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Mobile & Device Skins',
    price: 0,
    stockCount: 0,
    imageUrl: '',
    customizable: false,
    description: ''
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stockCount: product.stockCount,
      imageUrl: product.imageUrl,
      customizable: product.customizable,
      description: product.description
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast({ title: "Product Updated", description: "The inventory has been synchronized." });
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        toast({ title: "Product Created", description: "Successfully added to the lab." });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', category: 'Mobile & Device Skins', price: 0, stockCount: 0, imageUrl: '', customizable: false, description: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save product." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !confirm('Are you sure you want to decommission this product line?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "Product Deleted", description: "Removed from active inventory." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete product." });
    }
  };

  const filteredProducts = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tight">Inventory Lab</h1>
          <p className="font-body text-muted-foreground">Manage active product lines and stock protocols.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {setEditingProduct(null); setFormData({ name: '', category: 'Mobile & Device Skins', price: 0, stockCount: 0, imageUrl: '', customizable: false, description: '' });}} className="font-headline uppercase tracking-widest glow-primary">
              <Plus className="mr-2 h-4 w-4" /> New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="font-headline uppercase font-bold text-xl">
                {editingProduct ? 'Update Product' : 'Initialize New Line'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Cyber-Carbon V2" required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mobile & Device Skins">Mobile & Device Skins</SelectItem>
                      <SelectItem value="Laptop Skins & Protection">Laptop Skins & Protection</SelectItem>
                      <SelectItem value="Bags, Sleeves & Organizers">Bags, Sleeves & Organizers</SelectItem>
                      <SelectItem value="Cards, Stickers & Add-ons">Cards, Stickers & Add-ons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label>Initial Stock</Label>
                  <Input type="number" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image Reference</Label>
                <Select value={formData.imageUrl} onValueChange={v => setFormData({...formData, imageUrl: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select high-res visual" />
                  </SelectTrigger>
                  <SelectContent>
                    {PlaceHolderImages.map(img => (
                      <SelectItem key={img.id} value={img.imageUrl}>{img.description}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Manifesto (Description)</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="High-performance vinyl with matte finish..." required />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full font-headline uppercase glow-primary">Sync Database</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Filter inventory..." 
          className="pl-10 bg-card/50 border-primary/10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Product</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest">Category</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest text-right">Price</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest text-right">Stock</TableHead>
              <TableHead className="font-headline uppercase text-xs tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={5} className="text-center py-10 opacity-50">Fetching manifests...</TableCell></TableRow>
            ) : filteredProducts?.map((p) => (
              <TableRow key={p.id} className="hover:bg-primary/5 transition-colors group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 overflow-hidden relative border border-primary/20">
                      <img src={p.imageUrl} alt="" className="object-cover w-full h-full" />
                    </div>
                    <span>{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{p.category}</TableCell>
                <TableCell className="text-right font-black">₹{p.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {p.stockCount < 10 && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                    <span className={p.stockCount < 10 ? 'text-destructive font-bold' : 'text-primary'}>
                      {p.stockCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} className="h-8 w-8 hover:bg-primary/20">
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-8 w-8 hover:bg-destructive/20">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
