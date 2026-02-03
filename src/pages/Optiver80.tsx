import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Clock, Star, RotateCcw, Undo2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

type IntRange = [number, number];
type DecRange = [number, number];

type OpRangeConfig =
  | {
    int: { a: IntRange; b: IntRange };
    dec: { a: DecRange; b: DecRange };
  }
  | {
    int: { b: IntRange; c: IntRange };
    dec: { b: DecRange; c: DecRange };
  };

const OP_RANGES: Record<"+" | "-" | "*" | "/", OpRangeConfig> = {
  "+": {
    int: { a: [1, 80], b: [1, 80] },
    dec: { a: [0.2, 50], b: [0.2, 50] }
  },
  "-": {
    int: { a: [10, 100], b: [1, 80] },
    dec: { a: [5, 60], b: [0.2, 40] }
  },
  "*": {
    int: { a: [2, 20], b: [2, 15] },
    dec: { a: [0.2, 10], b: [0.2, 5] }
  },
  "/": {
    int: { b: [2, 20], c: [2, 40] },
    dec: { b: [0.2, 5], c: [2, 50] }
  }
};

interface Question {
  text: string;
  options: number[];
  correct: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rand1Dec(min: number, max: number): number {
  const lo = Math.round(min * 10);
  const hi = Math.round(max * 10);
  return randInt(lo, hi) / 10;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function genByRange([min, max]: [number, number], isDecimal: boolean): number {
  return isDecimal ? rand1Dec(min, max) : randInt(min, max);
}

function generateQuestion() {
  const ops = ["+", "-", "*", "/"];
  const operator = ops[randInt(0, ops.length - 1)] as "+" | "-" | "*" | "/";
  const isDecimal = Math.random() < 0.6;
  let a: number, b: number, c: number;
  const ranges = OP_RANGES[operator][isDecimal ? "dec" : "int"];

  if (operator === "/") {
    b = genByRange((ranges as { b: [number, number]; c: [number, number] }).b, isDecimal);
    c = genByRange((ranges as { b: [number, number]; c: [number, number] }).c, isDecimal);
    a = Math.round(b * c * 100) / 100;
  } else {
    a = genByRange((ranges as { a: [number, number]; b: [number, number] }).a, isDecimal);
    b = genByRange((ranges as { a: [number, number]; b: [number, number] }).b, isDecimal);
    switch (operator) {
      case "+": c = a + b; break;
      case "-": c = a - b; break;
      case "*": c = a * b; break;
      default: c = 0;
    }
    c = Math.round(c * 100) / 100;
  }

  const missing = randInt(0, 2);
  const display: { a: number | string; b: number | string; c: number | string } = { a, b, c };
  const answer = [a, b, c][missing];
  ["a", "b", "c"].forEach((k, i) => {
    if (i === missing) display[k as keyof typeof display] = "?";
  });

  return { operator, display, answer };
}

function generateOptions(correct: number): number[] {
  const options = new Set([correct]);
  while (options.size < 4) {
    const delta = Math.random() < 0.5 ? rand1Dec(0.1, 2) : randInt(1, 5);
    const fake = Math.random() < 0.5 ? correct + delta : correct - delta;
    options.add(Number(fake.toFixed(2)));
  }
  return shuffle([...options]);
}

function createOptiverQuestion(): Question {
  const q = generateQuestion();
  const displayOperator = q.operator === "*" ? "×" : q.operator === "/" ? "÷" : q.operator;
  return {
    text: `${q.display.a} ${displayOperator} ${q.display.b} = ${q.display.c}`,
    options: generateOptions(q.answer),
    correct: q.answer
  };
}

const Optiver80 = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(80);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const themeColors = {
    primary: "hsl(0, 84%, 60%)",
    primaryRgb: "239, 68, 68",
    primaryForeground: "hsl(220, 13%, 8%)"
  };

  const generateNewQuestion = useCallback(() => {
    const question = createOptiverQuestion();
    setCurrentQuestion(question);
    setSelectedAnswer(null);
  }, []);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 1) {
      const timer = setTimeout(() => {
        setGameState('playing');
        generateNewQuestion();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown, generateNewQuestion]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  const handleAnswerSelect = (option: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(option);
    const isCorrect = Math.abs(option - currentQuestion.correct) < 0.01;

    if (isCorrect) {
      setScore(score + 1);
    }

    setQuestionsAnswered(questionsAnswered + 1);

    // Move to next question after a brief delay
    setTimeout(() => {
      generateNewQuestion();
    }, 300);
  };

  const getPerformanceRating = () => {
    if (score >= 70) return { text: "Outstanding!", color: themeColors.primary };
    if (score >= 60) return { text: "Excellent", color: "hsl(122, 39%, 49%)" };
    if (score >= 50) return { text: "Good", color: "hsl(48, 96%, 53%)" };
    if (score >= 40) return { text: "Fair", color: "hsl(25, 95%, 53%)" };
    return { text: "Keep Practicing", color: "hsl(0, 84%, 60%)" };
  };

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center -mt-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap
              className="w-12 h-12 mr-4"
              style={{ color: themeColors.primary }}
            />
            <h1 className="text-4xl font-bold text-foreground">Optiver 80 in 80</h1>
          </div>
          <div
            className="text-8xl font-bold mb-4 animate-pulse"
            style={{ color: themeColors.primary }}
          >
            {countdown || "GO!"}
          </div>
          <p className="text-muted-foreground">80 questions in 80 seconds - Can you make it?</p>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const rating = getPerformanceRating();
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Trophy
            className="w-16 h-16 mx-auto mb-6"
            style={{ color: themeColors.primary }}
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">Challenge Complete!</h1>
          <div className="bg-card rounded-xl p-6 mb-6 border">
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: themeColors.primary }}
            >
              {score}/80
            </div>
            <div className="text-muted-foreground">Correct Answers</div>
            <div className="text-muted-foreground text-sm mt-1">
              {questionsAnswered} questions answered
            </div>
            <div
              className="text-lg font-bold mt-2"
              style={{ color: rating.color }}
            >
              {rating.text}
            </div>
          </div>
          {score >= 60 && (
            <div
              className="border rounded-lg p-4 mb-6"
              style={{
                backgroundColor: `rgba(${themeColors.primaryRgb}, 0.1)`,
                borderColor: `rgba(${themeColors.primaryRgb}, 0.3)`
              }}
            >
              <p
                className="text-sm"
                style={{ color: themeColors.primary }}
              >
                🎉 Congratulations! You've reached Optiver interview level!
              </p>
            </div>
          )}
          <div className="space-y-4">
            <Button
              onClick={() => window.location.reload()}
              variant="clean"
              className="w-full h-10 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.primaryForeground
              }}
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/games')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center pt-4 px-4">
      <div className="w-full max-w-4xl bg-card rounded-lg border border-border flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5" />
            <span className="font-medium">{score} points</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5" />
            <span className={`font-medium ${timeLeft <= 10 ? 'text-destructive animate-pulse' : ''}`}>
              {timeLeft} seconds
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate('/games')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Undo2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border/50" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <span className="text-4xl md:text-6xl font-light text-foreground tracking-wide">
              {currentQuestion.text}
            </span>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = Math.abs(option - currentQuestion.correct) < 0.01;
              const showResult = selectedAnswer !== null;

              let buttonStyle = {};
              if (showResult) {
                if (isCorrect) {
                  buttonStyle = {
                    backgroundColor: "hsl(122, 39%, 49%)",
                    color: "white"
                  };
                } else if (isSelected && !isCorrect) {
                  buttonStyle = {
                    backgroundColor: "hsl(0, 84%, 60%)",
                    color: "white"
                  };
                }
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  className="h-16 md:h-20 text-xl md:text-2xl font-medium"
                  style={buttonStyle}
                  variant={showResult ? "clean" : "outline"}
                >
                  {option % 1 === 0 ? option : option.toFixed(2)}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50" />
        <div className="px-4 py-4 text-center">
          <span className="text-muted-foreground text-sm">Optiver 80 in 80</span>
        </div>
      </div>
    </div>
  );
};

export default Optiver80;