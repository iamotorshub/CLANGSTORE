import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AdminGuard from "@/components/AdminGuard";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FashionChatbot from "@/components/FashionChatbot";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AIStudio from "./pages/AIStudio";
import VirtualFitting from "./pages/VirtualFitting";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/probador-virtual" element={<VirtualFitting />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/studio-ai" element={<AdminGuard><AIStudio /></AdminGuard>} />
        <Route path="/admin/productos" element={<AdminGuard><AdminProducts /></AdminGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AdminAuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <div className="grain-overlay" aria-hidden="true" />
            <BrowserRouter>
              <Navbar />
              <CartDrawer />
              <WhatsAppButton />
              <FashionChatbot />
              <AnimatedRoutes />
            </BrowserRouter>
          </CartProvider>
        </AdminAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
