'use server';
/**
 * @fileOverview An AI agent for generating product descriptions and marketing copy.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z
    .enum(['Skin', 'Tempered', 'Hybrid', 'Other'])
    .describe('The category of the product (Skin / Tempered / Hybrid / Other).'),
  attributes: z
    .string()
    .describe('Key attributes or selling points of the product (e.g., "Carbon Fiber, durable, sleek").'),
  tone: z
    .enum(['Cyber-Neon', 'Minimalist', 'Retro', 'Professional', 'Playful', 'Gen-Z'])
    .describe('The desired tone for the description and marketing copy.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .describe('The desired length of the generated description.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed product description.'),
  marketingCopy: z.array(z.string()).describe('An array of short, punchy marketing taglines or bullet points.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert e-commerce copywriter for Wrap4all.com, an online store targeting a Gen-Z audience with a dynamic, 3D aesthetic. Your goal is to create compelling product descriptions and marketing copy.

Generate a product description and a list of marketing copy points for the following product, keeping the specified tone and length in mind.

Product Name: "{{{productName}}}"
Category: "{{{category}}}"
Key Attributes: "{{{attributes}}}"
Desired Tone: "{{{tone}}}"
Desired Length: "{{{length}}}"

Make sure the output is vibrant, engaging, and appeals to a tech-savvy, trend-conscious Gen-Z demographic.
Focus on the benefits and style that the product offers.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate product description.');
    }
    return output;
  }
);
