import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <p className="text-lg text-on-surface-variant mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary no-underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
