import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import problems from "@/statics/problems";
import QuestionLayout from "./CourseLearn/QuestionLayout";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const problemId = Number(id);
  const topic = problems.find((p) => p.id === problemId);

  if (!topic) {
    return (
      <div className="container mx-auto py-20 text-center text-foreground">
        <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
        <p className="text-muted-foreground">The problem you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-8">

      {/* -------- BACK BUTTON -------- */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* -------- TITLE -------- */}
      <h1 className="text-3xl font-bold text-foreground">
        {topic.title}
      </h1>

      {/* -------- QUESTION LAYOUT -------- */}
      <QuestionLayout topic={topic} />
    </div>
  );
};

export default ProblemDetail;
