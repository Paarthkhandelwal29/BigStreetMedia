import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80dvh] items-center justify-center overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50% 60% at 50% 0%, rgba(255,193,7,0.2), transparent 70%)",
        }}
      />
      <div className="container-bsm relative z-10 flex flex-col items-center text-center">
        <span className="font-mono text-7xl font-bold text-amber md:text-8xl">404</span>
        <h1 className="mt-6 max-w-lg text-balance text-3xl font-bold text-white md:text-4xl">
          This page took a wrong turn.
        </h1>
        <p className="mt-4 max-w-md text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Go Home</ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
