export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Cellphone
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your Next.js app is ready.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
          Start building in <code className="text-slate-200">src/app</code> with
          TypeScript, the App Router, and Tailwind CSS.
        </p>
      </section>
    </main>
  );
}
