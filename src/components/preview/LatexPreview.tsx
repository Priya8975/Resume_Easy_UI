import { useEffect, useState, useRef, useCallback } from 'react';
import { Copy, Check, Code, FileText, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-latex';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/hooks/useResumeStore';
import { generateLatex } from '@/lib/latex/generator';
import { compileToPdf } from '@/lib/latex/compiler';

type PreviewMode = 'latex' | 'pdf';

export default function LatexPreview() {
  const [mode, setMode] = useState<PreviewMode>('pdf');
  const [copied, setCopied] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [lastCompiledLatex, setLastCompiledLatex] = useState<string | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  const getEffectiveResume = useResumeStore((s) => s.getEffectiveResume);
  const masterResume = useResumeStore((s) => s.masterResume);
  const activeTailoredConfigId = useResumeStore((s) => s.activeTailoredConfigId);
  const tailoredConfigs = useResumeStore((s) => s.tailoredConfigs);

  const resume = getEffectiveResume();
  const latex = generateLatex(resume);

  const hasChanges = latex !== lastCompiledLatex;

  // Syntax highlighting for LaTeX mode
  useEffect(() => {
    if (mode === 'latex' && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [latex, mode, masterResume, activeTailoredConfigId, tailoredConfigs]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleCompile = useCallback(async () => {
    setCompiling(true);
    setCompileError(null);

    try {
      const result = await compileToPdf(latex);
      if (result.success && result.pdfBlob) {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        const url = URL.createObjectURL(result.pdfBlob);
        setPdfUrl(url);
        setLastCompiledLatex(latex);
      } else {
        setCompileError(result.errorLog || 'Compilation failed.');
      }
    } catch (err) {
      setCompileError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setCompiling(false);
    }
  }, [latex, pdfUrl]);

  // Auto-compile on first mount in PDF mode
  useEffect(() => {
    if (mode === 'pdf' && !pdfUrl && !compiling && !compileError) {
      handleCompile();
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = latex;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant={mode === 'pdf' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('pdf')}
            className="gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            PDF Preview
          </Button>
          <Button
            variant={mode === 'latex' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('latex')}
            className="gap-1.5"
          >
            <Code className="h-3.5 w-3.5" />
            LaTeX Code
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'pdf' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompile}
              disabled={compiling}
              className="gap-1.5"
            >
              {compiling ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  {hasChanges ? 'Recompile' : 'Refresh'}
                </>
              )}
            </Button>
          )}
          {mode === 'latex' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'latex' && (
          <div className="h-full overflow-auto bg-[#1e1e1e] p-4">
            <pre className="text-sm leading-relaxed">
              <code ref={codeRef} className="language-latex">
                {latex}
              </code>
            </pre>
          </div>
        )}

        {mode === 'pdf' && (
          <div className="flex h-full flex-col">
            {hasChanges && pdfUrl && !compiling && (
              <div className="flex items-center gap-2 border-b border-border bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Resume has changed since last compile. Click &quot;Recompile&quot; to update the PDF.
              </div>
            )}

            {compiling && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Compiling LaTeX to PDF...</p>
              </div>
            )}

            {compileError && !compiling && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm font-medium text-destructive">Compilation Failed</p>
                <pre className="max-h-60 max-w-full overflow-auto rounded-md bg-muted p-4 text-xs text-muted-foreground">
                  {compileError}
                </pre>
                <Button variant="outline" size="sm" onClick={handleCompile} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            )}

            {pdfUrl && !compiling && !compileError && (
              <iframe
                src={pdfUrl}
                className="h-full w-full flex-1 border-0"
                title="PDF Preview"
              />
            )}

            {!pdfUrl && !compiling && !compileError && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
                <FileText className="h-8 w-8" />
                <p className="text-sm">Click compile to generate PDF preview</p>
                <Button variant="outline" size="sm" onClick={handleCompile} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Compile
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
