import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Calendar, Users, MousePointer, Clock, Smartphone, Monitor } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalPageViews: number;
  totalClicks: number;
  activeUsers: number;
  avgSessionDuration: number;
  signupsToday: number;
  loginsToday: number;
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
  clicks: { label: "Clicks", color: "hsl(var(--secondary))" },
  signups: { label: "Signups", color: "hsl(var(--accent))" },
  logins: { label: "Logins", color: "hsl(var(--muted))" },
  desktop: { label: "Desktop", color: "hsl(var(--primary))" },
  tablet: { label: "Tablet", color: "hsl(var(--secondary))" },
  mobile: { label: "Mobile", color: "hsl(var(--accent))" }
};

export const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalSessions: 0,
    totalPageViews: 0,
    totalClicks: 0,
    activeUsers: 0,
    avgSessionDuration: 0,
    signupsToday: 0,
    loginsToday: 0
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [signupTrends, setSignupTrends] = useState<ChartData[]>([]);
  const [popularPages, setPopularPages] = useState<ChartData[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<ChartData[]>([]);
  const [clickData, setClickData] = useState<ChartData[]>([]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const timeFilter = getTimeFilter(timeRange);
      
      // Fetch basic metrics
      const [
        { count: totalPageViews },
        { count: totalClicks },
        { count: totalSessions },
        { count: signupsToday },
        { count: loginsToday }
      ] = await Promise.all([
        supabase.from('user_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'pageview').gte('created_at', timeFilter),
        supabase.from('user_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'click').gte('created_at', timeFilter),
        supabase.from('user_analytics').select('session_id', { count: 'exact', head: true }).gte('created_at', timeFilter),
        supabase.from('user_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'signup').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('user_analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'login').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Fetch active users (sessions active in last 30 minutes)
      const { count: activeUsers } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity', new Date(Date.now() - 30 * 60 * 1000).toISOString());

      // Fetch unique users count
      const { data: uniqueUsers } = await supabase
        .from('user_analytics')
        .select('user_id')
        .gte('created_at', timeFilter)
        .not('user_id', 'is', null);

      const totalUsers = new Set(uniqueUsers?.map(u => u.user_id)).size;

      // Fetch session durations for average
      const { data: sessionEnds } = await supabase
        .from('user_analytics')
        .select('event_details')
        .eq('event_type', 'session_end')
        .gte('created_at', timeFilter);

      const durations = sessionEnds?.map(s => {
        const details = s.event_details as any;
        return details?.session_duration_ms || 0;
      }) || [];
      const avgSessionDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

      setData({
        totalUsers,
        totalSessions: totalSessions || 0,
        totalPageViews: totalPageViews || 0,
        totalClicks: totalClicks || 0,
        activeUsers: activeUsers || 0,
        avgSessionDuration: Math.round(avgSessionDuration / 1000), // Convert to seconds
        signupsToday: signupsToday || 0,
        loginsToday: loginsToday || 0
      });

      // Fetch chart data
      await Promise.all([
        fetchSignupTrends(timeFilter),
        fetchPopularPages(timeFilter),
        fetchDeviceBreakdown(timeFilter),
        fetchClickData(timeFilter)
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

  const fetchSignupTrends = async (timeFilter: string) => {
    const { data } = await supabase
      .from('user_analytics')
      .select('created_at, event_type')
      .in('event_type', ['signup', 'login'])
      .gte('created_at', timeFilter)
      .order('created_at');

    if (data) {
      const trends = data.reduce((acc: Record<string, { signups: number; logins: number }>, item) => {
        const date = new Date(item.created_at).toLocaleDateString();
        if (!acc[date]) acc[date] = { signups: 0, logins: 0 };
        if (item.event_type === 'signup') acc[date].signups++;
        if (item.event_type === 'login') acc[date].logins++;
        return acc;
      }, {});

      const chartData = Object.entries(trends).map(([date, values]) => ({
        name: date,
        value: values.signups + values.logins, // Required for ChartData interface
        signups: values.signups,
        logins: values.logins
      }));

      setSignupTrends(chartData);
    }
  };

  const fetchPopularPages = async (timeFilter: string) => {
    const { data } = await supabase
      .from('user_analytics')
      .select('page_url')
      .eq('event_type', 'pageview')
      .gte('created_at', timeFilter);

    if (data) {
      const pageCount = data.reduce((acc: Record<string, number>, item) => {
        const page = item.page_url || 'Unknown';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(pageCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));

      setPopularPages(chartData);
    }
  };

  const fetchDeviceBreakdown = async (timeFilter: string) => {
    const { data } = await supabase
      .from('user_analytics')
      .select('device_type')
      .gte('created_at', timeFilter);

    if (data) {
      const deviceCount = data.reduce((acc: Record<string, number>, item) => {
        acc[item.device_type] = (acc[item.device_type] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(deviceCount).map(([name, value]) => ({ name, value }));
      setDeviceBreakdown(chartData);
    }
  };

  const fetchClickData = async (timeFilter: string) => {
    const { data } = await supabase
      .from('user_analytics')
      .select('event_details')
      .eq('event_type', 'click')
      .gte('created_at', timeFilter);

    if (data) {
      const clickCount = data.reduce((acc: Record<string, number>, item) => {
        const details = item.event_details as any;
        const elementText = details?.element_text || 'Unknown';
        acc[elementText] = (acc[elementText] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(clickCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));

      setClickData(chartData);
    }
  };

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
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track user behavior and site performance</p>
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
          
          <Button onClick={fetchAnalyticsData} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <Badge variant="secondary" className="mt-2">
              {data.signupsToday} signups today
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">{data.totalSessions} sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(data.avgSessionDuration / 60)}m {data.avgSessionDuration % 60}s</div>
            <p className="text-xs text-muted-foreground">{data.totalClicks} total clicks</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup/Login Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Signup & Login Trends</CardTitle>
            <CardDescription>Daily signups and logins over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={signupTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="signups" stroke="var(--color-signups)" strokeWidth={2} />
                  <Line type="monotone" dataKey="logins" stroke="var(--color-logins)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularPages} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-pageviews)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitor distribution by device type</CardDescription>
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
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? 'var(--color-desktop)' : index === 1 ? 'var(--color-tablet)' : 'var(--color-mobile)'} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Most Clicked Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Most Clicked Elements</CardTitle>
            <CardDescription>Top buttons and links clicked by users</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clickData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-clicks)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};