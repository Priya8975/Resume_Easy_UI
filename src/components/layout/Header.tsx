import { useState } from 'react';
import { FileText, Settings, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/hooks/useResumeStore';
import { generateLatex } from '@/lib/latex/generator';
import { compileToPdf, downloadFile } from '@/lib/latex/compiler';

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const [compiling, setCompiling] = useState(false);

  const settings = useResumeStore((s) => s.settings);
  const updateSettings = useResumeStore((s) => s.updateSettings);
  const getEffectiveResume = useResumeStore((s) => s.getEffectiveResume);

  async function handleCompilePdf() {
    setCompiling(true);
    try {
      const resume = getEffectiveResume();
      const tex = generateLatex(resume);
      const result = await compileToPdf(tex);

      if (result.success && result.pdfBlob) {
        downloadFile(result.pdfBlob, 'resume.pdf');
      } else {
        alert(`PDF compilation failed:\n${result.errorLog || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Compilation error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setCompiling(false);
    }
  }

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: App title */}
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Resume Easy</h1>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompilePdf}
            disabled={compiling}
          >
            {compiling ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-1.5 h-4 w-4" />
            )}
            {compiling ? 'Compiling...' : 'Compile PDF'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Inline settings panel */}
      {showSettings && (
        <div className="mt-3 flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3">
          <label className="text-sm font-medium text-foreground">
            OpenAI API Key:
          </label>
          <Input
            type="password"
            placeholder="sk-..."
            value={settings.openaiApiKey}
            onChange={(e) => updateSettings({ openaiApiKey: e.target.value })}
            className="max-w-sm"
          />
          <label className="text-sm font-medium text-foreground">Model:</label>
          <Input
            type="text"
            placeholder="gpt-4o-mini"
            value={settings.openaiModel}
            onChange={(e) => updateSettings({ openaiModel: e.target.value })}
            className="max-w-48"
          />
        </div>
      )}
    </header>
  );
}
