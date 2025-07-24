import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Calendar, Users, Monitor, Clock, Smartphone, Tablet, Globe, Filter, RefreshCw, ExternalLink, Hash } from 'lucide-react';
import { format } from 'date-fns';

interface SessionData {
  totalSessions: number;
  uniqueUsers: number;
  mostActivePage: string;
  mostActivePageViews: number;
  activeSessions: number;
}

interface ChartData {
  name: string;
  value: number;
  date?: string;
  sessions?: number;
}

interface ActiveSession {
  session_id: string;
  user_id: string | null;
  created_at: string;
  device_type: string;
  page_url: string | null;
  event_type: string;
}

const chartConfig = {
  sessions: { label: "Sessions", color: "hsl(var(--primary))" },
  desktop: { label: "Desktop", color: "hsl(var(--primary))" },
  tablet: { label: "Tablet", color: "hsl(var(--secondary))" },
  mobile: { label: "Mobile", color: "hsl(var(--accent))" }
};

const DEVICE_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone
};

export const Analytics = () => {
  const [data, setData] = useState<SessionData>({
    totalSessions: 0,
    uniqueUsers: 0,
    mostActivePage: '',
    mostActivePageViews: 0,
    activeSessions: 0
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionsOverTime, setSessionsOverTime] = useState<ChartData[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<ChartData[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ActiveSession[]>([]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const timeFilter = getTimeFilter(timeRange);
      
      // Fetch user analytics data instead of active_sessions
      const { data: analyticsData, error } = await supabase
        .from('user_analytics')
        .select('*')
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform analytics data to match our ActiveSession interface
      const sessionData = analyticsData?.map(item => ({
        session_id: item.session_id,
        user_id: item.user_id,
        created_at: item.created_at,
        device_type: item.device_type,
        page_url: item.page_url,
        event_type: item.event_type
      })) || [];

      setActiveSessions(sessionData);

      // Calculate summary metrics
      const totalSessions = new Set(sessionData.map(s => s.session_id)).size;
      const uniqueUsers = new Set(sessionData.filter(s => s.user_id).map(s => s.user_id)).size;
      
      // Find most active page
      const pageCounts = sessionData.reduce((acc: Record<string, number>, session) => {
        const page = session.page_url || '/';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {});

      const mostActivePageEntry = Object.entries(pageCounts).sort(([,a], [,b]) => b - a)[0];
      const mostActivePage = mostActivePageEntry?.[0] || '';
      const mostActivePageViews = mostActivePageEntry?.[1] || 0;

      // Count recent sessions (last 30 minutes)
      const activeThreshold = new Date(Date.now() - 30 * 60 * 1000);
      const recentSessions = sessionData.filter(s => new Date(s.created_at) > activeThreshold).length;

      setData({
        totalSessions,
        uniqueUsers,
        mostActivePage,
        mostActivePageViews,
        activeSessions: recentSessions
      });

      // Fetch chart data
      await Promise.all([
        fetchSessionsOverTime(timeFilter),
        fetchDeviceBreakdown(sessionData)
      ]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeFilter = (range: string) => {
    const now = new Date();
    switch (range) {
      case '1d': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const fetchSessionsOverTime = async (timeFilter: string) => {
    const { data } = await supabase
      .from('user_analytics')
      .select('created_at')
      .gte('created_at', timeFilter)
      .order('created_at');

    if (data) {
      const sessionsByDate = data.reduce((acc: Record<string, number>, session) => {
        const date = format(new Date(session.created_at), 'MMM dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(sessionsByDate).map(([name, sessions]) => ({
        name,
        value: sessions,
        sessions
      }));

      setSessionsOverTime(chartData);
    }
  };

  const fetchDeviceBreakdown = async (sessionData: ActiveSession[]) => {
    const deviceCount = sessionData.reduce((acc: Record<string, number>, session) => {
      acc[session.device_type] = (acc[session.device_type] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(deviceCount).map(([name, value]) => ({ name, value }));
    setDeviceBreakdown(chartData);
  };

  // Filter sessions based on device and search term
  useEffect(() => {
    let filtered = activeSessions;

    if (deviceFilter !== 'all') {
      filtered = filtered.filter(session => session.device_type === deviceFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.page_url?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    setFilteredSessions(filtered);
  }, [activeSessions, deviceFilter, searchTerm]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Session Analytics
          </h1>
          <p className="text-muted-foreground">Real-time user session tracking and insights</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchAnalyticsData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.totalSessions}</div>
            <p className="text-xs text-muted-foreground">All time sessions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{data.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Page</CardTitle>
            <Globe className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-accent truncate">{data.mostActivePage || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{data.mostActivePageViews} sessions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Last 30 minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Sessions Over Time
            </CardTitle>
            <CardDescription>Daily session creation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="var(--color-sessions)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-sessions)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Session distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceBreakdown.map((entry, index) => {
                      const colors = ['var(--color-desktop)', 'var(--color-tablet)', 'var(--color-mobile)'];
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={colors[index % colors.length]} 
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            Active Sessions
          </CardTitle>
          <CardDescription>Real-time session activity and details</CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Input
              placeholder="Search sessions or pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Session ID</TableHead>
                  <TableHead className="font-semibold">Device</TableHead>
                  <TableHead className="font-semibold">Page URL</TableHead>
                  <TableHead className="font-semibold">Last Activity</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No sessions found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.slice(0, 50).map((session) => {
                    const DeviceIcon = DEVICE_ICONS[session.device_type as keyof typeof DEVICE_ICONS] || Monitor;
                    const isActive = new Date(session.created_at) > new Date(Date.now() - 30 * 60 * 1000);
                    
                    return (
                      <TableRow key={session.session_id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            {session.session_id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{session.device_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 max-w-xs">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{session.page_url || '/'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(session.created_at), 'MMM dd, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isActive ? "default" : "secondary"} className="gap-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            {isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredSessions.length > 50 && (
            <div className="flex justify-center mt-4">
              <p className="text-sm text-muted-foreground">
                Showing first 50 of {filteredSessions.length} sessions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};