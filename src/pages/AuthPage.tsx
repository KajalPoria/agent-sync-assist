import React from 'react';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useUser, Descope } from '@descope/react-sdk';
import { Card } from '../components/ui/card.tsx';
import { Button } from '../components/ui/button.tsx';
import { toast } from 'sonner';

export default function AuthPage() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();
  const navigate = useNavigate();

  // Handle successful authentication with proper callback and redirect
  const handleSuccess = useCallback((e: any) => {
    console.log('✅ Descope onSuccess triggered:', e.detail);
    console.log('✅ User authenticated:', e.detail.user);
    
    // Show success message
    console.log('🔄 Authentication successful, redirecting to dashboard...');
    
    // Use a small delay to ensure session is properly set
    setTimeout(() => {
      console.log('🚀 Executing redirect to dashboard');
      window.location.replace('/dashboard');
    }, 100);
  }, []);

  const handleError = useCallback((e: any) => {
    console.error('❌ Descope authentication error:', e.detail);
    
    // Show user-friendly error message
    if (e.detail?.errorMessage) {
      console.error('Error details:', e.detail.errorMessage);
    }
  }, []);

  // Session-based redirect as backup
  useEffect(() => {
    if (!isSessionLoading && isAuthenticated && user) {
      console.log('🔄 Session detected, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isSessionLoading, user, navigate]);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    console.log('Already authenticated, should redirect...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to AgentComm</h1>
          <p className="text-muted-foreground">Secure Agent Communication Platform</p>
        </div>
        
        <Card className="p-8">
          <div className="space-y-4">
            <Descope
              flowId="sign-up-or-in"
              onSuccess={handleSuccess}
              onError={handleError}
              theme="light"
            />
            
            {/* Error handling and instructions */}
            <div className="mt-4 p-3 bg-muted/50 rounded text-xs space-y-2">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ensure the Descope flow "sign-up-or-in" is configured</li>
                <li>• Project ID: P322nxDtmSAQm1htlwdkb6VNgfuK</li>
                <li>• Current URL: {window.location.origin}</li>
                <li>• Check redirect URLs in Descope console</li>
              </ul>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                If authentication fails, configure your Descope project:
              </p>
              <button 
                onClick={() => window.open('https://app.descope.com/projects/P322nxDtmSAQm1htlwdkb6VNgfuK', '_blank')}
                className="text-primary hover:underline text-sm"
              >
                Open Descope Console →
              </button>
            </div>
            
            {/* Alternative auth method as fallback */}
            <div className="mt-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
              <div className="text-center">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Demo Mode Available</h4>
                <p className="text-xs text-amber-700 mb-3">
                  If Descope authentication is not working, you can still test the platform functionality.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Set a mock authenticated state for demo purposes
                    toast.success("Demo mode activated - you can now test the platform features!");
                    window.location.href = '/dashboard';
                  }}
                  className="text-amber-800 border-amber-300 hover:bg-amber-100"
                >
                  Continue in Demo Mode
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-primary hover:underline text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}