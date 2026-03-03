'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Shield, Sparkles, LogIn, UserPlus, Github, Chrome } from 'lucide-react';

export default function LoginPage() {
  const { signIn, loginWithEmail, signupWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginWithEmail(email, password);
    setIsLoading(false);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signupWithEmail(email, password, name);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <main className="container relative flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10"
        >
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 mb-6"
            >
              <Shield className="h-8 w-8 text-primary glow-text-primary" />
            </motion.div>
            <h1 className="font-headline text-4xl font-black uppercase tracking-tighter md:text-5xl">
              Access <span className="text-primary">Terminal</span>
            </h1>
            <p className="font-body text-muted-foreground mt-2 uppercase text-[10px] tracking-[0.3em] font-bold">
              Secure Collective Authorization
            </p>
          </div>

          <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-white/5 rounded-none p-1">
                  <TabsTrigger value="login" className="font-headline uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary rounded-2xl">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="font-headline uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary rounded-2xl">
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <div className="p-8">
                  <TabsContent value="login" className="mt-0 space-y-6">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Identity (Email)</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@matrix.com" 
                          className="bg-background/50 border-white/10 rounded-2xl h-12 px-5 focus:border-primary/50 transition-all"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pass" className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Protocol (Password)</Label>
                        <Input 
                          id="pass" 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-background/50 border-white/10 rounded-2xl h-12 px-5 focus:border-primary/50 transition-all"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl font-headline uppercase tracking-widest glow-primary group">
                        {isLoading ? "Authorizing..." : <><LogIn className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> Enter Terminal</>}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                      <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-black"><span className="bg-card px-4 text-muted-foreground">OR NEURAL LINK</span></div>
                    </div>

                    <Button variant="outline" onClick={signIn} className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-headline uppercase tracking-widest text-[10px]">
                      <Chrome className="mr-3 h-4 w-4 text-primary" /> Continue with Google
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0 space-y-6">
                    <form onSubmit={handleEmailSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Public Name</Label>
                        <Input 
                          id="signup-name" 
                          placeholder="V_Cyberpunk" 
                          className="bg-background/50 border-white/10 rounded-2xl h-12 px-5"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Email</Label>
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="user@grid.com" 
                          className="bg-background/50 border-white/10 rounded-2xl h-12 px-5"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-pass" className="text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">Password</Label>
                        <Input 
                          id="signup-pass" 
                          type="password" 
                          placeholder="Min 6 characters" 
                          className="bg-background/50 border-white/10 rounded-2xl h-12 px-5"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl font-headline uppercase tracking-widest glow-primary group">
                        {isLoading ? "Initializing..." : <><UserPlus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> Join Collective</>}
                      </Button>
                    </form>
                  </TabsContent>
                </div>
              </Tabs>
            </CardHeader>
          </Card>

          <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            Authorized hardware armor access only. <br />
            <span className="text-primary/40">Secure encryption active.</span>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
