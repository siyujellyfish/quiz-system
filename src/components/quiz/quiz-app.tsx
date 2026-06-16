"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Layers3,
  XCircle,
} from "lucide-react";

import {
  answerPracticeQuestion,
  createPracticeRound,
  createSeededRandom,
} from "@/lib/quiz/practice";
import type {
  PracticeAnswerResult,
  PracticeQuestion,
} from "@/lib/quiz/practice";
import {
  calculatePracticeStats,
  type PracticeStats,
} from "@/lib/quiz/practice-stats";
import {
  clearMistakes,
  getMistakeServerSnapshot,
  getMistakeSnapshot,
  syncMistakeForAnswer,
  subscribeToMistakeChanges,
} from "@/lib/quiz/mistakes";
import { createExam, scoreExam } from "@/lib/quiz/exam";
import type { ExamAnswers, ExamResult } from "@/lib/quiz/exam";
import type { QuizBank, QuizQuestion } from "@/lib/quiz/types";
import {
  getSelectedBankId,
  setSelectedBankId,
  type QuizMode,
} from "@/lib/quiz/bank-selection";
import { Button } from "@/components/ui/button";
import {
  examPanelClassName,
  examSidebarClassName,
} from "@/components/quiz/exam-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type QuizAppProps = {
  banks: QuizBank[];
  seed: string;
};

const bankSelectionChangeEvent = "csa-bank-selection-change";
const emptyQuestions: QuizQuestion[] = [];

const modeLabels: Record<QuizMode, string> = {
  practice: "練習模式",
  mistakes: "錯題模式",
  exam: "模擬測驗",
};

