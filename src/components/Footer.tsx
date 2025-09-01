import { Button } from "@/components/ui/button";
import { Shield, ExternalLink, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">AgentComm</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure agent-to-agent communication platform powered by Descope's 
              enterprise authentication system.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#demo" className="hover:text-foreground transition-colors">Try Demo</a></li>
              <li><a href="#auth" className="hover:text-foreground transition-colors">Authentication</a></li>
              <li><a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h4 className="font-semibold">Security</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">OAuth 2.0</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Token Delegation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Scoped Access</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://app.descope.com/P320WxedXmGS82w7wBT4jpd8zokl', '_blank')}
                className="w-full justify-start"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Descope Console
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.descope.com', '_blank')}
                className="w-full justify-start"
              >
                <Globe className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 AgentComm Platform</span>
              <span>Powered by Descope</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Secure Connection
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}