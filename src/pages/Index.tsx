import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If referral code present on home, send to auth with code
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref && !user) {
      navigate(`/auth?ref=${encodeURIComponent(ref)}`, { replace: true });
    }
  }, [location.search, user, navigate]);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
