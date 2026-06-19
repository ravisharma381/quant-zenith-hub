import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X, Clock, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Op = "+" | "-" | "×" | "÷";
type NumberType = "integers" | "fractions" | "decimals";
type QuestionType = "multiple-choice" | "free-response";

type Question = {
  prompt: string;
  answer: string;
  choices?: string[];
};

type AnsweredQuestion = Question & {
  userAnswer: string;
  correct: boolean;
};

const PAGE_SIZE = 20;

const round2 = (n: number) => Math.round(n * 100) / 100;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const simplify = (num: number, den: number) => {
  if (den === 0) return { num, den };
  const g = gcd(Math.abs(num), Math.abs(den)) || 1;
  let n = num / g;
  let d = den / g;
  if (d < 0) { n = -n; d = -d; }
  return { num: n, den: d };
};

const fracStr = (num: number, den: number) => {
  const s = simplify(num, den);
  if (s.den === 1) return `${s.num}`;
  return `${s.num}/${s.den}`;
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestion = (
  ops: Op[],
  numberType: NumberType,
  questionType: QuestionType
): Question => {
  const op = ops[Math.floor(Math.random() * ops.length)];

  let prompt = "";
  let answer = "";

  if (numberType === "integers") {
    let a = randInt(2, 50);
    let b = randInt(2, 20);
    let res = 0;
    if (op === "+") { res = a + b; }
    else if (op === "-") { if (b > a) [a, b] = [b, a]; res = a - b; }
    else if (op === "×") { a = randInt(2, 15); b = randInt(2, 15); res = a * b; }
    else { res = randInt(2, 12); b = randInt(2, 12); a = res * b; }
    prompt = `${a} ${op} ${b}`;
    answer = `${res}`;
  } else if (numberType === "decimals") {
    let a = round2(Math.random() * 20 + 1);
    let b = round2(Math.random() * 10 + 1);
    let res = 0;
    if (op === "+") res = round2(a + b);
    else if (op === "-") { if (b > a) [a, b] = [b, a]; res = round2(a - b); }
    else if (op === "×") { a = round2(Math.random() * 9 + 1); b = round2(Math.random() * 5 + 1); res = round2(a * b); }
    else { b = round2(Math.random() * 4 + 1); res = round2(Math.random() * 5 + 1); a = round2(res * b); }
    prompt = `${a} ${op} ${b}`;
    answer = `${res}`;
  } else {
    // fractions
    const n1 = randInt(1, 9), d1 = randInt(2, 9);
    const n2 = randInt(1, 9), d2 = randInt(2, 9);
    let num = 0, den = 1;
    if (op === "+") { num = n1 * d2 + n2 * d1; den = d1 * d2; }
    else if (op === "-") {
      let a = n1 * d2, b = n2 * d1;
      if (b > a) [a, b] = [b, a];
      num = a - b; den = d1 * d2;
    }
    else if (op === "×") { num = n1 * n2; den = d1 * d2; }
    else { num = n1 * d2; den = d1 * n2; }
    prompt = `${n1}/${d1} ${op} ${n2}/${d2}`;
    answer = fracStr(num, den);
  }

  const q: Question = { prompt, answer };

  if (questionType === "multiple-choice") {
    const choicesSet = new Set<string>([answer]);
    while (choicesSet.size < 4) {
      // perturb numerically
      if (numberType === "fractions") {
        choicesSet.add(fracStr(randInt(1, 30), randInt(2, 12)));
      } else if (numberType === "decimals") {
        const numericAns = Number(answer);
        const delta = round2((Math.random() * 4 - 2));
        const candidate = round2(numericAns + (delta === 0 ? 0.5 : delta));
        choicesSet.add(`${candidate}`);
      } else {
        const numericAns = Number(answer);
        const delta = randInt(-9, 9);
        const candidate = numericAns + (delta === 0 ? 1 : delta);
        choicesSet.add(`${candidate}`);
      }
    }
    q.choices = Array.from(choicesSet).sort(() => Math.random() - 0.5);
  }

  return q;
};

const normalize = (s: string) => s.replace(/\s+/g, "").toLowerCase();

const isAnswerCorrect = (user: string, correct: string, numberType: NumberType) => {
  if (!user) return false;
  if (numberType === "fractions") {
    const parse = (str: string) => {
      const [n, d] = str.split("/");
      return { n: Number(n), d: d ? Number(d) : 1 };
    };
    const u = parse(normalize(user));
    const c = parse(normalize(correct));
    if (!isFinite(u.n) || !isFinite(u.d) || u.d === 0) return false;
    return u.n * c.d === c.n * u.d;
  }
  if (numberType === "decimals") {
    return Math.abs(Number(user) - Number(correct)) < 0.01;
  }
  return normalize(user) === normalize(correct);
};

type Stage = "setup" | "test" | "results";

const MathTrainer = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("setup");

  // setup
  const [ops, setOps] = useState<Op[]>(["+", "-", "×", "÷"]);
  const [numberType, setNumberType] = useState<NumberType>("integers");
  const [duration, setDuration] = useState<2 | 6 | 8>(2);
  const [questionType, setQuestionType] = useState<QuestionType>("multiple-choice");
  const [showLive, setShowLive] = useState<boolean>(true);

  // test
  const [timeLeft, setTimeLeft] = useState(0);
  const [current, setCurrent] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<AnsweredQuestion[]>([]);

  // results
  const [resultPage, setResultPage] = useState(1);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggleOp = (op: Op) => {
    setOps((prev) => {
      const has = prev.includes(op);
      if (has) {
        if (prev.length === 1) return prev;
        return prev.filter((o) => o !== op);
      }
      return [...prev, op];
    });
  };

  const startTest = () => {
    setHistory([]);
    setScore(0);
    setUserInput("");
    setTimeLeft(duration * 60);
    setCurrent(generateQuestion(ops, numberType, questionType));
    setStage("test");
  };

  useEffect(() => {
    if (stage !== "test") return;
    if (timeLeft <= 0) {
      setStage("results");
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, timeLeft]);

  useEffect(() => {
    if (stage === "test" && questionType === "free-response") {
      inputRef.current?.focus();
    }
  }, [stage, current, questionType]);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!current) return;
      const ok = isAnswerCorrect(answer, current.answer, numberType);
      setHistory((h) => [...h, { ...current, userAnswer: answer, correct: ok }]);
      if (ok) setScore((s) => s + 1);
      setUserInput("");
      setCurrent(generateQuestion(ops, numberType, questionType));
    },
    [current, numberType, ops, questionType]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    submitAnswer(userInput.trim());
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ============ SETUP ============
  if (stage === "setup") {
    const isOpSelected = (op: Op) => ops.includes(op);
    return (
      <div className="min-h-screen bg-background flex justify-center pt-4 pb-8 px-4">
        <div className="w-full max-w-lg bg-card rounded-2xl p-4 md:p-8 border" style={{ borderColor: "hsl(var(--primary))" }}>
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-2 text-center">Math Trainer</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 text-center">
            Configure your drill, then practice with timed questions.
          </p>

          <section className="mb-5">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Operations (minimum 1)</h2>
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3 md:justify-center">
              {(["+", "-", "×", "÷"] as Op[]).map((op) => {
                const active = isOpSelected(op);
                return (
                  <Button
                    key={op}
                    variant="outline"
                    onClick={() => toggleOp(op)}
                    className="text-xs md:text-sm"
                    style={active ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.3)" } : {}}
                  >
                    {op === "+" ? "Addition" : op === "-" ? "Subtraction" : op === "×" ? "Multiplication" : "Division"}
                  </Button>
                );
              })}
            </div>
          </section>

          <section className="mb-5">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Number Type</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {(["integers", "fractions", "decimals"] as NumberType[]).map((nt) => (
                <Button
                  key={nt}
                  variant="outline"
                  onClick={() => setNumberType(nt)}
                  className="flex-1 text-xs md:text-sm capitalize"
                  style={numberType === nt ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.3)" } : {}}
                >
                  {nt}
                </Button>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Time</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {([2, 6, 8] as const).map((d) => (
                <Button
                  key={d}
                  variant="outline"
                  onClick={() => setDuration(d)}
                  className="flex-1 text-xs md:text-sm"
                  style={duration === d ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.3)" } : {}}
                >
                  {d} min
                </Button>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Question Type</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {([
                { id: "multiple-choice" as QuestionType, label: "Multiple Choice" },
                { id: "free-response" as QuestionType, label: "Free Response" },
              ]).map((qt) => (
                <Button
                  key={qt.id}
                  variant="outline"
                  onClick={() => setQuestionType(qt.id)}
                  className="flex-1 text-xs md:text-sm"
                  style={questionType === qt.id ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.3)" } : {}}
                >
                  {qt.label}
                </Button>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Show Live Score</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {([
                { id: true, label: "On" },
                { id: false, label: "Off" },
              ]).map((opt) => (
                <Button
                  key={String(opt.id)}
                  variant="outline"
                  onClick={() => setShowLive(opt.id)}
                  className="flex-1 text-xs md:text-sm"
                  style={showLive === opt.id ? { backgroundColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.3)" } : {}}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/games?category=arithmetic")} className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={startTest} className="px-8 text-sm">Start Test</Button>
          </div>
        </div>
      </div>
    );
  }

  // ============ TEST ============
  if (stage === "test" && current) {
    return (
      <div className="min-h-screen bg-background flex justify-center pt-4 px-4">
        <div className="w-full max-w-3xl bg-card rounded-lg border border-border flex flex-col">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground min-w-[100px]">
              {showLive ? (
                <>
                  <Star className="w-5 h-5" />
                  <span className="font-medium">{score} pts</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Live score off</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Question {history.length + 1}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="border-t border-border/50" />

          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16 gap-8">
            <div className="text-4xl md:text-6xl font-light text-foreground tracking-wide text-center">
              {current.prompt} = ?
            </div>

            {questionType === "free-response" ? (
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={numberType === "fractions" ? "e.g. 3/4" : ""}
                  className="w-48 md:w-64 h-14 text-2xl md:text-3xl text-center bg-transparent rounded-md outline-none"
                  style={{ border: `2px solid hsl(var(--primary))` }}
                  autoFocus
                />
                <Button type="submit">Submit</Button>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {current.choices?.map((c) => (
                  <Button
                    key={c}
                    variant="outline"
                    onClick={() => submitAnswer(c)}
                    className="h-14 text-lg md:text-xl"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={() => setStage("results")}>
              Finish early
            </Button>
          </div>

          <div className="border-t border-border/50" />
          <div className="px-4 py-3 text-center">
            <span className="text-muted-foreground text-sm">Math Trainer</span>
          </div>
        </div>
      </div>
    );
  }

  // ============ RESULTS ============
  const correctCount = history.filter((h) => h.correct).length;
  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const pageItems = history.slice((resultPage - 1) * PAGE_SIZE, resultPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Test complete</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Review every question you attempted below.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{correctCount}/{history.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Correct</div>
            </div>
          </CardContent>
        </Card>

        {history.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No questions answered.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              {pageItems.map((q, idx) => {
                const num = (resultPage - 1) * PAGE_SIZE + idx + 1;
                return (
                  <Card key={num} className="border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="text-sm text-muted-foreground w-8 shrink-0">#{num}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium">{q.prompt} = {q.answer}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Your answer: <span className="text-foreground">{q.userAnswer || "—"}</span>
                        </div>
                      </div>
                      {q.correct ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/30 rounded-full px-3 py-1">
                          <X className="w-3 h-3" /> Incorrect
                        </span>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <Pagination className="mb-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setResultPage((p) => Math.max(1, p - 1)); }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={resultPage === i + 1}
                        onClick={(e) => { e.preventDefault(); setResultPage(i + 1); }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setResultPage((p) => Math.min(totalPages, p + 1)); }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/games?category=arithmetic")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games II
          </Button>
          <Button onClick={() => { setResultPage(1); setStage("setup"); }}>
            New Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MathTrainer;
