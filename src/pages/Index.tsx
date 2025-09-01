import { Hero } from "@/components/Hero";
import { AgentShowcase } from "@/components/AgentShowcase";
import { AuthSection } from "@/components/AuthSection";
import { DemoSection } from "@/components/DemoSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <AgentShowcase />
      <AuthSection />
      <DemoSection />
      <Footer />
    </main>
  );
};

export default Index;