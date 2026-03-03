
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Palette, Monitor, Zap } from 'lucide-react';

export default function AdminSettings() {
  const db = useFirestore();
  const [activeTheme, setActiveTheme] = useState('Cyber-Neon');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!db) return;
    async function fetchSettings() {
      const docRef = doc(db, 'settings', 'appearance');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setActiveTheme(docSnap.data().activeTheme || 'Cyber-Neon');
      }
      setLoading(false);
    }
    fetchSettings();
  }, [db]);

  const handleSaveTheme = async () => {
    if (!db) return;
    try {
      const docRef = doc(db, 'settings', 'appearance');
      await setDoc(docRef, {
        activeTheme,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      toast({
        title: "Theme Synchronized",
        description: `Site theme has been set to ${activeTheme}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update theme settings.",
      });
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-black uppercase tracking-tight">Ecosystem Settings</h1>
        <p className="font-body text-muted-foreground">Customize the global aesthetic and core parameters.</p>
      </div>

      <Card className="bg-card/50 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline uppercase font-bold text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" /> Global Site Theme
          </CardTitle>
          <CardDescription>Changes will reflect instantly for all users across the world.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup 
            value={activeTheme} 
            onValueChange={setActiveTheme}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="Cyber-Neon" id="cyber" className="peer sr-only" />
              <Label
                htmlFor="cyber"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <Monitor className="mb-3 h-6 w-6" />
                <span className="font-headline uppercase font-bold text-sm">Cyber-Neon</span>
                <span className="mt-1 text-xs text-muted-foreground">Blue & Cyan Glow</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="Minimalist" id="minimal" className="peer sr-only" />
              <Label
                htmlFor="minimal"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <Monitor className="mb-3 h-6 w-6" />
                <span className="font-headline uppercase font-bold text-sm">Minimalist</span>
                <span className="mt-1 text-xs text-muted-foreground">Clean Black & White</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="Retro" id="retro" className="peer sr-only" />
              <Label
                htmlFor="retro"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <Monitor className="mb-3 h-6 w-6" />
                <span className="font-headline uppercase font-bold text-sm">Retro-Wave</span>
                <span className="mt-1 text-xs text-muted-foreground">80s Pink & Yellow</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveTheme} className="font-headline uppercase tracking-widest glow-primary">
              Sync Appearance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-accent/20">
        <CardHeader>
          <CardTitle className="font-headline uppercase font-bold text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" /> Automation Webhooks
          </CardTitle>
          <CardDescription>Integrate with external services for real-time notifications.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground italic">Connect your Discord or WhatsApp bot to receive order notifications instantly.</p>
           <Button variant="outline" className="mt-4 border-accent/30 hover:bg-accent/10 font-headline uppercase text-xs">Configure Discord Bot</Button>
        </CardContent>
      </Card>
    </div>
  );
}
