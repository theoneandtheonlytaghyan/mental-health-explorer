import React, { useEffect, useState, useCallback } from 'react';
import { rpcCall } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { Share2, AlertTriangle, ShieldCheck, MessageCircle, Info } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

export const SocialInsights: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rpcCall({ func: 'get_social_media_analysis', args: { limit: 50 } });
      setInsights(data);
    } catch (error) {
      console.error("Failed to load social insights:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getSeverityVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'severe':
        return 'destructive';
      case 'moderate':
        return 'default';
      case 'mild':
      case 'minimal':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 w-full rounded-3xl animate-pulse bg-primary/10" />
        <div className="h-96 w-full rounded-2xl animate-pulse bg-primary/10" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Visual Header */}
      <div className="relative h-64 rounded-3xl overflow-hidden group">
        <img 
          src="./assets/card-network-1.jpg" 
          alt="Digital Network" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-950/90" />
        <div className="absolute bottom-6 left-8 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-md">
              <Share2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-white font-heading tracking-tight">Social Listening Insights</h2>
          </div>
          <p className="text-teal-50/80 max-w-xl">
            Real-time analysis of public discussions related to workplace mental health and community well-being.
          </p>
        </div>
      </div>

      <Card className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="font-heading">Analyzed Public Posts</CardTitle>
              <CardDescription>AI-processed insights across various community platforms</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Feed
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                <TableRow>
                  <TableHead className="w-[45%] font-semibold py-4">Context / Text</TableHead>
                  <TableHead className="w-[20%] font-semibold py-4">Concern</TableHead>
                  <TableHead className="w-[15%] font-semibold py-4">Severity</TableHead>
                  <TableHead className="w-[15%] font-semibold py-4">Safety</TableHead>
                  <TableHead className="w-[5%] font-semibold py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insights.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <MessageCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                          {item.text}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10">
                        {item.primary_concern}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant={getSeverityVariant(item.severity)} className="capitalize px-2.5">
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      {item.safety_concerns ? (
                        <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                          <AlertTriangle className="h-4 w-4" />
                          Requires Attention
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                          <ShieldCheck className="h-4 w-4" />
                          Secure
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Analyzed via Workplace-LLM</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
