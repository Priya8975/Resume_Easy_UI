import type { AiMatchResult, AiMatchResponse } from '@/types/ai';
import type { ResumeData, ExperienceData, ProjectData, EducationData, SkillsData, AchievementData } from '@/types/resume';
import { callOpenAI } from './openai-client';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

function getEntrySummary(data: ExperienceData | ProjectData | EducationData | SkillsData | AchievementData): string {
  switch (data.type) {
    case 'experience':
      return `${data.company} - ${data.title} (${data.startDate} - ${data.endDate})`;
    case 'projects':
      return `${data.name}`;
    case 'education':
      return `${data.institution} - ${data.degree} in ${data.field}`;
    case 'skills':
      return `${data.category}: ${data.items}`;
    case 'achievements':
      return data.description;
  }
}

/** Strip LaTeX commands for cleaner AI input */
function stripLatex(text: string): string {
  return text
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/\\textit\{([^}]*)\}/g, '$1')
    .replace(/\\underline\{([^}]*)\}/g, '$1')
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\\&/g, '&')
    .replace(/\\%/g, '%');
}

export async function matchResumeToJob(
  resume: ResumeData,
  jobDescription: string,
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<AiMatchResponse> {
  const entries = resume.sections.flatMap((section) =>
    section.entries.map((entry) => ({
      id: entry.id,
      type: section.type,
      summary: stripLatex(getEntrySummary(entry.data)),
      bullets: entry.bulletPoints.map((b) => ({
        id: b.id,
        text: stripLatex(b.text),
      })),
    }))
  );

  const validIds = new Set<string>();
  for (const e of entries) {
    validIds.add(e.id);
    for (const b of e.bullets) {
      validIds.add(b.id);
    }
  }

  const { content, tokensUsed } = await callOpenAI(
    apiKey,
    buildSystemPrompt(),
    buildUserPrompt(jobDescription, entries),
    model
  );

  const parsed = JSON.parse(content);

  const results: AiMatchResult[] = (parsed.suggestions || [])
    .filter((s: Record<string, unknown>) => validIds.has(s.id as string))
    .map((s: Record<string, unknown>) => ({
      entryId: String(s.id),
      relevanceScore: Math.max(0, Math.min(1, Number(s.relevanceScore))),
      reason: String(s.reason),
      suggestedEnabled: Boolean(s.suggestedEnabled),
    }));

  return {
    results,
    summary: String(parsed.summary || ''),
    tokensUsed,
  };
}

export function suggestionsToOverrides(
  results: AiMatchResult[]
): Record<string, boolean> {
  const overrides: Record<string, boolean> = {};
  for (const r of results) {
    overrides[r.entryId] = r.suggestedEnabled;
  }
  return overrides;
}
