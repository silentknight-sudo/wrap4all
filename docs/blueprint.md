# **App Name**: Wrap4all

## Core Features:

- Secure User Authentication: Implement Firebase Google Sign-In for both customer users and site administrators, enforcing 'isAdmin' flag checks for privileged access.
- Dynamic 3D Product Showcase: Showcase products with a 3D dynamic aesthetic, utilizing Framer Motion for smooth page transitions and a mouse-following 3D-tilt effect on product cards.
- AI-Powered Product Description Tool: An AI tool within the admin panel to assist in generating creative product descriptions and marketing copy based on product attributes and desired tone.
- Admin Panel & Inventory Management: A secure dashboard at /admin, accessible only by users with an 'isAdmin: true' flag, enabling administrators to Create, Read, Update, and Delete products and upload images to Firebase Storage.
- Order Tracking System: Enable administrators to track live orders within the admin panel, view order details, and ensure 'stockCount' is automatically reduced upon order placement.
- Thematic UI Switcher: Implement a toggle in the Admin Panel to switch the global site theme between 'Cyber-Neon', 'Minimalist', and 'Retro', with settings stored in Firestore and applied instantly via CSS variables.
- Low Stock Alerts: Display prominent visual alerts within the Admin Panel whenever a product's stockCount drops below a predefined low-threshold, e.g., 10 units.

## Style Guidelines:

- A dark color scheme embracing a futuristic 'Cyber-Neon' aesthetic suitable for Gen-Z tastes. Primary interactive color: vibrant electric blue (#0F7EFF). Background color: a subtly dark blue-grey (#14181A). Accent color for highlights and key elements: bright cyan (#69EBFF).
- Headline font: 'Space Grotesk' (sans-serif) for a modern, techy, and dynamic feel. Body text font: 'Inter' (sans-serif) to ensure excellent readability and a contemporary, clean look.
- Use clean, geometric icons with a vibrant, glowing aesthetic that aligns with the 'Cyber-Neon' theme, providing clarity while enhancing the futuristic dynamic feel.
- Emphasize dynamic, layered layouts that convey depth and a '3D' feel, especially in hero sections. Utilize generous spacing and a strong visual hierarchy to guide the user's eye.
- Incorporate smooth and deliberate animations using Framer Motion for page transitions and interactive elements, such as the described 3D tilt effect on product cards. Use subtle hovers and state changes to enhance interactivity without distraction.