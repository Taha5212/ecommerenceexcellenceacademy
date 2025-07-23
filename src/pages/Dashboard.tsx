import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Calendar, Users, MousePointer, Clock, Smartphone, Monitor, Activity, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface RecentEvent {
  id: string;
  event_type: string;
  page_url: string | null;
  created_at: string;
  device_type: string;
}

interface ChartData {
  name: string;
  value: number;
  date?: string;
  signups?: number;
  logins?: number;
}

const chartConfig = {
  pageviews: { label: "Page Views", color: "hsl(var(--primary))" },
  signups: { label: "Signups", color: "hsl(var(--chart-1))" },
  logins: { label: "Logins", color: "hsl(var(--chart-2))" },
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  tablet: { label: "Tablet", color: "hsl(var(--chart-2))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-3))" }
};

const COLORS = {
  desktop: "hsl(var(--chart-1))",
  tablet: "hsl(var(--chart-2))", 
  mobile: "hsl(var(--chart-3))"
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Chart data states
  const [signupLoginTrends, setSignupLoginTrends] = useState<ChartData[]>([]);
  const [pageViewTrends, setPageViewTrends] = useState<ChartData[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<ChartData[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_analytics'
        },
        () => {
          // Refresh data when new analytics are added
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      await Promise.all([
        fetchSignupLoginTrends(sevenDaysAgo),
        fetchPageViewTrends(thirtyDaysAgo),
        fetchDeviceBreakdown(sevenDaysAgo),
        fetchRecentEvents()
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSignupLoginTrends = async (startDate: Date) => {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('created_at, event_type')
      .in('event_type', ['signup', 'login'])
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    if (error) throw error;

    if (data && data.length > 0) {
      // Group by date
      const trends = data.reduce((acc: Record<string, { signups: number; logins: number }>, item) => {
        const date = new Date(item.created_at).toLocaleDateString();
        if (!acc[date]) acc[date] = { signups: 0, logins: 0 };
        if (item.event_type === 'signup') acc[date].signups++;
        if (item.event_type === 'login') acc[date].logins++;
        return acc;
      }, {});

      const chartData = Object.entries(trends).map(([date, values]) => ({
        name: date,
        value: values.signups + values.logins,
        signups: values.signups,
        logins: values.logins
      }));

      setSignupLoginTrends(chartData);
    } else {
      setSignupLoginTrends([]);
    }
  };

  const fetchPageViewTrends = async (startDate: Date) => {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('created_at')
      .eq('event_type', 'pageview')
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    if (error) throw error;

    if (data && data.length > 0) {
      // Group by date
      const trends = data.reduce((acc: Record<string, number>, item) => {
        const date = new Date(item.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(trends).map(([date, count]) => ({
        name: date,
        value: count
      }));

      setPageViewTrends(chartData);
    } else {
      setPageViewTrends([]);
    }
  };

  const fetchDeviceBreakdown = async (startDate: Date) => {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('device_type')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    if (data && data.length > 0) {
      const deviceCount = data.reduce((acc: Record<string, number>, item) => {
        const deviceType = item.device_type || 'unknown';
        acc[deviceType] = (acc[deviceType] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(deviceCount).map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }));
      
      setDeviceBreakdown(chartData);
    } else {
      setDeviceBreakdown([]);
    }
  };

  const fetchRecentEvents = async () => {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('id, event_type, page_url, created_at, device_type')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setRecentEvents(data || []);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into user activity and engagement</p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup/Login Trends - Last 7 Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Daily Signup & Login Counts
            </CardTitle>
            <CardDescription>User authentication activity over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {signupLoginTrends.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signupLoginTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="signups" fill="var(--color-signups)" name="Signups" />
                    <Bar dataKey="logins" fill="var(--color-logins)" name="Logins" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No signup or login data yet</p>
                  <p className="text-sm text-muted-foreground">Start collecting user activity to see trends</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Page Views - Last 30 Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Page Views
            </CardTitle>
            <CardDescription>Total page views per day over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {pageViewTrends.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageViewTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-pageviews)" 
                      strokeWidth={2}
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No page view data yet</p>
                  <p className="text-sm text-muted-foreground">Start collecting user activity to see page view trends</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown - Last 7 Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Distribution
            </CardTitle>
            <CardDescription>Device types used by visitors over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceBreakdown.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name.toLowerCase() === 'desktop' ? COLORS.desktop :
                            entry.name.toLowerCase() === 'tablet' ? COLORS.tablet :
                            COLORS.mobile
                          } 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <Smartphone className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No device data yet</p>
                  <p className="text-sm text-muted-foreground">Start collecting user activity to see device distribution</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Events
            </CardTitle>
            <CardDescription>10 most recent user activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Page URL</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant="secondary">
                            {event.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {event.page_url || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {event.device_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), 'MMM dd, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-center">
                <div className="space-y-2">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No recent events yet</p>
                  <p className="text-sm text-muted-foreground">User activities will appear here as they happen</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};