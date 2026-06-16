import { randomUUID } from "node:crypto";

import { QuizApp } from "@/components/quiz/quiz-app";
import { getQuizBanks } from "@/lib/quiz/banks";
import { productCopy } from "@/lib/quiz/product-copy";

export default function Home() {
  const banks = getQuizBanks();
  const defaultBank = banks[0];
  const examTypeCount = new Set(banks.map((bank) => bank.examType)).size;
  const seed = randomUUID();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_28rem),linear-gradient(180deg,#fafafa,#f4f4f5)] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-zinc-300 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {productCopy.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
              {productCopy.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              {productCopy.description}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-zinc-300 bg-white p-2 text-center shadow-sm">
            <div className="px-3 py-2">
              <div className="text-2xl font-black">
                {defaultBank?.questions.length ?? 0}
              </div>
              <div className="text-xs text-zinc-500">題庫</div>
            </div>
            <div className="border-x border-zinc-200 px-3 py-2">
              <div className="text-2xl font-black">{banks.length}</div>
              <div className="text-xs text-zinc-500">題庫組</div>
            </div>
            <div className="px-3 py-2">
              <div className="text-2xl font-black">{examTypeCount}</div>
              <div className="text-xs text-zinc-500">考試類型</div>
            </div>
          </div>
        </header>

        <QuizApp banks={banks} seed={seed} />
      </div>
    </main>
  );
}
