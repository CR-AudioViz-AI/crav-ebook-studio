-- CRAV eBook Studio Database Schema
-- Created: December 28, 2025
-- Standard: The Henderson Standard - Fortune 50 Quality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'interview' CHECK (status IN ('interview', 'outline', 'writing', 'editing', 'review', 'published')),
  book_type VARCHAR(50) NOT NULL DEFAULT 'nonfiction' CHECK (book_type IN ('fiction', 'nonfiction', 'guide', 'memoir', 'academic', 'children', 'other')),
  target_audience TEXT,
  target_word_count INTEGER DEFAULT 50000,
  current_word_count INTEGER DEFAULT 0,
  voice_profile JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{
    "citation_style": "apa",
    "include_toc": true,
    "include_index": false,
    "chapter_numbering": true,
    "include_images": true,
    "include_audio": false
  }',
  interview_responses JSONB DEFAULT '[]',
  blueprint JSONB,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAPTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'outline' CHECK (status IN ('outline', 'draft', 'review', 'complete')),
  content TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  summary TEXT,
  media_placeholders JSONB DEFAULT '[]',
  research_topics JSONB DEFAULT '[]',
  ai_suggestions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTIONS TABLE (Sub-chapters)
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES ebook_chapters(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  content TEXT DEFAULT '',
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_citations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL DEFAULT 'web' CHECK (source_type IN ('web', 'book', 'journal', 'newspaper', 'interview', 'video', 'podcast', 'other')),
  title TEXT NOT NULL,
  authors JSONB DEFAULT '[]',
  url TEXT,
  publication_date DATE,
  accessed_date DATE DEFAULT CURRENT_DATE,
  publisher TEXT,
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  doi VARCHAR(255),
  isbn VARCHAR(50),
  credibility_score INTEGER DEFAULT 50 CHECK (credibility_score >= 0 AND credibility_score <= 100),
  raw_data JSONB DEFAULT '{}',
  formatted_citations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEDIA ASSETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES ebook_chapters(id) ON DELETE SET NULL,
  asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('image', 'audio', 'video', 'chart', 'diagram')),
  source VARCHAR(50) NOT NULL CHECK (source IN ('pixabay', 'pexels', 'unsplash', 'stability', 'upload', 'generated', 'elevenlabs')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  attribution TEXT,
  metadata JSONB DEFAULT '{}',
  position_in_chapter INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  format VARCHAR(50) NOT NULL CHECK (format IN ('epub', 'pdf', 'pdf_print', 'audiobook', 'html', 'kdp', 'ingram', 'docx')),
  status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'complete', 'failed')),
  file_url TEXT,
  file_size INTEGER,
  settings JSONB DEFAULT '{}',
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- QUALITY REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_quality_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  plagiarism_result JSONB DEFAULT '{}',
  grammar_result JSONB DEFAULT '{}',
  readability_result JSONB DEFAULT '{}',
  accessibility_result JSONB DEFAULT '{}',
  issues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COLLABORATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('author', 'editor', 'reviewer', 'viewer')),
  permissions JSONB DEFAULT '{}',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(book_id, user_id)
);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES ebook_chapters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_ref JSONB,
  comment_text TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  parent_id UUID REFERENCES ebook_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VERSIONS TABLE (for change tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES ebook_chapters(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_snapshot TEXT,
  change_summary TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI GENERATION LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ebook_ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES ebook_books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES ebook_chapters(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  prompt TEXT,
  response TEXT,
  model VARCHAR(100),
  tokens_used INTEGER,
  credits_charged INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_ebook_books_user ON ebook_books(user_id);
CREATE INDEX idx_ebook_books_status ON ebook_books(status);
CREATE INDEX idx_ebook_chapters_book ON ebook_chapters(book_id);
CREATE INDEX idx_ebook_chapters_order ON ebook_chapters(book_id, order_index);
CREATE INDEX idx_ebook_sections_chapter ON ebook_sections(chapter_id);
CREATE INDEX idx_ebook_citations_book ON ebook_citations(book_id);
CREATE INDEX idx_ebook_media_book ON ebook_media_assets(book_id);
CREATE INDEX idx_ebook_exports_book ON ebook_exports(book_id);
CREATE INDEX idx_ebook_comments_book ON ebook_comments(book_id);
CREATE INDEX idx_ebook_versions_book ON ebook_versions(book_id);
CREATE INDEX idx_ebook_ai_logs_book ON ebook_ai_logs(book_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ebook_books_updated_at
  BEFORE UPDATE ON ebook_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ebook_chapters_updated_at
  BEFORE UPDATE ON ebook_chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ebook_sections_updated_at
  BEFORE UPDATE ON ebook_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ebook_comments_updated_at
  BEFORE UPDATE ON ebook_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER TO UPDATE BOOK WORD COUNT
-- ============================================
CREATE OR REPLACE FUNCTION update_book_word_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ebook_books
  SET current_word_count = (
    SELECT COALESCE(SUM(word_count), 0)
    FROM ebook_chapters
    WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
  )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_book_word_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ebook_chapters
  FOR EACH ROW EXECUTE FUNCTION update_book_word_count();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE ebook_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_ai_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for books
CREATE POLICY "Users can view own books" ON ebook_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own books" ON ebook_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books" ON ebook_books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books" ON ebook_books
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chapters (via book ownership)
CREATE POLICY "Users can view chapters of own books" ON ebook_chapters
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create chapters in own books" ON ebook_chapters
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update chapters in own books" ON ebook_chapters
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete chapters in own books" ON ebook_chapters
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

-- Similar policies for other tables
CREATE POLICY "Users can manage sections" ON ebook_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ebook_chapters c
      JOIN ebook_books b ON c.book_id = b.id
      WHERE c.id = chapter_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage citations" ON ebook_citations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can manage media" ON ebook_media_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view exports" ON ebook_exports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view quality reports" ON ebook_quality_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view collaborations" ON ebook_collaborators
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can manage comments" ON ebook_comments
  FOR ALL USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view versions" ON ebook_versions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can view ai logs" ON ebook_ai_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM ebook_books WHERE id = book_id AND user_id = auth.uid())
  );

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