export function QuizApp({ banks, seed }: QuizAppProps) {
  const defaultBankId = banks[0]?.id ?? "";
  const availableBankIds = useMemo(() => banks.map((bank) => bank.id), [banks]);
  const [activeMode, setActiveMode] = useState<QuizMode>("practice");
  const selectedPracticeBankId = useStoredSelectedBankId(
    "practice",
    availableBankIds,
    defaultBankId,
  );
  const selectedMistakeBankId = useStoredSelectedBankId(
    "mistakes",
    availableBankIds,
    defaultBankId,
  );
  const selectedExamBankId = useStoredSelectedBankId(
    "exam",
    availableBankIds,
    defaultBankId,
  );
  const [roundKey, setRoundKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerResult, setAnswerResult] =
    useState<PracticeAnswerResult | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<
    PracticeAnswerResult[]
  >([]);
  const [mistakeRoundKey, setMistakeRoundKey] = useState(0);
  const [mistakeIndex, setMistakeIndex] = useState(0);
  const [mistakeAnswerResult, setMistakeAnswerResult] =
    useState<PracticeAnswerResult | null>(null);
  const [examKey, setExamKey] = useState(0);
  const [examAnswers, setExamAnswers] = useState<ExamAnswers>({});
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const mistakeIds = useSyncExternalStore(
    subscribeToMistakeChanges,
    getMistakeSnapshot,
    getMistakeServerSnapshot,
  );

  const selectedBankIds: Record<QuizMode, string> = {
    practice: selectedPracticeBankId,
    mistakes: selectedMistakeBankId,
    exam: selectedExamBankId,
  };
  const practiceBank = getBankForMode(banks, selectedPracticeBankId);
  const mistakeBank = getBankForMode(banks, selectedMistakeBankId);
  const examBank = getBankForMode(banks, selectedExamBankId);
  const activeBank = getBankForMode(banks, selectedBankIds[activeMode]);
  const practiceQuestions = practiceBank?.questions ?? emptyQuestions;
  const mistakeSourceQuestions = mistakeBank?.questions ?? emptyQuestions;
  const examSourceQuestions = examBank?.questions ?? emptyQuestions;

  const round = useMemo(() => {
    return createPracticeRound(
      practiceQuestions,
      createSeededRandom(`${seed}:practice:${roundKey}`),
    );
  }, [practiceQuestions, roundKey, seed]);
  const currentQuestion = round[currentIndex];
  const answeredCount = answerResult ? currentIndex + 1 : currentIndex;
  const progress =
    round.length === 0 ? 0 : Math.round((answeredCount / round.length) * 100);
  const practiceStats = useMemo(
    () => calculatePracticeStats(practiceAnswers, round.length),
    [practiceAnswers, round.length],
  );
  const mistakeQuestions = useMemo(
    () =>
      mistakeSourceQuestions.filter((question) =>
        mistakeIds.includes(question.id),
      ),
    [mistakeSourceQuestions, mistakeIds],
  );
  const mistakeRound = useMemo(() => {
    return createPracticeRound(
      mistakeQuestions,
      createSeededRandom(`${seed}:mistakes:${mistakeRoundKey}`),
    );
  }, [mistakeQuestions, mistakeRoundKey, seed]);
  const safeMistakeIndex =
    mistakeRound.length === 0
      ? 0
      : Math.min(mistakeIndex, mistakeRound.length - 1);
  const currentMistakeQuestion = mistakeRound[safeMistakeIndex];
  const examQuestions = useMemo(() => {
    return createExam(
      examSourceQuestions,
      createSeededRandom(`${seed}:exam:${examKey}`),
    );
  }, [examSourceQuestions, examKey, seed]);
  const mistakeProgress =
    mistakeRound.length === 0
      ? 0
      : Math.round(
          ((mistakeAnswerResult ? safeMistakeIndex + 1 : safeMistakeIndex) /
            mistakeRound.length) *
            100,
        );

  function selectBank(mode: QuizMode, currentBankId: string, bankId: string) {
    if (currentBankId === bankId) {
      return;
    }

    setSelectedBankId(window.localStorage, mode, bankId);
    window.dispatchEvent(new Event(bankSelectionChangeEvent));
    resetMode(mode);
  }

  function resetMode(mode: QuizMode) {
    if (mode === "practice") {
      resetPractice();
      return;
    }

    if (mode === "mistakes") {
      setMistakeRoundKey((value) => value + 1);
      setMistakeIndex(0);
      setMistakeAnswerResult(null);
      return;
    }

    resetExam();
  }

  function resetPractice() {
    setRoundKey((value) => value + 1);
    setCurrentIndex(0);
    setAnswerResult(null);
    setPracticeAnswers([]);
  }

  function submitAnswer(question: PracticeQuestion, optionId: string) {
    if (answerResult) {
      return;
    }

    const result = answerPracticeQuestion(question, optionId);
    setAnswerResult(result);
    setPracticeAnswers((answers) => [...answers, result]);
    syncMistakeForAnswer(window.localStorage, {
      questionId: result.questionId,
      isCorrect: result.isCorrect,
    });
  }

  function goNext() {
    setAnswerResult(null);
    setCurrentIndex((value) => value + 1);
  }

  function resetMistakes() {
    clearMistakes(window.localStorage);
    setMistakeRoundKey((value) => value + 1);
    setMistakeIndex(0);
    setMistakeAnswerResult(null);
  }

  function submitMistakeAnswer(question: PracticeQuestion, optionId: string) {
    if (mistakeAnswerResult) {
      return;
    }

    setMistakeAnswerResult(answerPracticeQuestion(question, optionId));
  }

  function goNextMistake() {
    if (mistakeAnswerResult) {
      syncMistakeForAnswer(window.localStorage, {
        questionId: mistakeAnswerResult.questionId,
        isCorrect: mistakeAnswerResult.isCorrect,
      });

      if (!mistakeAnswerResult.isCorrect) {
        setMistakeIndex((value) => value + 1);
      }
    }

    setMistakeAnswerResult(null);
  }

  function resetExam() {
    setExamKey((value) => value + 1);
    setExamAnswers({});
    setExamResult(null);
  }

  function submitExam() {
    setExamResult(scoreExam(examQuestions, examAnswers));
  }

  return (
    <Tabs
      value={activeMode}
      onValueChange={(value) => setActiveMode(value as QuizMode)}
      className="w-full"
    >
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-300 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 lg:flex-row lg:items-center lg:justify-between">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:w-fit sm:grid-cols-3">
          <TabsTrigger value="practice">練習模式</TabsTrigger>
          <TabsTrigger value="mistakes">錯題模式</TabsTrigger>
          <TabsTrigger value="exam">模擬測驗</TabsTrigger>
        </TabsList>

        <BankSwitcher
          banks={banks}
          mode={activeMode}
          selectedBank={activeBank}
          onChange={(bankId) =>
            selectBank(activeMode, selectedBankIds[activeMode], bankId)
          }
        />
      </div>

      <TabsContent value="practice">
        <PracticePanel
          currentIndex={currentIndex}
          progress={progress}
          question={currentQuestion}
          result={answerResult}
          stats={practiceStats}
          total={round.length}
          onAnswer={submitAnswer}
          onNext={goNext}
          onReset={resetPractice}
        />
      </TabsContent>

      <TabsContent value="mistakes">
        <PracticePanel
          currentIndex={safeMistakeIndex}
          emptyActionLabel="清除錯題"
          emptyDescription="目前沒有錯題。練習模式答錯後會自動加入這裡，重新整理後仍會保留。"
          emptyTitle="目前沒有錯題"
          modeDescription="只顯示目前 localStorage 中的錯題；答對後離開此題會移除紀錄。"
          modeTitle="錯題模式"
          progress={mistakeProgress}
          question={currentMistakeQuestion}
          result={mistakeAnswerResult}
          resetLabel="清除錯題"
          total={mistakeRound.length}
          waitingLabel="請先作答"
          onAnswer={submitMistakeAnswer}
          onNext={goNextMistake}
          onReset={resetMistakes}
        />
      </TabsContent>

      <TabsContent value="exam">
        <ExamPanel
          answers={examAnswers}
          questions={examQuestions}
          result={examResult}
          onAnswer={(questionId, optionId) =>
            setExamAnswers((value) => ({ ...value, [questionId]: optionId }))
          }
          onReset={resetExam}
          onSubmit={submitExam}
        />
      </TabsContent>
    </Tabs>
  );
}

