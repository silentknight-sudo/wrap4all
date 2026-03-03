
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const db = useFirestore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('name', 'asc'));
  }, [db]);

  const { data: products, isLoading } = useCollection(productsQuery);

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-headline text-4xl font-black uppercase tracking-tight md:text-6xl">
                The <span className="text-primary">Catalog</span>
              </h1>
              <p className="font-body text-muted-foreground mt-2">Precision protection for every dimension of your life.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row items-center bg-card/50 p-4 rounded-2xl border border-primary/10 backdrop-blur-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search skins, sleeves, mats..." 
                className="pl-10 bg-background/50 border-primary/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-primary/10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Mobile & Device Skins">Mobile & Device</SelectItem>
                  <SelectItem value="Laptop Skins & Protection">Laptop & Protection</SelectItem>
                  <SelectItem value="Bags, Sleeves & Organizers">Bags & Organizers</SelectItem>
                  <SelectItem value="Cards, Stickers & Add-ons">Add-ons & Misc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 rounded-xl bg-card animate-pulse border border-primary/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="font-headline text-xl text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
