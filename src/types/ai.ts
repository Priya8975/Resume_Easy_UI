export interface AiMatchResult {
  entryId: string;
  relevanceScore: number;
  reason: string;
  suggestedEnabled: boolean;
}

export interface AiMatchResponse {
  results: AiMatchResult[];
  summary: string;
  tokensUsed: number;
}
