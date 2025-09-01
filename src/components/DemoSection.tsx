import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Calendar, Upload, Mic, FileText, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from '@descope/react-sdk';

export function DemoSection() {
  const [emailInput, setEmailInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const { isAuthenticated } = useSession();

  const handleEmailSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please authenticate first to use agent services");
      return;
    }

    if (!emailInput.trim()) {
      toast.error("Please enter an email to process");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate Agent A processing
      setProcessingStep('Agent A analyzing email...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStep('Generating secure token...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStep('Agent B requesting calendar access...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep('Creating calendar event...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Email processed and calendar event created successfully!");
      setEmailInput('');
    } catch (error) {
      toast.error("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleFileUpload = () => {
    if (!isAuthenticated) {
      toast.error("Please authenticate first to upload files");
      return;
    }
    toast.info("File upload functionality - Coming soon!");
  };

  const handleAudioUpload = () => {
    if (!isAuthenticated) {
      toast.error("Please authenticate first to use audio input");
      return;
    }
    toast.info("Audio input functionality - Coming soon!");
  };

  return (
    <section className="py-24 bg-background" id="demo">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4">
            <ArrowRight className="w-4 h-4 mr-2" />
            Interactive Demo
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Try the <span className="bg-gradient-primary bg-clip-text text-transparent">Agent Communication</span> Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience how Agent A processes your emails and Agent B manages your calendar 
            with secure, delegated authentication.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Email Input</h3>
                <p className="text-muted-foreground">Submit email content for processing</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Content</label>
                <Textarea 
                  placeholder="Paste your email content here or use alternative input methods below..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleFileUpload}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Upload File</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleAudioUpload}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-xs">Audio Input</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setEmailInput("Subject: Team Meeting Tomorrow\n\nHi team,\n\nLet's schedule our quarterly planning meeting for tomorrow at 2 PM. Please confirm your availability.\n\nBest regards,\nJohn")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Sample Email</span>
                </Button>
              </div>

              <Button 
                onClick={handleEmailSubmit}
                disabled={isProcessing || !isAuthenticated}
                className="w-full bg-gradient-primary hover:shadow-glow"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process Email
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center">
                  Please authenticate to use the demo
                </p>
              )}
            </div>
          </Card>

          {/* Processing Status */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Processing Status</h3>
                <p className="text-muted-foreground">Real-time agent communication</p>
              </div>
            </div>

            {isProcessing ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium">{processingStep}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{width: '60%'}} />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Agent A authenticated with Descope</p>
                  <p className={processingStep.includes('analyzing') ? 'text-primary' : ''}>
                    {processingStep.includes('analyzing') ? '⏳' : '✓'} Processing email content...
                  </p>
                  <p className={processingStep.includes('token') ? 'text-primary' : ''}>
                    {processingStep.includes('token') ? '⏳' : processingStep.includes('calendar') ? '✓' : '⏳'} Generating secure delegation token...
                  </p>
                  <p className={processingStep.includes('calendar') ? 'text-primary' : ''}>
                    {processingStep.includes('calendar') ? '⏳' : processingStep.includes('Creating') ? '✓' : '⏳'} Agent B requesting calendar permissions...
                  </p>
                  <p className={processingStep.includes('Creating') ? 'text-primary' : ''}>
                    {processingStep.includes('Creating') ? '⏳' : '⏳'} Executing with user consent...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Submit an email to see the agent communication process in action
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">What happens when you submit:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Agent A summarizes email content
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Secure token generated for delegation
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      Agent B receives delegated access
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      Calendar event created with consent
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}