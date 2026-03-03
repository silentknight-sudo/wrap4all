'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { User, Shield, Zap, RefreshCw, Key, Mail, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, updateProfileData, changeEmail, changePassword } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (loading) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfileData(name, photoURL);
    setIsUpdating(false);
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await changeEmail(email);
    setIsUpdating(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await changePassword(password);
    setPassword('');
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 py-32 max-w-4xl">
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-6 shadow-[0_0_30px_hsla(var(--primary),0.2)]"
          >
            <User className="h-10 w-10 text-primary glow-text-primary" />
          </motion.div>
          <h1 className="font-headline text-5xl font-black uppercase tracking-tighter md:text-7xl">
            NEURAL <span className="text-primary">PROFILE</span>
          </h1>
          <p className="font-body text-muted-foreground mt-4 uppercase text-[10px] tracking-[0.4em] font-black opacity-60">
            System Identity & Security Protocols
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardContent className="pt-10 flex flex-col items-center">
                <div className="relative group mb-6">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20 transition-all group-hover:ring-primary/50 shadow-2xl">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                      {user?.displayName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-center">
                  {user?.displayName || 'Unknown Entity'}
                </h3>
                <p className="text-[10px] font-headline uppercase text-muted-foreground tracking-widest mt-1">
                  Active Operative
                </p>
                
                <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[8px] uppercase font-black tracking-widest text-muted-foreground mb-1">Status</p>
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-primary">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> VERIFIED
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] uppercase font-black tracking-widest text-muted-foreground mb-1">Tier</p>
                    <p className="text-[10px] font-bold text-accent">PRIME</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-card/30 border border-white/5 p-6 rounded-[2rem] space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3 text-primary">
                <Shield className="h-4 w-4" />
                <span className="text-[10px] font-headline uppercase font-black tracking-widest">Security Clearance</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                All identity shifts are logged within the global ledger. Ensure your relay nodes are secure.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-lg uppercase font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" /> Core Identity
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-widest font-medium opacity-50">Modify your public-facing handle and visual avatar.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Operative Handle</Label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. V_CYBERPUNK"
                      className="bg-background/50 border-white/10 rounded-2xl h-12 px-5 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Avatar Uplink (URL)</Label>
                    <Input 
                      value={photoURL} 
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="bg-background/50 border-white/10 rounded-2xl h-12 px-5 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdating} className="w-full h-12 rounded-2xl font-headline uppercase tracking-widest glow-primary shadow-lg">
                    {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Sync Identity"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-lg uppercase font-bold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent" /> Communication Relay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Relay Email</Label>
                    <Input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-white/10 rounded-2xl h-12 px-5 focus:border-accent/50 transition-all"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdating} variant="outline" className="w-full h-12 rounded-2xl font-headline uppercase tracking-widest border-accent/20 hover:bg-accent/10 hover:text-accent shadow-md">
                    {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Update Relay Address"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-lg uppercase font-bold flex items-center gap-2">
                  <Key className="h-5 w-5 text-secondary" /> Protocol Rotation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">New Access Protocol (Password)</Label>
                    <Input 
                      type="password"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-background/50 border-white/10 rounded-2xl h-12 px-5 focus:border-secondary/50 transition-all"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdating} variant="outline" className="w-full h-12 rounded-2xl font-headline uppercase tracking-widest border-secondary/20 hover:bg-secondary/10 hover:text-secondary shadow-md">
                    {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Rotate Protocol"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}