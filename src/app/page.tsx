import { randomUUID } from "node:crypto";

import { QuizApp } from "@/components/quiz/quiz-app";
import { ThemeSwitch } from "@/components/theme/theme-switch";
import { getQuizBanks } from "@/lib/quiz/banks";
import { productCopy } from "@/lib/quiz/product-copy";

export default function Home() {
  const banks = getQuizBanks();
  const seed = randomUUID();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_28rem),linear-gradient(180deg,#fafafa,#f4f4f5)] px-4 py-6 text-zinc-950 transition-colors dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30rem),linear-gradient(180deg,#111827,#18181b)] dark:text-zinc-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-zinc-300 pb-6 dark:border-zinc-700 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              {productCopy.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              {productCopy.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              {productCopy.description}
            </p>
          </div>
          <div className="flex justify-end">
            <ThemeSwitch />
          </div>
        </header>

        <QuizApp banks={banks} seed={seed} />
      </div>
    </main>
  );
}
