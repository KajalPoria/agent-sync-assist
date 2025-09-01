import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import heroImage from "@/assets/agent-communication-hero.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative container mx-auto px-6 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="w-4 h-4 mr-2" />
                Powered by Descope Security
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Secure <span className="bg-gradient-primary bg-clip-text text-transparent">Agent-to-Agent</span> Communication
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Experience seamless AI agent collaboration with enterprise-grade security. 
                Agent A summarizes your emails while Agent B manages your calendar - all with 
                delegated authentication and user consent.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Email Intelligence</p>
                  <p className="text-sm text-muted-foreground">AI-powered summarization</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">Calendar Automation</p>
                  <p className="text-sm text-muted-foreground">Smart event creation</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                onClick={() => document.getElementById('tech-stack')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Tech Stack <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/10"
                onClick={() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Shield className="mr-2 h-5 w-5" />
                Live Token Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="AI Agent Communication Platform"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-card border border-primary/20 rounded-lg p-4 shadow-glow animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">Agent A Active</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-card border border-accent/20 rounded-lg p-4 shadow-elegant animate-pulse delay-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium">Agent B Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}