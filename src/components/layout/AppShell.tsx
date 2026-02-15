import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ContactInfoEditor from '@/components/resume/ContactInfoEditor';
import SectionEditor from '@/components/resume/SectionEditor';
import LatexPreview from '@/components/preview/LatexPreview';
import ApiKeySettings from '@/components/ai/ApiKeySettings';
import JobDescriptionPanel from '@/components/ai/JobDescriptionPanel';
import { useResumeStore } from '@/hooks/useResumeStore';

type Tab = 'editor' | 'preview' | 'ai';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('editor');

  const getEffectiveResume = useResumeStore((s) => s.getEffectiveResume);
  const activeTailoredConfigId = useResumeStore((s) => s.activeTailoredConfigId);
  const isReadOnly = activeTailoredConfigId === null;
  // Subscribe to underlying state so component re-renders when configs change
  useResumeStore((s) => s.tailoredConfigs);
  useResumeStore((s) => s.masterResume);
  const resume = getEffectiveResume();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'editor', label: 'Editor' },
    { id: 'preview', label: 'Preview' },
    { id: 'ai', label: 'AI Match' },
  ];

  const sortedSections = [...resume.sections].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-border bg-card px-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-none border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' && (
              <ScrollArea className="h-full">
                <div className="space-y-4 p-6">
                  <ContactInfoEditor />
                  {sortedSections.map((section) => (
                    <SectionEditor key={`${activeTailoredConfigId ?? 'master'}-${section.id}`} section={section} readOnly={isReadOnly} />
                  ))}
                </div>
              </ScrollArea>
            )}

            {activeTab === 'preview' && (
              <div className="h-full">
                <LatexPreview key={activeTailoredConfigId ?? 'master'} />
              </div>
            )}

            {activeTab === 'ai' && (
              <ScrollArea className="h-full">
                <div className="max-w-2xl space-y-4 p-6">
                  <ApiKeySettings />
                  <JobDescriptionPanel />
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
