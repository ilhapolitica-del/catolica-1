export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: WebSource;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingMetadata?: GroundingMetadata;
  isError?: boolean;
}

export interface SearchRequest {
  query: string;
}
