import React, { useState } from 'react';
import { rpcCall } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  BrainCircuit, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Activity,
  Heart
} from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export const TextAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await rpcCall({ func: 'analyze_text', args: { text: input } });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">AI Narrative Analyzer</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Input thoughts, journal entries, or survey responses for empathetic real-time analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Input Text
              </CardTitle>
              <CardDescription>We recommend at least 2-3 sentences for best results.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="How are you feeling today? Share your workplace experiences..." 
                className="min-h-[250px] resize-none border-border/50 bg-background/50 focus:ring-primary/20 transition-all rounded-2xl text-base leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
            <CardFooter className="justify-between border-t border-border/50 bg-muted/20 px-6 py-4">
              <div className="text-xs text-muted-foreground italic">
                Processed privately using secure NLP models.
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !input.trim()}
                className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {loading ? <Spinner className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                Analyze Now
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-3xl space-y-4">
              <div className="p-4 rounded-full bg-muted/50">
                <Activity className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Analysis results will appear here after processing.
              </p>
            </div>
          )}

          {loading && (
            <Card className="h-full border-none bg-card/40 backdrop-blur-sm shadow-soft flex flex-col items-center justify-center p-12 text-center space-y-6">
              <Spinner className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <p className="font-heading text-lg font-bold">Processing Sentiment</p>
                <p className="text-sm text-muted-foreground animate-pulse">Our AI is analyzing the nuances of your input...</p>
              </div>
            </Card>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <Card className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary text-primary-foreground">AI Assessment</Badge>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardTitle className="font-heading text-xl">{result.primary_concern}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Severity:</span>
                    <Badge variant={getSeverityVariant(result.severity_level)}>{result.severity_level}</Badge>
                    {result.confidence_score !== undefined && (
                      <span className="text-[10px] text-muted-foreground ml-auto bg-muted/50 px-2 py-0.5 rounded-full">
                        Confidence: {(result.confidence_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sentiment Trend</p>
                      <p className="text-sm font-semibold text-foreground">{result.sentiment_trend || 'Stable'}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Primary Concern</p>
                      <p className="text-sm font-semibold text-foreground">{result.primary_concern}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Lightbulb className="h-3 w-3 text-amber-500" />
                      Empathetic Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
                      "{result.analysis_summary}"
                    </p>
                  </div>
                  
                  {result.actionable_steps && result.actionable_steps.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Activity className="h-3 w-3 text-emerald-500" />
                        Actionable Steps
                      </h4>
                      <ul className="space-y-2">
                        {result.actionable_steps.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <Heart className="h-3 w-3 text-rose-500" />
                      Recommended Support
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.support_needed?.map((support: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-background/50 border-primary/20 text-primary">
                          {support}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
