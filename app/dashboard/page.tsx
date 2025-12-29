import Link from "next/link";
import { BookOpen, Plus, Clock, FileText, Sparkles, MoreHorizontal } from "lucide-react";

// Mock data - will be replaced with real data from Supabase
const mockBooks = [
  {
    id: "1",
    title: "The Art of AI Writing",
    status: "writing",
    progress: 65,
    wordCount: 32500,
    targetWordCount: 50000,
    updatedAt: "2025-12-28T20:00:00Z",
    coverColor: "from-blue-500 to-purple-600",
  },
  {
    id: "2",
    title: "Mastering Modern Marketing",
    status: "editing",
    progress: 90,
    wordCount: 45000,
    targetWordCount: 50000,
    updatedAt: "2025-12-27T15:30:00Z",
    coverColor: "from-orange-500 to-red-600",
  },
  {
    id: "3",
    title: "Financial Freedom Guide",
    status: "outline",
    progress: 20,
    wordCount: 5000,
    targetWordCount: 30000,
    updatedAt: "2025-12-26T10:00:00Z",
    coverColor: "from-green-500 to-teal-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            CRAV eBook Studio
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Credits: <strong className="text-foreground">1,250</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium">RH</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Books</h1>
            <p className="text-muted-foreground">Create, edit, and publish your books</p>
          </div>
          <Link
            href="/interview"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Book
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<BookOpen />} label="Total Books" value="3" />
          <StatCard icon={<FileText />} label="Total Words" value="82.5K" />
          <StatCard icon={<Clock />} label="Reading Time" value="6.8 hrs" />
          <StatCard icon={<Sparkles />} label="AI Credits Used" value="750" />
        </div>

        {/* Books Grid */}
        {mockBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your first book with our AI-powered interview process
            </p>
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Your First Book
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background rounded-xl border p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: typeof mockBooks[0] }) {
  const statusColors = {
    interview: "bg-yellow-500",
    outline: "bg-blue-500",
    writing: "bg-purple-500",
    editing: "bg-orange-500",
    review: "bg-pink-500",
    published: "bg-green-500",
  };

  const statusLabels = {
    interview: "Interview",
    outline: "Outline",
    writing: "Writing",
    editing: "Editing",
    review: "Review",
    published: "Published",
  };

  return (
    <Link href={`/books/${book.id}`} className="group">
      <div className="bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-all hover:border-primary/50">
        {/* Cover */}
        <div className={`h-32 bg-gradient-to-br ${book.coverColor} relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-white/50" />
          </div>
          <div className="absolute top-3 right-3">
            <button className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-2 h-2 rounded-full ${
                statusColors[book.status as keyof typeof statusColors]
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {statusLabels[book.status as keyof typeof statusLabels]}
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {book.title}
          </h3>
          
          {/* Progress */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{book.wordCount.toLocaleString()} words</span>
              <span>{book.progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Updated {new Date(book.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
