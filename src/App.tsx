import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { B2BProvider } from "@/context/B2BContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLayout from "@/components/admin/AdminLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts_new.tsx";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotifications from "./pages/admin/AdminNotifications";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import ShippingInfo from "./pages/ShippingInfo";
import About from "./pages/About";
import EditProfile from "./pages/EditProfile";
import Electronics from "./pages/Electronics";
import Fashion from "./pages/Fashion";
import Marketplace from "./pages/Marketplace";
import B2BRegistration from "./pages/B2BRegistration";
import BulkOrder from "./pages/BulkOrder";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <B2BProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin Routes - No Navbar/Footer */}
              <Route path="/admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
              <Route path="/admin/notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />

              {/* Public Routes - With Navbar/Footer */}
              <Route path="/*" element={
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/b2b-register" element={<B2BRegistration />} />
                      <Route path="/bulk-order" element={<BulkOrder />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="*" element={<NotFound />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping-info" element={<ShippingInfo />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/dashboard/edit-profile" element={<EditProfile />} />
                      <Route path="/electronics" element={<Electronics />} />
                      <Route path="/fashion" element={<Fashion />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </B2BProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
