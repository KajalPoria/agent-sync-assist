import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Code, 
  Database, 
  Cloud, 
  Zap, 
  Lock,
  ExternalLink,
  CheckCircle
} from "lucide-react";

export function TechStackSection() {
  const techStacks = [
    {
      category: "Authentication & Authorization",
      icon: <Shield className="w-6 h-6" />,
      primary: "Descope Inbound Apps",
      description: "Enterprise-grade OAuth 2.0 with delegated access and secure token exchange",
      features: ["Token Generation", "Scope Validation", "Delegation Management", "User Consent Flows"],
      color: "bg-primary/20 text-primary",
      link: "https://app.descope.com/P320WxedXmGS82w7wBT4jpd8zokl"
    },
    {
      category: "Agent Frameworks",
      icon: <Code className="w-6 h-6" />,
      primary: "Multi-Agent Architecture",
      description: "Secure agent-to-agent communication with defined roles and scoped permissions",
      features: ["Azure AI Foundry", "LangGraph Integration", "Vertex AI Agents", "Custom Agent Builder"],
      color: "bg-accent/20 text-accent",
      link: "#demo"
    },
    {
      category: "Backend Infrastructure",
      icon: <Database className="w-6 h-6" />,
      primary: "Supabase + Edge Functions",
      description: "Serverless backend with real-time data sync and secure API endpoints",
      features: ["PostgreSQL Database", "Real-time Subscriptions", "Edge Functions", "Row Level Security"],
      color: "bg-success/20 text-success",
      link: "https://supabase.com"
    },
    {
      category: "Frontend Framework",
      icon: <Zap className="w-6 h-6" />,
      primary: "React + TypeScript",
      description: "Modern React application with TypeScript for type safety and better DX",
      features: ["Vite Build Tool", "Tailwind CSS", "React Query", "React Router"],
      color: "bg-yellow-500/20 text-yellow-500",
      link: "https://react.dev"
    }
  ];

  const securityFeatures = [
    "OAuth 2.0 with PKCE for secure authorization",
    "Scoped access tokens for granular permissions",
    "Secure token delegation between agents",
    "User consent flows for sensitive operations",
    "JWT validation on all protected endpoints",
    "Role-based access control (RBAC)"
  ];

  return (
    <section className="py-24 bg-muted/30" id="tech-stack">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">
            <Code className="w-4 h-4 mr-2" />
            Technology Stack
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Built with <span className="bg-gradient-primary bg-clip-text text-transparent">Enterprise-Grade</span> Technologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Demonstrating secure agent communication with Descope-issued tokens, 
            enforced scopes, and proper delegation of access rights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {techStacks.map((stack, index) => (
            <Card key={index} className="p-8 hover:shadow-elegant transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stack.color}`}>
                    {stack.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{stack.category}</h3>
                    <p className="text-primary font-semibold">{stack.primary}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={stack.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-muted-foreground">{stack.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  {stack.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Security Compliance */}
        <Card className="p-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Security & Compliance Features</h3>
                <p className="text-muted-foreground">Enforcing industry standards for secure agent communication</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                className="bg-gradient-primary hover:shadow-glow"
                asChild
              >
                <a href="#demo">
                  Try Live Demo
                </a>
              </Button>
              <Button 
                variant="outline"
                asChild
              >
                <a href="https://app.descope.com/P320WxedXmGS82w7wBT4jpd8zokl" target="_blank" rel="noopener noreferrer">
                  <Shield className="w-4 h-4 mr-2" />
                  View Descope Console
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}