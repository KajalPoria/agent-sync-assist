import { Hero } from "@/components/Hero";
import { AgentShowcase } from "@/components/AgentShowcase";
import { TechStackSection } from "@/components/TechStackSection";
import { AuthSection } from "@/components/AuthSection";
import { DemoSection } from "@/components/DemoSection";
import { LiveTokenDemo } from "@/components/LiveTokenDemo";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <AgentShowcase />
      <TechStackSection />
      <AuthSection />
      <DemoSection />
      <LiveTokenDemo />
      <Footer />
    </main>
  );
};

export default Index;