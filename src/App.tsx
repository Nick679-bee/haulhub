import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import Navigation from "@/components/Navigation";
import NotificationPanel from "@/components/NotificationPanel";
import HomePage from "@/pages/HomePage";
import OrderPage from "@/pages/OrderPage";
import ServicesPage from "@/pages/ServicesPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <div className="fixed bottom-4 right-4 z-50">
              <NotificationPanel />
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
