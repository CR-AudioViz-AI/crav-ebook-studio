import Link from "next/link";
import { BookOpen, Sparkles, FileText, Headphones, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Publishing Platform
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Create <span className="text-primary">Masterpiece</span> Books
              <br />with AI Intelligence
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your ideas into professional, market-ready books. 
              Our AI conducts intelligent interviews, integrates rich media, 
              adds verified citations, and exports to any format.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/interview"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                Start Your Book
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Publish
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From first idea to final publication, CRAV eBook Studio guides you through every step.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-primary" />}
              title="AI Interview"
              description="Javari AI understands your vision through intelligent questioning before writing begins."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-primary" />}
              title="Smart Citations"
              description="Real-time research with verified sources. APA, MLA, Chicago, and more."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Rich Media"
              description="Stock images, AI illustrations, charts, and interactive elements."
            />
            <FeatureCard
              icon={<Headphones className="h-8 w-8 text-primary" />}
              title="Multi-Format"
              description="Export to ePub, PDF, audiobook, HTML, and print-on-demand."
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Journey to Publication
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <ProcessStep
                number="1"
                title="AI Interview"
                description="Answer questions about your book's topic, audience, tone, and goals. The AI creates a detailed blueprint."
              />
              <ProcessStep
                number="2"
                title="Outline & Structure"
                description="Review and refine your AI-generated outline. Drag, drop, and customize chapters."
              />
              <ProcessStep
                number="3"
                title="Intelligent Writing"
                description="AI writes chapter by chapter, matching your voice. Review and refine at each step."
              />
              <ProcessStep
                number="4"
                title="Enrich & Polish"
                description="Add images, citations, and media. Run quality checks for grammar and plagiarism."
              />
              <ProcessStep
                number="5"
                title="Export & Publish"
                description="Generate ePub, PDF, audiobook, or print-ready files. Publish anywhere."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Write Your Masterpiece?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of authors creating professional books with AI assistance.
          </p>
          <Link
            href="/interview"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground rounded-lg font-semibold text-lg hover:bg-background/90 transition-colors"
          >
            Start Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            <strong>CRAV eBook Studio</strong> by CR AudioViz AI, LLC
          </p>
          <p className="text-sm">
            "Your Story. Our Design. Everyone Connects. Everyone Wins."
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
