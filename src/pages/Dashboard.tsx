import React from 'react';
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { useSession, useUser, useDescope } from '@descope/react-sdk';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Shield, 
  Activity, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Lock,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client.ts";

interface AgentStats {
  emailsProcessed: number;
  eventsCreated: number;
  tokensGenerated: number;
  lastActivity: string;
  recentCommunications: any[];
  totalCommunications: number;
}

export default function Dashboard() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();
  const { logout } = useDescope();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentStats>({
    emailsProcessed: 0,
    eventsCreated: 0,
    tokensGenerated: 0,
    lastActivity: 'Loading...',
    recentCommunications: [],
    totalCommunications: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('get-dashboard-stats');
      
      if (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error("Failed to load dashboard stats");
        return;
      }

      setStats(data);
    } catch (error) {
      console.error('Error invoking dashboard stats function:', error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      toast.error("Authentication required");
      navigate('/');
    } else if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated, isSessionLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold">Agent Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-success border-success/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchDashboardStats}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Welcome, {user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emails Processed</p>
                  <p className="text-3xl font-bold text-primary">{stats.emailsProcessed}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Events Created</p>
                  <p className="text-3xl font-bold text-accent">{stats.eventsCreated}</p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tokens Generated</p>
                  <p className="text-3xl font-bold text-success">{stats.tokensGenerated}</p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                  <p className="text-lg font-semibold">{stats.lastActivity}</p>
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </Card>
          </div>

          {/* Agent Status */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Agent A Status</h3>
                    <p className="text-muted-foreground">Email Intelligence Agent</p>
                  </div>
                  <Badge className="ml-auto bg-success/10 text-success border-success/20">
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing Capacity</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-primary h-2 rounded-full" style={{width: '78%'}} />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Total Communications</span>
                      <span className="font-medium">{stats.totalCommunications}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Recent Activity</span>
                      <span className="font-medium">{stats.recentCommunications.length} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium text-success">
                        {stats.totalCommunications > 0 
                          ? Math.round((stats.eventsCreated / stats.totalCommunications) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Agent B Status</h3>
                    <p className="text-muted-foreground">Calendar Management Agent</p>
                  </div>
                  <Badge className="ml-auto bg-success/10 text-success border-success/20">
                    <Users className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calendar Sync</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-accent h-2 rounded-full" style={{width: '100%'}} />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Events Created</span>
                      <span className="font-medium">{stats.eventsCreated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tokens Generated</span>
                      <span className="font-medium">{stats.tokensGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Consent Rate</span>
                      <span className="font-medium text-success">
                        {stats.tokensGenerated > 0 
                          ? Math.round((stats.recentCommunications.filter(c => c.user_consent_given).length / stats.tokensGenerated) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Security & Compliance */}
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Security & Compliance</h3>
                  <p className="text-muted-foreground">Descope authentication and authorization status</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="font-medium">OAuth 2.0 Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Secure token exchange operational
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="font-medium">Scoped Access</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Agent permissions properly configured
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="font-medium">User Consent</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {stats.recentCommunications.filter(c => c.user_consent_given === false).length} pending requests
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Recent Activity */}
          {stats.recentCommunications.length > 0 && (
            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Recent Communications</h3>
                    <p className="text-muted-foreground">Latest agent interactions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.recentCommunications.slice(0, 5).map((comm, index) => (
                    <div key={comm.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0">
                        {comm.has_calendar_event ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{comm.from_agent}</span>
                          <ArrowLeft className="w-3 h-3 text-muted-foreground rotate-180" />
                          <span className="font-medium">{comm.to_agent}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {comm.parsed_info?.subject || 'Email processed'} • 
                          {new Date(comm.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant={comm.user_consent_given ? "default" : "secondary"} className="text-xs">
                          {comm.processing_status || 'completed'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}