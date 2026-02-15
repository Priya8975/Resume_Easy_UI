export function buildSystemPrompt(): string {
  return `You are a resume optimization assistant. Given a job description and a list of resume entries, determine which entries and bullet points are most relevant to the job.

Your response MUST be valid JSON with this exact structure:
{
  "suggestions": [
    {
      "id": "<entry or bullet ID>",
      "relevanceScore": <number between 0.0 and 1.0>,
      "reason": "<one sentence explaining relevance>",
      "suggestedEnabled": <true or false>
    }
  ],
  "summary": "<2-3 sentence overview of which sections to prioritize>"
}

Scoring rules:
- 0.8-1.0: Directly relevant to the job requirements. Set suggestedEnabled=true.
- 0.5-0.79: Somewhat relevant, include if space allows. Set suggestedEnabled=true.
- 0.2-0.49: Tangentially related. Set suggestedEnabled=false for a 1-page resume.
- 0.0-0.19: Not relevant. Set suggestedEnabled=false.

Consider: skill match, industry relevance, seniority alignment, keyword overlap.
For a 1-page resume, aim to suggest enabling approximately 60-70% of entries.
Always include education entries.`;
}

export function buildUserPrompt(
  jobDescription: string,
  entries: Array<{
    id: string;
    type: string;
    summary: string;
    bullets: Array<{ id: string; text: string }>;
  }>
): string {
  const entriesText = entries
    .map((e) => {
      const bulletsList = e.bullets
        .map((b) => `    - [${b.id}] ${b.text}`)
        .join('\n');
      return `  [${e.id}] (${e.type}) ${e.summary}\n${bulletsList}`;
    })
    .join('\n\n');

  return `## Job Description
${jobDescription}

## Resume Entries
${entriesText}

Analyze each entry and bullet point for relevance to this specific job. Return your analysis as JSON.`;
}
