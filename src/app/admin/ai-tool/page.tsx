
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateProductDescription, type GenerateProductDescriptionInput, type GenerateProductDescriptionOutput } from '@/ai/flows/generate-product-description';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AICopywriter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);
  const [formData, setFormData] = useState<GenerateProductDescriptionInput>({
    productName: '',
    category: 'Skin',
    attributes: '',
    tone: 'Cyber-Neon',
    length: 'medium',
  });
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await generateProductDescription(formData);
      setResult(output);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Core Failure",
        description: "Failed to generate copy. Check console for logs.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text added to your clipboard.",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tight">AI Copywriter</h1>
          <p className="font-body text-muted-foreground">Generate high-converting tech copy for your wraps.</p>
        </div>

        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline uppercase font-bold text-lg">Product Context</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input 
                  id="productName" 
                  value={formData.productName} 
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="e.g. Carbon Fiber Ultra" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v: any) => setFormData({...formData, category: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Skin">Skin</SelectItem>
                      <SelectItem value="Tempered">Tempered</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select 
                    value={formData.tone} 
                    onValueChange={(v: any) => setFormData({...formData, tone: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cyber-Neon">Cyber-Neon</SelectItem>
                      <SelectItem value="Minimalist">Minimalist</SelectItem>
                      <SelectItem value="Retro">RetroWave</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Gen-Z">Gen-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attributes">Attributes (Comma separated)</Label>
                <Input 
                  id="attributes" 
                  value={formData.attributes} 
                  onChange={(e) => setFormData({...formData, attributes: e.target.value})}
                  placeholder="3M Material, Anti-scratch, Textured" 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full font-headline uppercase glow-primary">
                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Copy
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {result ? (
          <>
            <Card className="bg-card/50 border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline uppercase font-bold text-lg">Product Description</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.description)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="font-body text-sm leading-relaxed">{result.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline uppercase font-bold text-lg">Punchy Taglines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.marketingCopy.map((point, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <span className="font-body text-sm font-medium">{point}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(point)}>
                      <Copy className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-primary/10 rounded-3xl opacity-50">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <p className="font-headline uppercase font-bold text-xl">The AI Core is Idle</p>
            <p className="font-body text-muted-foreground">Input product details to generate creative copy.</p>
          </div>
        )}
      </div>
    </div>
  );
}
