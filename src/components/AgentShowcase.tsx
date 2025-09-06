import React from 'react';
import { Card } from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Mail, Calendar, Shield, ArrowRight, Lock, CheckCircle } from "lucide-react";

export function AgentShowcase() {
  const agents = [
    {
      id: "agent-a",
      name: "Agent A",
      title: "Email Intelligence Agent",
      description: "Analyzes and summarizes email threads, extracting actionable items with advanced NLP processing.",
      icon: Mail,
      color: "primary",
      features: [
        "Email thread summarization",
        "Action item extraction", 
        "Priority classification",
        "Secure token generation"
      ],
      status: "Currently processing communications",
      gradient: "bg-gradient-primary"
    },
    {
      id: "agent-b", 
      name: "Agent B",
      title: "Calendar Management Agent",
      description: "Creates and manages calendar events based on delegated permissions and user consent.",
      icon: Calendar,
      color: "accent",
      features: [
        "Automated event creation",
        "Smart scheduling",
        "Consent-based actions",
        "Delegated access handling"
      ],
      status: "Ready to schedule events",
      gradient: "bg-gradient-accent"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Secure Agent Architecture
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Meet Your AI <span className="bg-gradient-primary bg-clip-text text-transparent">Agent Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Two specialized agents working together securely through Descope's authentication system,
            ensuring your data remains protected while maximizing productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {agents.map((agent, index) => {
            const IconComponent = agent.icon;
            return (
              <Card key={agent.id} className="p-8 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl ${agent.gradient} flex items-center justify-center shadow-glow`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{agent.name}</h3>
                        <p className="text-muted-foreground">{agent.title}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-success border-success/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {agent.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{agent.status}</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Communication Flow */}
        <Card className="p-8 bg-gradient-hero border-primary/20">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">Secure Agent Communication Flow</h3>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold">Email Processing</h4>
                <p className="text-sm text-muted-foreground">Agent A analyzes emails and generates secure tokens</p>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h4 className="font-semibold">Delegated Access</h4>
                <p className="text-sm text-muted-foreground">Agent B receives tokens and requests user consent</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}