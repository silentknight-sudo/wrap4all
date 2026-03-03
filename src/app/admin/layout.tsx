
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Package, ShoppingCart, Settings, ArrowLeft, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-primary/20 bg-card/50 backdrop-blur-xl">
        <SidebarHeader className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline text-xl font-bold tracking-tighter text-primary">
              WRAP<span className="text-accent">4</span>ALL <span className="text-[10px] bg-primary/20 px-1 rounded uppercase">Admin</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Inventory">
                <Link href="/admin/inventory">
                  <Package className="h-4 w-4" />
                  <span>Inventory</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Orders">
                <Link href="/admin/orders">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="AI Copywriter">
                <Link href="/admin/ai-tool">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Copywriter</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="mt-auto pb-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
      
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-primary/10 bg-background/80 px-4 backdrop-blur-lg">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
             <Link href="/" className="text-sm font-headline uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center gap-2">
               <ArrowLeft className="h-4 w-4" /> Back to Store
             </Link>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
