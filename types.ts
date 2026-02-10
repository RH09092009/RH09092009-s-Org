
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface VideoAnalysis {
  summary: string;
  keyPoints: string[];
  context: string;
  sources: GroundingSource[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: VideoAnalysis | null;
}
