// Book Types
export interface Book {
  id: string;
  user_id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: BookStatus;
  book_type: BookType;
  target_audience?: string;
  target_word_count: number;
  current_word_count: number;
  voice_profile?: VoiceProfile;
  settings: BookSettings;
  created_at: string;
  updated_at: string;
}

export type BookStatus = 'interview' | 'outline' | 'writing' | 'editing' | 'review' | 'published';
export type BookType = 'fiction' | 'nonfiction' | 'guide' | 'memoir' | 'academic' | 'children' | 'other';

export interface VoiceProfile {
  tone: 'formal' | 'casual' | 'academic' | 'conversational' | 'inspirational';
  style: string[];
  vocabulary_level: 'simple' | 'moderate' | 'advanced' | 'technical';
  sample_text?: string;
}

export interface BookSettings {
  citation_style: CitationStyle;
  include_toc: boolean;
  include_index: boolean;
  chapter_numbering: boolean;
  include_images: boolean;
  include_audio: boolean;
}

export type CitationStyle = 'apa' | 'mla' | 'chicago_notes' | 'chicago_author' | 'harvard' | 'ieee' | 'vancouver';

// Chapter Types
export interface Chapter {
  id: string;
  book_id: string;
  title: string;
  order_index: number;
  status: ChapterStatus;
  content: string;
  word_count: number;
  media_placeholders: MediaPlaceholder[];
  research_topics: string[];
  created_at: string;
  updated_at: string;
}

export type ChapterStatus = 'outline' | 'draft' | 'review' | 'complete';

export interface MediaPlaceholder {
  id: string;
  type: 'image' | 'chart' | 'diagram' | 'video';
  description: string;
  position: number;
  resolved?: boolean;
  asset_id?: string;
}

// Section Types
export interface Section {
  id: string;
  chapter_id: string;
  title: string;
  order_index: number;
  content: string;
  word_count: number;
  created_at: string;
}

// Citation Types
export interface Citation {
  id: string;
  book_id: string;
  source_type: SourceType;
  title: string;
  authors: Author[];
  url?: string;
  publication_date?: string;
  accessed_date: string;
  credibility_score: number;
  raw_data: Record<string, unknown>;
  created_at: string;
}

export type SourceType = 'web' | 'book' | 'journal' | 'newspaper' | 'interview' | 'video' | 'podcast' | 'other';

export interface Author {
  first_name: string;
  last_name: string;
  middle_name?: string;
}

// Media Types
export interface MediaAsset {
  id: string;
  book_id: string;
  chapter_id?: string;
  asset_type: AssetType;
  source: MediaSource;
  url: string;
  alt_text: string;
  caption?: string;
  metadata: MediaMetadata;
  created_at: string;
}

export type AssetType = 'image' | 'audio' | 'video' | 'chart' | 'diagram';
export type MediaSource = 'pixabay' | 'pexels' | 'unsplash' | 'stability' | 'upload' | 'generated';

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  file_size?: number;
  mime_type?: string;
  attribution?: string;
}

// Export Types
export interface Export {
  id: string;
  book_id: string;
  format: ExportFormat;
  status: ExportStatus;
  file_url?: string;
  settings: ExportSettings;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export type ExportFormat = 'epub' | 'pdf' | 'pdf_print' | 'audiobook' | 'html' | 'kdp' | 'ingram';
export type ExportStatus = 'queued' | 'processing' | 'complete' | 'failed';

export interface ExportSettings {
  include_cover: boolean;
  include_toc: boolean;
  page_size?: 'letter' | 'a4' | '6x9' | '5x8';
  font_size?: number;
  voice_id?: string;
}

// Interview Types
export interface InterviewResponse {
  question_id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface BookBlueprint {
  title: string;
  subtitle_options: string[];
  description: string;
  target_audience: string;
  book_type: BookType;
  target_word_count: number;
  tone: string;
  chapters: ChapterOutline[];
  research_needs: string[];
  media_requirements: string[];
  estimated_credits: number;
}

export interface ChapterOutline {
  title: string;
  summary: string;
  target_word_count: number;
  sections: SectionOutline[];
}

export interface SectionOutline {
  title: string;
  summary: string;
  target_word_count: number;
}

// Quality Types
export interface QualityReport {
  book_id: string;
  overall_score: number;
  plagiarism: PlagiarismResult;
  grammar: GrammarResult;
  readability: ReadabilityResult;
  accessibility: AccessibilityResult;
  created_at: string;
}

export interface PlagiarismResult {
  score: number;
  matches: PlagiarismMatch[];
}

export interface PlagiarismMatch {
  text: string;
  source_url: string;
  similarity: number;
}

export interface GrammarResult {
  score: number;
  issues: GrammarIssue[];
}

export interface GrammarIssue {
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
  text: string;
  suggestion: string;
  position: { start: number; end: number };
}

export interface ReadabilityResult {
  flesch_kincaid_grade: number;
  flesch_reading_ease: number;
  gunning_fog: number;
  smog_index: number;
  avg_sentence_length: number;
  avg_word_length: number;
}

export interface AccessibilityResult {
  score: number;
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  type: 'alt_text' | 'heading_structure' | 'color_contrast' | 'table_headers';
  description: string;
  location: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier: SubscriptionTier;
  credits_balance: number;
  created_at: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'business' | 'enterprise';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
