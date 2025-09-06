import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { AuthProvider, useDescope, useSession, useUser } from '@descope/react-sdk';
import { Descope } from '@descope/react-sdk';
import { Shield, ExternalLink, Key, Check, Lock, Loader, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Backend session validation function
const validateSession = async (sessionToken: string): Promise<boolean> => {
  try {
    // For development/demo purposes, we'll simulate successful validation
    // In production, replace this with actual API call to your backend
    console.log("Validating session token:", sessionToken?.substring(0, 20) + "...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, assume validation is successful if we have a token
    // In a real app, you would make an actual API call here:
    /*
    const response = await fetch('/api/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken }),
    });
    
    if (!response.ok) return false;
    const data = await response.json();
    return data.valid;
    */
    
    return !!sessionToken; // Demo: return true if sessionToken exists
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

// Main AuthSection component
export function AuthSection() {
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const { user } = useUser();
  const { logout } = useDescope();
  const [isValidating, setIsValidating] = useState(false);
  const [backendValidated, setBackendValidated] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Validate session with backend when session token changes
  useEffect(() => {
    if (isAuthenticated && sessionToken) {
      validateSessionWithBackend();
    } else {
      setBackendValidated(false);
      setValidationError('');
    }
  }, [isAuthenticated, sessionToken]);

  const validateSessionWithBackend = async () => {
    if (!sessionToken) {
      setValidationError('No session token available');
      return;
    }
    
    setIsValidating(true);
    setValidationError('');
    try {
      const isValid = await validateSession(sessionToken);
      setBackendValidated(isValid);
      
      if (!isValid) {
        setValidationError("Session validation failed. Please log in again.");
        toast.error("Session validation failed");
      } else {
        toast.success("Session validated successfully");
      }
    } catch (error) {
      console.error('Validation error:', error);
      setBackendValidated(false);
      setValidationError('Validation service unavailable');
      toast.error("Validation service error");
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    logout();
    setBackendValidated(false);
    setValidationError('');
    toast.success("Successfully logged out");
  };

  const handleConsoleAccess = () => {
    window.open('https://app.descope.com/home', '_blank');
  };

  const handleRetryValidation = () => {
    validateSessionWithBackend();
  };

  if (isSessionLoading) {
    return (
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center">
            <Loader className="w-6 h-6 mr-2 animate-spin" />
            Loading authentication...
          </div>
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
                    <p className="font-semibold text-success">Frontend Authenticated</p>
                    <p className="text-sm text-muted-foreground">Welcome, {user?.email || 'User'}</p>
                  </div>
                </div>
                
                {/* Backend Validation Status */}
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Backend Validation
                  </h4>
                  
                  {isValidating && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader className="w-4 h-4 animate-spin" />
                      Validating session with backend...
                    </div>
                  )}
                  
                  {backendValidated && !isValidating && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Check className="w-4 h-4" />
                      Backend session validated successfully
                    </div>
                  )}
                  
                  {validationError && !isValidating && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        {validationError}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRetryValidation}
                        className="text-xs"
                      >
                        Retry Validation
                      </Button>
                    </div>
                  )}
                  
                  {!isValidating && !backendValidated && !validationError && (
                    <div className="text-sm text-muted-foreground">
                      Click below to validate with backend
                    </div>
                  )}
                  
                  {!isValidating && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={validateSessionWithBackend}
                      disabled={isValidating}
                    >
                      Validate Session
                    </Button>
                  )}
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
                    disabled={!backendValidated}
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

                <Descope
                  flowId="sign-up-or-in"
                  theme="light"
                  onSuccess={(e) => {
                    console.log('Login successful:', e.detail.user);
                    toast.success('Successfully logged in!');
                  }}
                  onError={(err) => {
                    console.error("Login error:", err);
                    toast.error("Authentication failed. Please try again.");
                  }}
                />
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
                <h4 className="text-lg font-semibold">Troubleshooting</h4>
                <p className="text-sm text-muted-foreground">
                  If you're experiencing validation issues, check that your backend API is running and accessible.
                </p>
                <div className="text-xs p-3 bg-muted rounded">
                  <strong>Development Note:</strong> The validation is currently simulated. In production, implement a proper backend endpoint at <code>/api/validate-session</code>.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main App component
export default function App() {
  return (
    <AuthProvider projectId="P322nxDtmSAQm1htlwdkb6VNgfuK">
      <AuthSection />
    </AuthProvider>
  );
}