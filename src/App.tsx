import React, { useEffect, useState } from 'react';
import { Sidebar } from './features/Sidebar';
import { Overview } from './features/Overview';
import { SocialInsights } from './features/SocialInsights';
import { TextAnalyzer } from './features/TextAnalyzer';
import { Feedback } from './features/Feedback';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const appTitle = "Mental Health Explorer";

  useEffect(() => {
    console.log("RENDER_SUCCESS");
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <Overview />;
      case 'social':
        return <SocialInsights />;
      case 'analyzer':
        return <TextAnalyzer />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Background Texture Wash */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-mesh" />
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: "url('/assets/bg-texture-1.jpg')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      </div>

      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        appTitle={appTitle} 
      />

      <main className={cn(
        "flex-1 relative z-10",
        "px-4 py-6 md:px-10 md:py-8",
        "pb-24 md:pb-8" // Extra padding for mobile bottom nav
      )}>
        <div className="max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
