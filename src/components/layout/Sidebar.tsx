import { useState } from 'react';
import { Plus, Trash2, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useResumeStore } from '@/hooks/useResumeStore';

export default function Sidebar() {
  const [newConfigName, setNewConfigName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

  const tailoredConfigs = useResumeStore((s) => s.tailoredConfigs);
  const activeTailoredConfigId = useResumeStore((s) => s.activeTailoredConfigId);
  const setActiveTailoredConfig = useResumeStore((s) => s.setActiveTailoredConfig);
  const createTailoredConfig = useResumeStore((s) => s.createTailoredConfig);
  const deleteTailoredConfig = useResumeStore((s) => s.deleteTailoredConfig);

  function handleCreate() {
    const trimmed = newConfigName.trim();
    if (!trimmed) return;

    const id = createTailoredConfig(trimmed);
    setActiveTailoredConfig(id);
    setNewConfigName('');
    setShowNewInput(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      setShowNewInput(false);
      setNewConfigName('');
    }
  }

  function handleDelete(configId: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteTailoredConfig(configId);
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar-background">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Resumes
        </h2>
      </div>

      <ScrollArea className="flex-1 px-2">
        {/* Master Resume item */}
        <button
          onClick={() => setActiveTailoredConfig(null)}
          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
            activeTailoredConfigId === null
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate">Master Resume</span>
        </button>

        <Separator className="my-3" />

        {/* Tailored Configs header */}
        <div className="mb-2 px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tailored Versions
          </span>
        </div>

        {/* Tailored config list */}
        <div className="space-y-0.5">
          {tailoredConfigs.map((config) => (
            <div
              key={config.id}
              onClick={() => setActiveTailoredConfig(config.id)}
              className={`group flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                activeTailoredConfigId === config.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{config.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => handleDelete(config.id, e)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {tailoredConfigs.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            No tailored versions yet.
          </p>
        )}
      </ScrollArea>

      {/* New Tailored Resume */}
      <div className="border-t border-border p-3">
        {showNewInput ? (
          <div className="flex gap-2">
            <Input
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Config name..."
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleCreate} className="h-8 shrink-0">
              Add
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowNewInput(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Tailored Resume
          </Button>
        )}
      </div>
    </div>
  );
}
