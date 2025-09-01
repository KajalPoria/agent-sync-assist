import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDescope, useSession, useUser } from '@descope/react-sdk';
import { Shield, ExternalLink, Key, Check, Lock } from "lucide-react";
import { toast } from "sonner";

export function AuthSection() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();
  const { logout } = useDescope();

  const handleDescopeLogin = () => {
    // Redirect to Descope authentication
    window.location.href = `https://api.descope.com/login/P322nxDtmSAQm1htlwdkb6VNgfuK`;
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
  };

  const handleConsoleAccess = () => {
    window.open('https://app.descope.com/home', '_blank');
  };

  if (isSessionLoading) {
    return (
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">Loading authentication...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-secondary/30" id="auth">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise Security
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Powered by <span className="bg-gradient-accent bg-clip-text text-transparent">Descope</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience enterprise-grade authentication with delegated access, scoped permissions, 
            and secure agent-to-agent communication.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Authentication Status */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Authentication Status</h3>
                <p className="text-muted-foreground">Secure access management</p>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <Check className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-semibold text-success">Authenticated</p>
                    <p className="text-sm text-muted-foreground">Welcome, {user?.email || 'User'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Active Permissions:</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Email Agent Access
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Calendar Agent Delegation
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Secure Token Exchange
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-gradient-primary hover:shadow-glow"
                  >
                    Access Agent Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Not Authenticated</p>
                    <p className="text-sm text-muted-foreground">Login to access agent services</p>
                  </div>
                </div>

                <Button 
                  onClick={handleDescopeLogin}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                  size="lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Login with Descope
                </Button>
              </div>
            )}
          </Card>

          {/* Descope Features */}
          <div className="space-y-6">
            <Card className="p-6 border-accent/20 hover:border-accent/40 transition-colors">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Security Features
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    OAuth 2.0 with scoped access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    Delegated user consent
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    Secure token exchange
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    Agent identity verification
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Developer Access</h4>
                <p className="text-sm text-muted-foreground">
                  Access the Descope console to manage authentication, view logs, and configure agent permissions.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleConsoleAccess}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Descope Console
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}