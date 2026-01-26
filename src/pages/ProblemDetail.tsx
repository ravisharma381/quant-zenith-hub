import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Circle, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, query, where, limit, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import QuestionLayout from "./CourseLearn/QuestionLayout";
import ProblemDetailSkeleton from "@/components/ProblemDetailSkeleton";
import { Button } from "@/components/ui/button";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading: authLoading, userProfile } = useAuth();
  const location = useLocation();
  const backState = location.state;
  const isLoggedIn = !!user;
  // const isSubscribed = true;
  const isSubscribed = userProfile?.isPremium === true;

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(true);
  const [nextId, setNextId] = useState(null);
  const [prevId, setPrevId] = useState(null);

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
  const markAsCompleted = async () => {
    if (!isLoggedIn) return;
    if (!topic?.courseId) return;

    const progressId = `${user.uid}_${topic.courseId}`;
    const progressRef = doc(db, "progress", progressId);

    // 🟢 Optimistic UI update (instant)   

    try {
      const snap = await getDoc(progressRef);
      const prevList = snap.exists() ? snap.data()?.completedProblems || [] : [];
      if (isCompleted)
        return;
      const updated = [...prevList, topic.id];
      // const updated = !isCompleted
      //   ? [...prevList, topic.id]
      //   : prevList.filter((x: string) => x !== topic.id);

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
      setIsCompleted(true);
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  useEffect(() => {
    goToNext();
    goToPrev();
  }, [topic?.id]);

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
    if (snap.empty) {
      setDisableNext(true);
      setNextId(null);
      return;
    };

    const next = snap.docs[0];
    const nextData = next.data();

    if (!nextData) {
      setDisableNext(true);
      setNextId(null);
    } else {
      setDisableNext(false);
      setNextId(next);
    }
  };
  const goToPrev = async () => {
    if (!topic?.order || !topic.courseId) return;

    // 🔥 Correct way: query by order
    const q = query(
      collection(db, "topics"),
      where("courseId", "==", topic.courseId),
      where("order", "==", topic.order - 1),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      setDisablePrev(true);
      setPrevId(null);
      return;
    };

    const next = snap.docs[0];
    const nextData = next.data();
    if (!nextData) {
      setDisablePrev(true);
      setPrevId(null);
    } else {
      setDisablePrev(false);
      setPrevId(next);
    }
  };


  const onClickNext = () => {
    if (nextId.isPrivate && !isSubscribed) {
      navigate("/checkout");
      return;
    }

    navigate(`/problems/${nextId.id}`);
  }
  const onClickPrev = () => {
    if (prevId.isPrivate && !isSubscribed) {
      navigate("/checkout");
      return;
    }

    navigate(`/problems/${prevId.id}`);
  }

  useEffect(() => {
    if (topic?.title) {
      document.title = `Problem - ${topic.title} | QuantProf`;
    }
    return () => {
      document.title = "QuantProf";
    };
  }, [topic?.title]);

  // ================================
  // RENDER
  // ================================
  if (loading || authLoading) return <ProblemDetailSkeleton />;

  if (!topic) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold">
              Upgrade to Premium
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 leading-relaxed">
            This content is locked. Upgrade to Premium to access
            1,000+ high-quality problems and in-depth courses, and
            prepare efficiently for quant interviews.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">

            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/premium')}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Completed badge */}
        {isCompleted && (
          <div className="flex items-center gap-1 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-400">Completed</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:ml-auto">
          <Button
            onClick={() => {
              if (backState?.fromProblems) {
                navigate("/problems", { state: backState });
              } else {
                navigate("/problems");
              }
            }}
            className="bg-[hsl(0,0%,20%)] text-white hover:bg-[hsl(0,0%,25%)] shadow-none hover:shadow-none"
          >
            Back to Problems
          </Button>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={onClickPrev}
              disabled={disablePrev}
              className="flex-1 md:flex-none text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              onClick={onClickNext}
              disabled={disableNext}
              className="flex-1 md:flex-none text-muted-foreground hover:text-foreground"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* QUESTION */}
      <QuestionLayout topic={topic} isUser={!!user} isProblemsPage={true} markAsCompleted={isSubscribed ? markAsCompleted : undefined} />
    </div>
  );
};

export default ProblemDetail;
