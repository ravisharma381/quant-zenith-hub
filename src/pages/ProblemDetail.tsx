import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, query, where, limit, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import QuestionLayout from "./CourseLearn/QuestionLayout";
import ProblemDetailSkeleton from "@/components/ProblemDetailSkeleton";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading: authLoading, userProfile } = useAuth();
  const location = useLocation();
  const backState = location.state;
  const isLoggedIn = !!user;
  const isSubscribed = true;
  // const isSubscribed = userProfile?.issubscribed === true;

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  // ================================
  // FETCH PROBLEM
  // ================================
  useEffect(() => {
    if (!id) return;
    if (authLoading) return;

    const load = async () => {
      setLoading(true);

      try {
        const ref = doc(db, "topics", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setTopic(null);
          return;
        }

        const data = snap.data();
        const prob = {
          id: snap.id,
          title: data.title,
          topic: data.topic,
          difficulty: Number(data.level ?? 1),
          askedIn: data.askedIn ?? [],
          question: data.question ?? "",
          answer: data.answer ?? "",
          hint1: data.hint1 ?? "",
          hint2: data.hint2 ?? "",
          hint3: data.hint3 ?? "",
          hint4: data.hint4 ?? "",
          hint5: data.hint5 ?? "",
          solution: data.solution ?? "",
          courseId: data.courseId ?? null,
          isPrivate: data.isPrivate ?? false,
          order: data.order ?? null
        };

        // 🔒 PRIVATE CHECK
        if (prob.isPrivate && !isSubscribed) {
          navigate("/checkout");
          return;
        }

        setTopic(prob);

        // ---- Fetch progress ONLY if logged in ----
        if (isLoggedIn && prob.courseId) {
          const progressId = `${user.uid}_${prob.courseId}`;
          const progressRef = doc(db, "progress", progressId);
          const progressSnap = await getDoc(progressRef);

          if (progressSnap.exists()) {
            const arr = progressSnap.data()?.completedProblems || [];
            setIsCompleted(arr.includes(prob.id));
          }
        }

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, authLoading]);

  // ================================
  // MARK / UNMARK COMPLETE
  // ================================
  const toggleComplete = async () => {
    if (!isLoggedIn) return;
    if (!topic?.courseId) return;

    const progressId = `${user.uid}_${topic.courseId}`;
    const progressRef = doc(db, "progress", progressId);

    // 🟢 Optimistic UI update (instant)
    setIsCompleted(prev => !prev);

    try {
      const snap = await getDoc(progressRef);
      const prevList = snap.exists() ? snap.data()?.completedProblems || [] : [];

      const updated = !isCompleted
        ? [...prevList, topic.id]
        : prevList.filter((x: string) => x !== topic.id);

      await setDoc(
        progressRef,
        {
          userId: user.uid,
          courseId: topic.courseId,
          completedProblems: updated,
          updatedAt: new Date()
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  // ================================
  // NEXT QUESTION
  // ================================
  const goToNext = async () => {
    if (!topic?.order || !topic.courseId) return;

    // 🔥 Correct way: query by order
    const q = query(
      collection(db, "topics"),
      where("courseId", "==", topic.courseId),
      where("order", "==", topic.order + 1),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) return;

    const next = snap.docs[0];
    const nextData = next.data();

    if (nextData.isPrivate && !isSubscribed) {
      navigate("/checkout");
      return;
    }

    navigate(`/problems/${next.id}`);
  };

  // ================================
  // RENDER
  // ================================
  if (loading || authLoading) return <ProblemDetailSkeleton />;

  if (!topic) {
    return (
      <div className="container mx-auto py-20 text-center text-foreground">
        <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
        <p className="text-muted-foreground">This problem does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">

      {/* BACK BUTTON */}
      <button
        onClick={() => {
          if (backState?.fromProblems) {
            navigate("/problems", { state: backState });
          } else {
            navigate("/problems");
          }
        }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>


      {/* MARK COMPLETE + NEXT */}
      {isLoggedIn && (
        <div className="flex justify-between items-center">

          {/* MARK COMPLETE */}
          <button
            onClick={toggleComplete}
            className="flex items-center gap-2 text-sm px-3 py-1 rounded-md border border-border hover:bg-muted transition"
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-400">Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mark Complete</span>
              </>
            )}
          </button>

          {/* NEXT BUTTON */}
          <button
            onClick={goToNext}
            className="text-sm px-3 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80 transition"
          >
            Next →
          </button>

        </div>
      )}

      {/* QUESTION */}
      <QuestionLayout topic={topic} />
    </div>
  );
};

export default ProblemDetail;
