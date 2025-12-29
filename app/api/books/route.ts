import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/db/supabase";
import { Book, ApiResponse, BookStatus, BookType } from "@/types";

// GET /api/books - List all books for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Get user from auth header or session
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookStatus | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("ebook_books")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: books, error, count } = await query;

    if (error) {
      console.error("Error fetching books:", error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Failed to fetch books",
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<{ books: Book[]; total: number }>>({
      success: true,
      data: {
        books: books as Book[],
        total: count || books.length,
      },
    });
  } catch (error) {
    console.error("Books API error:", error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

// POST /api/books - Create a new book
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
    
    const {
      title,
      subtitle,
      description,
      book_type = "nonfiction" as BookType,
      target_audience,
      target_word_count = 50000,
      voice_profile = {},
      settings = {},
      interview_responses = [],
      blueprint = null,
    } = body;

    if (!title) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Title is required",
      }, { status: 400 });
    }

    const { data: book, error } = await supabase
      .from("ebook_books")
      .insert({
        user_id: user.id,
        title,
        subtitle,
        description,
        book_type,
        target_audience,
        target_word_count,
        voice_profile,
        settings: {
          citation_style: "apa",
          include_toc: true,
          include_index: false,
          chapter_numbering: true,
          include_images: true,
          include_audio: false,
          ...settings,
        },
        interview_responses,
        blueprint,
        status: blueprint ? "outline" : "interview",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating book:", error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Failed to create book",
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<Book>>({
      success: true,
      data: book as Book,
      message: "Book created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Create book error:", error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}
