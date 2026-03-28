import React, { useState, useEffect, useCallback } from 'react';
import { rpcCall, invalidateCache } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  MessageSquare, 
  Star, 
  History, 
  User, 
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { cn } from '../lib/utils';
import { ScrollArea } from '../components/ui/scroll-area';

export const Feedback: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [type, setType] = useState('General');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const data = await rpcCall({ func: 'get_feedback_logs' });
      setLogs(data);
    } catch (error) {
      console.error("Failed to load feedback logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const response = await rpcCall({
        func: 'submit_feedback',
        args: {
          user_id: 'current_user',
          feedback_type: type,
          content: content,
          rating: rating
        }
      });
      
      // Immediate state update
      const newFeedback = {
        id: response.id,
        feedback_type: type,
        content: content,
        rating: rating,
        created_at: new Date().toISOString()
      };
      setLogs(prev => [newFeedback, ...prev]);
      
      // Reset form
      setContent('');
      setRating(5);
      
      invalidateCache(['get_feedback_logs']);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading">Share Your Feedback</h2>
            <p className="text-muted-foreground">Help us improve the mental health explorer with your insights.</p>
          </div>

          <Card className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  New Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General Feedback</SelectItem>
                          <SelectItem value="Bug Report">Bug Report</SelectItem>
                          <SelectItem value="Feature Request">Feature Request</SelectItem>
                          <SelectItem value="UI/UX">UI/UX Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rating</label>
                      <div className="flex items-center gap-1.5 h-10 px-3 bg-background/50 border border-border/50 rounded-xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform active:scale-90"
                          >
                            <Star 
                              className={cn(
                                "h-4 w-4",
                                star <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Details</label>
                    <Textarea 
                      placeholder="What would you like to tell us?" 
                      className="min-h-[150px] resize-none border-border/50 bg-background/50 rounded-2xl"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-6 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Responses are reviewed by our product team.</p>
                <Button 
                  type="submit" 
                  disabled={submitting || !content.trim()}
                  className="rounded-full px-8 shadow-md"
                >
                  {submitting ? <Spinner className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                  Submit Feedback
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Feedback Logs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                Past Feedback
              </h2>
              <p className="text-muted-foreground">Recent contributions from the community.</p>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {logs.length} Total
            </Badge>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {loadingLogs ? (
                [1, 2, 3].map(i => <div key={i} className="h-32 w-full rounded-2xl animate-pulse bg-primary/10" />)
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-card/20 rounded-3xl border-2 border-dashed border-muted/50">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground font-medium">No feedback submitted yet.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <Card key={log.id} className="border-none bg-card/40 backdrop-blur-sm shadow-soft overflow-hidden group hover:bg-card/60 transition-colors">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs font-bold text-foreground/70 tracking-tight">Anonymous User</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold border-border/50">
                          {log.feedback_type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                        {log.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s}
                              className={cn(
                                "h-3 w-3",
                                s <= log.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"
                              )} 
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                          <Calendar className="h-3 w-3" />
                          {new Date(log.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
