# 🛍️ Gloventra - Modern E-Commerce Frontend

A beautiful, responsive e-commerce web application built with React, TypeScript, Tailwind CSS, and Axios. Designed to integrate seamlessly with a Django REST API backend.

## 🎨 Brand Colors

- **Primary Blue**: `#001BB7` - Main actions and trust elements
- **Accent Blue**: `#0046FF` - Highlights and secondary CTAs
- **Accent Orange**: `#FF8040` - CTAs and badges
- **Background Cream**: `#F5F1DC` - Warm, premium feel

## ✨ Features

### Core Pages
- **Home Page** - Hero section with featured products grid
- **Product Listing** - All products with category filters and sorting
- **Product Detail** - Complete product information with add-to-cart
- **Shopping Cart** - Manage quantities and proceed to checkout
- **Checkout** - Secure payment flow (Stripe-ready)
- **Authentication** - Login and signup pages with JWT token handling
- **User Dashboard** - Order history and profile management

### Global Features
- ✅ Responsive navbar with cart badge and search
- ✅ Shopping cart context with localStorage persistence
- ✅ JWT authentication setup with Axios interceptors
- ✅ Smooth animations and transitions
- ✅ Modern design with rounded corners and shadows
- ✅ Mobile-responsive throughout
- ✅ SEO-optimized metadata

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API running (Django REST API recommended)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd gloventra

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update API URL in .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation bar
│   ├── Footer.tsx      # Footer component
│   └── ProductCard.tsx # Product card component
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Dashboard.tsx
├── context/            # React context providers
│   └── CartContext.tsx # Shopping cart state
├── lib/                # Utilities and configurations
│   ├── api.ts         # Axios instance with JWT interceptor
│   └── utils.ts       # Helper functions
├── types/              # TypeScript type definitions
│   └── product.ts     # Product, Cart, User types
├── data/               # Mock data (temporary)
│   └── mockProducts.ts
└── assets/            # Images and static files
```

## 🔧 Configuration

### API Integration

The app is configured to connect to a backend API. Update the `VITE_API_URL` in your `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

### Authentication

JWT tokens are automatically attached to requests via Axios interceptors. The token is stored in `localStorage` after successful login.

### Backend Endpoints Expected

```
POST /auth/login        - User login
POST /auth/signup       - User registration
GET  /products          - List all products
GET  /products/:id      - Get product details
POST /cart              - Add to cart
GET  /orders            - Get user orders
POST /checkout          - Process payment
```

## 🎯 Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 🎨 Design System

All colors and styles are defined in the design system:
- `src/index.css` - CSS custom properties and HSL colors
- `tailwind.config.ts` - Extended Tailwind configuration

### Using Design Tokens

```tsx
// ✅ Correct - Use semantic tokens
<Button className="bg-primary text-primary-foreground">

// ❌ Wrong - Don't use direct colors
<Button className="bg-blue-600 text-white">
```

## 🔒 Security

- JWT token refresh handled automatically
- Secure localStorage token storage
- Protected routes redirect to login
- Input validation on forms
- Secure payment flow ready for Stripe

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚢 Deployment

### Frontend Deployment (Vercel Recommended)

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy to Vercel:
```bash
vercel
```

### Environment Variables for Production

Set these in your hosting platform:
```
VITE_API_URL=https://your-api-domain.com/api
```

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📦 Mock Data

Currently using mock data in `src/data/mockProducts.ts`. Replace with actual API calls once backend is ready.

## 🎨 Customization

### Adding New Products
Update mock data or connect to your backend API endpoint.

### Changing Brand Colors
Edit `src/index.css` color variables and update the design system.

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navbar links if needed

## 📄 License

This project is part of the Gloventra e-commerce platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using React + Vite + Tailwind CSS
