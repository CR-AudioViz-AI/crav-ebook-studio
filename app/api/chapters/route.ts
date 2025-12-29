import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/db/supabase";
import { Chapter, ApiResponse } from "@/types";

// POST /api/chapters - Create chapters from blueprint
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const body = await request.json();
    const { book_id, chapters } = body as {
      book_id: string;
      chapters: {
        title: string;
        summary: string;
        target_word_count: number;
        sections?: { title: string; summary: string; target_word_count: number }[];
      }[];
    };

    // Verify user owns this book
    const { data: book, error: bookError } = await supabase
      .from("ebook_books")
      .select("id")
      .eq("id", book_id)
      .eq("user_id", user.id)
      .single();

    if (bookError || !book) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Book not found",
      }, { status: 404 });
    }

    // Create chapters
    const chaptersToInsert = chapters.map((chapter, index) => ({
      book_id,
      title: chapter.title,
      order_index: index,
      status: "outline",
      summary: chapter.summary,
      word_count: 0,
      media_placeholders: [],
      research_topics: [],
      ai_suggestions: chapter.sections || [],
    }));

    const { data: createdChapters, error: insertError } = await supabase
      .from("ebook_chapters")
      .insert(chaptersToInsert)
      .select();

    if (insertError) {
      console.error("Error creating chapters:", insertError);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Failed to create chapters",
      }, { status: 500 });
    }

    // Update book status to outline
    await supabase
      .from("ebook_books")
      .update({ status: "outline" })
      .eq("id", book_id);

    return NextResponse.json<ApiResponse<Chapter[]>>({
      success: true,
      data: createdChapters as Chapter[],
      message: `${createdChapters.length} chapters created successfully`,
    }, { status: 201 });
  } catch (error) {
    console.error("Create chapters error:", error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}
