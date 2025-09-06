import React from 'react';
import { Hero } from "../components/Hero.tsx";
import { AgentShowcase } from "../components/AgentShowcase.tsx";
import { TechStackSection } from "../components/TechStackSection.tsx";
import { AuthSection } from "../components/AuthSection.tsx";
import { DemoSection } from "../components/DemoSection.tsx";
import { LiveTokenDemo } from "../components/LiveTokenDemo.tsx";
import { Footer } from "../components/Footer.tsx";

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