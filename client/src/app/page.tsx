import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CallToActionSection from "@/components/landing/CallToActionSection";
import FeaturedListings from "@/components/landing/FeaturedListings";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="transparent" />
      <main>
        <HeroSection />
        <FeaturedListings />
        <FeaturesSection />
        <HowItWorksSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}
