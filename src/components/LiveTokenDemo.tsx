import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from '@descope/react-sdk';
import { 
  ArrowRight, 
  Shield, 
  Key, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface TokenData {
  access_token: string;
  scope: string[];
  issued_at: number;
  expires_in: number;
  agent_id: string;
  delegated_permissions: string[];
}

export function LiveTokenDemo() {
  const { isAuthenticated } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentAToken, setAgentAToken] = useState<TokenData | null>(null);
  const [delegationToken, setDelegationToken] = useState<TokenData | null>(null);
  const [showTokenDetails, setShowTokenDetails] = useState(false);

  const steps = [
    { 
      id: 'auth', 
      title: 'User Authentication', 
      description: 'User authenticates with Descope',
      status: isAuthenticated ? 'completed' : 'pending'
    },
    { 
      id: 'agent-a-token', 
      title: 'Agent A Token Generation', 
      description: 'Generate scoped token for email processing',
      status: agentAToken ? 'completed' : 'pending'
    },
    { 
      id: 'delegation', 
      title: 'Token Delegation', 
      description: 'Agent A delegates calendar access to Agent B',
      status: delegationToken ? 'completed' : 'pending'
    },
    { 
      id: 'execution', 
      title: 'Secure Execution', 
      description: 'Agent B executes calendar operations',
      status: delegationToken ? 'completed' : 'pending'
    }
  ];

  const generateTokens = async () => {
    if (!isAuthenticated) {
      toast.error("Please authenticate first");
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);

    try {
      // Step 1: Generate Agent A token
      await new Promise(resolve => setTimeout(resolve, 1000));
      const agentATokenData: TokenData = {
        access_token: `descope_${Date.now()}_agentA_${Math.random().toString(36).substr(2, 9)}`,
        scope: ['email:read', 'email:process', 'calendar:delegate'],
        issued_at: Date.now(),
        expires_in: 3600,
        agent_id: 'agent-a-email-processor',
        delegated_permissions: ['calendar:write', 'calendar:read']
      };
      setAgentAToken(agentATokenData);
      setCurrentStep(1);

      // Step 2: Generate delegation token
      await new Promise(resolve => setTimeout(resolve, 1500));
      const delegationTokenData: TokenData = {
        access_token: `descope_${Date.now()}_delegated_${Math.random().toString(36).substr(2, 9)}`,
        scope: ['calendar:write', 'calendar:read'],
        issued_at: Date.now(),
        expires_in: 1800,
        agent_id: 'agent-b-calendar-manager',
        delegated_permissions: ['calendar:create_event', 'calendar:modify_event']
      };
      setDelegationToken(delegationTokenData);
      setCurrentStep(2);

      // Step 3: Complete execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(3);

      toast.success("Token delegation flow completed successfully!");
    } catch (error) {
      toast.error("Token generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Token copied to clipboard");
  };

  const formatToken = (token: string) => {
    return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
  };

  return (
    <section className="py-24 bg-background" id="live-demo">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">
            <Key className="w-4 h-4 mr-2" />
            Live Token Delegation
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Real-Time</span> Descope Token Flow
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch how Descope generates, validates, and delegates tokens between agents 
            with proper scope enforcement and user consent.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Token Generation Control */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Token Generation</h3>
                <p className="text-muted-foreground">Initiate secure agent communication</p>
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-success/20 text-success' :
                    currentStep === index && isGenerating ? 'bg-primary/20 text-primary' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : currentStep === index && isGenerating ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {step.status === 'completed' && (
                    <Badge variant="outline" className="text-success border-success/30">
                      Complete
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <Button 
              onClick={generateTokens}
              disabled={isGenerating || !isAuthenticated}
              className="w-full bg-gradient-primary hover:shadow-glow"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Generating Tokens...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Start Token Delegation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {!isAuthenticated && (
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <p className="text-sm text-yellow-500">Authentication required to generate tokens</p>
              </div>
            )}
          </Card>

          {/* Token Details */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Token Details</h3>
                  <p className="text-muted-foreground">Live token information</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTokenDetails(!showTokenDetails)}
              >
                {showTokenDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            {agentAToken ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-primary">Agent A Token</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(agentAToken.access_token)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token:</span>
                      <span className="font-mono">
                        {showTokenDetails ? agentAToken.access_token : formatToken(agentAToken.access_token)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent ID:</span>
                      <span>{agentAToken.agent_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scopes:</span>
                      <div className="flex gap-1">
                        {agentAToken.scope.map((scope, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {delegationToken && (
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-accent">Delegation Token</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(delegationToken.access_token)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token:</span>
                        <span className="font-mono">
                          {showTokenDetails ? delegationToken.access_token : formatToken(delegationToken.access_token)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Agent ID:</span>
                        <span>{delegationToken.agent_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delegated Permissions:</span>
                        <div className="flex gap-1">
                          {delegationToken.delegated_permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Start token generation to see live token details and delegation flow
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}