function getBankForMode(
  banks: QuizBank[],
  selectedBankId: string,
): QuizBank | undefined {
  return banks.find((bank) => bank.id === selectedBankId) ?? banks[0];
}

function useStoredSelectedBankId(
  mode: QuizMode,
  availableBankIds: string[],
  defaultBankId: string,
): string {
  return useSyncExternalStore(
    subscribeToBankSelectionChanges,
    () => {
      if (!defaultBankId) {
        return "";
      }

      return getSelectedBankId(
        window.localStorage,
        mode,
        availableBankIds,
        defaultBankId,
      );
    },
    () => defaultBankId,
  );
}

function subscribeToBankSelectionChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(bankSelectionChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(bankSelectionChangeEvent, onStoreChange);
  };
}

function BankSwitcher({
  banks,
  mode,
  selectedBank,
  onChange,
}: {
  banks: QuizBank[];
  mode: QuizMode;
  selectedBank: QuizBank | undefined;
  onChange: (bankId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-md bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <Layers3 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {modeLabels[mode]}題庫
          </p>
          <p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {selectedBank
              ? `${selectedBank.examType} / ${selectedBank.questions.length} 題`
              : "尚無題庫"}
          </p>
        </div>
      </div>

      <label className="sr-only" htmlFor="quiz-bank">
        選擇題庫
      </label>
      <div className="relative min-w-0 sm:w-72">
        <select
          id="quiz-bank"
          className="h-10 w-full appearance-none rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-sm font-semibold text-zinc-950 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          disabled={banks.length === 0}
          value={selectedBank?.id ?? ""}
          onChange={(event) => onChange(event.target.value)}
        >
          {banks.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.examType} - {bank.title}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
      </div>
    </div>
  );
}

function ExamPanel({
  answers,
  questions,
  result,
  onAnswer,
  onReset,
  onSubmit,
}: {
  answers: ExamAnswers;
  questions: QuizQuestion[];
  result: ExamResult | null;
  onAnswer: (questionId: string, optionId: string) => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;
  const wrongQuestionIds = new Set(
    result?.wrongAnswers.map((answer) => answer.questionId) ?? [],
  );

  return (
    <Card className={examPanelClassName}>
      <CardHeader className="rounded-t-lg border-b border-zinc-200 bg-zinc-950 text-white dark:border-zinc-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ClipboardCheck className="h-6 w-6 text-emerald-300" />
              模擬測驗
            </CardTitle>
            <CardDescription className="mt-2 text-zinc-300">
              全部作答後提交，提交前不顯示正解與分數。
            </CardDescription>
          </div>
          <Button variant="secondary" onClick={onReset}>
            重置測驗
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_18rem]">
        <section className="grid gap-5">
          {questions.map((question, questionIndex) => {
            const selectedOptionId = answers[question.id];
            const isWrong = wrongQuestionIds.has(question.id);

            return (
              <div
                className={cn(
                  "rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950",
                  result &&
                    isWrong &&
                    "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30",
                )}
                key={question.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                    Question {questionIndex + 1}
                  </p>
                  {result && isWrong ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                      錯題
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-4 whitespace-pre-line text-base font-bold leading-7">
                  {question.prompt}
                </h2>
                <div className="mt-4 grid gap-2">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const showCorrect = result && option.isCorrect;
                    const showWrongSelection =
                      result && isSelected && !option.isCorrect;

                    return (
                      <button
                        className={cn(
                          "whitespace-pre-line rounded-md border border-zinc-300 bg-white px-4 py-3 text-left text-sm leading-6 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-400 dark:hover:bg-emerald-950/50",
                          isSelected &&
                            !result &&
                            "border-zinc-950 bg-zinc-100 font-semibold dark:border-zinc-300 dark:bg-zinc-800",
                          showCorrect &&
                            "border-emerald-600 bg-emerald-50 font-semibold text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100",
                          showWrongSelection &&
                            "border-red-500 bg-red-50 font-semibold text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100",
                        )}
                        disabled={Boolean(result)}
                        key={option.id}
                        onClick={() => onAnswer(question.id, option.id)}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        <aside className={examSidebarClassName}>
          <div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>作答進度</span>
              <span>
                {answeredCount} / {questions.length}
              </span>
            </div>
            <Progress
              className="mt-3"
              value={
                questions.length === 0
                  ? 0
                  : Math.round((answeredCount / questions.length) * 100)
              }
            />
          </div>

          {result ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
              <p className="text-sm font-semibold">測驗分數</p>
              <p className="mt-2 text-4xl font-black">
                {result.score}/{result.total}
              </p>
              <p className="mt-1 text-sm">{result.percentage}%</p>
              <p className="mt-4 text-sm leading-6">
                錯題數：{result.wrongAnswers.length}。正解已標示在題目選項中。
              </p>
            </div>
          ) : (
            <Button disabled={!isComplete} onClick={onSubmit}>
              提交測驗
            </Button>
          )}
        </aside>
      </CardContent>
    </Card>
  );
}

function PracticePanel({
  currentIndex,
  emptyActionLabel = "重新開始",
  emptyDescription = "這一輪題目已全部作答。可以重新洗牌開始下一輪。",
  emptyTitle = "本輪練習完成",
  modeDescription = "作答後立即判分。",
  modeTitle = "練習模式",
  progress,
  question,
  result,
  resetLabel = "重新洗牌",
  stats,
  total,
  waitingLabel = "請先選擇答案",
  onAnswer,
  onNext,
  onReset,
}: {
  currentIndex: number;
  emptyActionLabel?: string;
  emptyDescription?: string;
  emptyTitle?: string;
  modeDescription?: string;
  modeTitle?: string;
  progress: number;
  question: PracticeQuestion | undefined;
  result: PracticeAnswerResult | null;
  resetLabel?: string;
  stats?: PracticeStats;
  total: number;
  waitingLabel?: string;
  onAnswer: (question: PracticeQuestion, optionId: string) => void;
  onNext: () => void;
  onReset: () => void;
}) {
  if (!question) {
    return (
      <EmptyMode
        icon={<CheckCircle2 className="h-5 w-5" />}
        title={emptyTitle}
        description={emptyDescription}
      >
        <Button onClick={onReset}>{emptyActionLabel}</Button>
      </EmptyMode>
    );
  }

  const correctOption = question.options.find((option) => option.isCorrect);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-zinc-200 bg-zinc-950 text-white dark:border-zinc-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl">{modeTitle}</CardTitle>
            <CardDescription className="mt-2 text-zinc-300">
              第 {currentIndex + 1} / {total} 題，{modeDescription}
            </CardDescription>
          </div>
          <Button variant="secondary" onClick={onReset}>
            {resetLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_18rem]">
        <section>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Question {currentIndex + 1}
            </p>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              單選題
            </span>
          </div>
          <h2 className="mt-5 whitespace-pre-line text-xl font-bold leading-8">
            {question.prompt}
          </h2>
          <div className="mt-6 grid gap-3">
            {question.options.map((option) => {
              const isSelected = result?.selectedOptionId === option.id;
              const isCorrect = result?.correctOptionId === option.id;

              return (
                <button
                  className={cn(
                    "whitespace-pre-line rounded-md border border-zinc-300 bg-white px-4 py-3 text-left text-sm font-medium leading-6 transition hover:border-emerald-500 hover:bg-emerald-50 disabled:cursor-default dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-emerald-400 dark:hover:bg-emerald-950/50",
                    result &&
                      isCorrect &&
                      "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100",
                    result &&
                      isSelected &&
                      !isCorrect &&
                      "border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100",
                  )}
                  disabled={Boolean(result)}
                  key={option.id}
                  onClick={() => onAnswer(question, option.id)}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </section>
        <aside className="flex flex-col justify-between gap-6 rounded-lg bg-zinc-100 p-5 dark:bg-zinc-800">
          <div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>本輪進度</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="mt-3" />
            {stats ? <PracticeStatsSummary stats={stats} /> : null}

            {result ? (
              <div
                className={cn(
                  "mt-5 rounded-lg border p-4 text-sm leading-6",
                  result.isCorrect
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                    : "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
                )}
              >
                <div className="flex items-center gap-2 font-bold">
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  {result.isCorrect ? "答對了" : "答錯了"}
                </div>
                {!result.isCorrect && correctOption ? (
                  <p className="mt-3 whitespace-pre-line">
                    正解：{correctOption.text}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                選項順序會在本題固定，作答後才顯示正解與下一題按鈕。
              </p>
            )}
          </div>

          {result ? (
            <Button className="w-full" onClick={onNext}>
              下一題
            </Button>
          ) : (
            <Button className="w-full" disabled variant="secondary">
              {waitingLabel}
            </Button>
          )}
        </aside>
      </CardContent>
    </Card>
  );
}

function PracticeStatsSummary({ stats }: { stats: PracticeStats }) {
  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid grid-cols-3 gap-2 text-center">
        <StatPill label="正確" value={stats.correctCount} tone="correct" />
        <StatPill label="錯誤" value={stats.incorrectCount} tone="incorrect" />
        <StatPill label="未作答" value={stats.unansweredCount} tone="muted" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 font-semibold dark:border-zinc-700">
        <span className="text-zinc-600 dark:text-zinc-300">正確率</span>
        <span className="text-zinc-950 dark:text-zinc-50">
          {stats.accuracy}%
          <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            ({stats.correctCount}/{stats.answeredCount})
          </span>
        </span>
      </div>
    </div>
  );
}

function StatPill({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "correct" | "incorrect" | "muted";
  value: number;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-2 py-2",
        tone === "correct" &&
          "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
        tone === "incorrect" &&
          "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
        tone === "muted" &&
          "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
      )}
    >
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 text-lg font-black leading-none">{value}</p>
    </div>
  );
}

function EmptyMode({
  children,
  description,
  icon,
  title,
}: {
  children?: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-lg bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
