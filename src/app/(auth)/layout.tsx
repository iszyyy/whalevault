import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Back to home */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>←</span>
        <span className="text-xl">🐋</span>
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-bold text-transparent">
          WhaleVault
        </span>
      </Link>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
