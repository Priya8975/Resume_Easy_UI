import { useState } from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResumeStore } from '@/hooks/useResumeStore';
import { matchResumeToJob, suggestionsToOverrides } from '@/lib/ai/matcher';
import type { AiMatchResult } from '@/types/ai';

export default function JobDescriptionPanel() {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AiMatchResult[]>([]);
  const [summary, setSummary] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const settings = useResumeStore((s) => s.settings);
  const activeTailoredConfigId = useResumeStore((s) => s.activeTailoredConfigId);
  const getEffectiveResume = useResumeStore((s) => s.getEffectiveResume);
  const applyOverrides = useResumeStore((s) => s.applyOverrides);

  async function handleAnalyze() {
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    if (!settings.openaiApiKey) {
      setError('Please set your OpenAI API key in the settings above.');
      return;
    }

    setError('');
    setLoading(true);
    setResults([]);
    setSummary('');

    try {
      const resume = getEffectiveResume();
      const response = await matchResumeToJob(
        resume,
        jobDescription,
        settings.openaiApiKey,
        settings.openaiModel,
      );

      setResults(response.results);
      setSummary(response.summary);

      // Pre-select all suggestions
      const allIds = new Set(response.results.map((r) => r.entryId));
      setSelectedIds(allIds);
    } catch (err) {
      setError(
        `Analysis failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleSelection(entryId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  }

  function handleApply() {
    if (!activeTailoredConfigId) {
      setError(
        'Please select a tailored resume config from the sidebar to apply suggestions.',
      );
      return;
    }

    const selectedResults = results.filter((r) => selectedIds.has(r.entryId));
    const overrides = suggestionsToOverrides(selectedResults);
    applyOverrides(activeTailoredConfigId, overrides);
    setError('');
  }

  function getScoreBadgeVariant(score: number) {
    if (score >= 0.7) return 'success' as const;
    if (score >= 0.4) return 'warning' as const;
    return 'destructive' as const;
  }

  return (
    <div className="space-y-4">
      {/* Job description input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Job Description
        </label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="min-h-[160px]"
        />
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze &amp; Suggest
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Summary */}
      {summary && (
        <Card>
          <CardContent className="p-3">
            <p className="text-sm text-foreground">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Suggestions ({results.length})
          </h4>

          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2 pr-3">
              {results.map((result) => (
                <Card key={result.entryId} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(result.entryId)}
                        onChange={() => toggleSelection(result.entryId)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getScoreBadgeVariant(result.relevanceScore)}
                          >
                            {Math.round(result.relevanceScore * 100)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.suggestedEnabled ? 'Include' : 'Exclude'}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{result.reason}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          ID: {result.entryId}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Button
            variant="secondary"
            onClick={handleApply}
            className="w-full"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Apply Selected Suggestions
          </Button>
        </div>
      )}
    </div>
  );
}
