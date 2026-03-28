import React from 'react';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Share2, 
  Search, 
  MessageSquare, 
  HeartPulse
} from 'lucide-react';
import { Separator } from '../components/ui/separator';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  appTitle: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, appTitle }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'social', label: 'Social Insights', icon: Share2 },
    { id: 'analyzer', label: 'Text Analyzer', icon: Search },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card/50 backdrop-blur-sm p-4 flex-col gap-1 h-screen sticky top-0">
        <div className="flex items-center gap-2 px-3 py-4">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <HeartPulse className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground leading-tight">
            {appTitle}
          </h2>
        </div>
        <Separator className="my-4 opacity-50" />
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                activeView === item.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-4 w-4", activeView === item.id ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground px-3 uppercase tracking-widest font-semibold">
            Mental Health Explorer v1.0
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-md flex justify-around py-2 px-4 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
              activeView === item.id ? "text-primary bg-primary/5" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
