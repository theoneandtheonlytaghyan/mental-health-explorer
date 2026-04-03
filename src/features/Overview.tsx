import React, { useEffect, useState, useCallback } from 'react';
import { rpcCall } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { 
  Users, 
  Activity, 
  Stethoscope, 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Skeleton } from '../components/ui/skeleton';

const COLORS = ['#0D9488', '#14B8A6', '#5EEAD4', '#99F6E4', '#CCFBF1'];

export const Overview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, distData] = await Promise.all([
        rpcCall({ func: 'get_survey_stats' }),
        rpcCall({ func: 'get_survey_distributions' })
      ]);
      setStats(statsData);
      setDistributions(distData);
    } catch (error) {
      console.error("Failed to load overview data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const StatCard = ({ title, value, icon: Icon, description, prefix = "", suffix = "" }: any) => (
    <Card className="overflow-hidden border-none bg-card/40 backdrop-blur-sm shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-heading text-foreground">{prefix}{value}{suffix}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {description && (
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-primary" />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 w-full rounded-2xl animate-pulse bg-primary/10" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] w-full rounded-2xl animate-pulse bg-primary/10" />
          <div className="h-[400px] w-full rounded-2xl animate-pulse bg-primary/10" />
        </div>
      </div>
    );
  }

  const genderData = distributions.find(d => d.category === "Gender")?.data.map((item: any) => ({ ...item, name: item.label })) || [];
  const countryData = distributions.find(d => d.category === "Top Countries")?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden mb-8 group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
          style={{ backgroundImage: "url('/assets/hero-office-1.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-900/40 to-transparent" />
        <div className="relative p-8 md:p-12 space-y-4 max-w-2xl">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-none backdrop-blur-md mb-2">Global Wellness Analytics</Badge>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
            Understanding workplace mental health through data.
          </h1>
          <p className="text-teal-50/90 text-lg md:text-xl">
            Analyzing survey responses from 1,200+ professionals across 15 countries to improve support systems.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Responses" 
          value={stats?.total_responses || 0} 
          icon={Users} 
          description="Global workplace survey participants"
        />
        <StatCard 
          title="Treatment Rate" 
          value={Math.round((stats?.treatment_rate || 0) * 100)} 
          suffix="%"
          icon={Stethoscope} 
          description="Seeking professional support"
        />
        <StatCard 
          title="Work Interference" 
          value={Math.round((stats?.work_interference_rate || 0) * 100)} 
          suffix="%"
          icon={Activity} 
          description="Reporting impact on productivity"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <PieChartIcon className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="font-heading text-lg">Gender Distribution</CardTitle>
            </div>
            <CardDescription>Breakdown of survey respondents by gender</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="font-heading text-lg">Top 5 Countries</CardTitle>
            </div>
            <CardDescription>Most active regions in survey participation</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="label" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(13, 148, 136, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 8, 8, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
