import { useEffect, useState } from "react";
import { getRandomQuestion } from "@/services/questions";
import { getUser } from "@/services/user";
import { Tables } from "@/types/database.types";
import { updateOrInsertForget } from "@/services/forgets";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

export default function RandomQuestions() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Tables<"questions">>();
  const [forget, setForget] = useState<Tables<"forgets">>();
  const [isSubmit, setIsSubmit] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<string>("");
  const [remainCount, setRemainCount] = useState<number | undefined>();
  const [totalCount, setTotalCount] = useState<number | undefined>();

  const refreshQuestion = async () => {
    setIsSubmit(false);
    setInput("");
    setLoading(true);
    if (userId) {
      getRandomQuestion(userId, question?.id)
        .then(({ targetQuestion, targetForget, remainCount, totalCount }) => {
          setQuestion(targetQuestion);
          setForget(targetForget);
          setRemainCount(remainCount);
          setTotalCount(totalCount);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const loadInfo = async () => {
    try {
      const user = await getUser();
      setUserId(user.id);

      const { targetQuestion, targetForget, remainCount, totalCount } =
        await getRandomQuestion(user.id);
      setQuestion(targetQuestion);
      setForget(targetForget);
      setRemainCount(remainCount);
      setTotalCount(totalCount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScore = async (score: number) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
    } else if (!question) {
      alert("문제를 불러오는 중입니다.");
    } else {
      await updateOrInsertForget(userId, question?.id, score, forget);
      refreshQuestion();
    }
    // 새 문제 불러오기
  };

  useEffect(() => {
    loadInfo();
  }, []);

  if (!question) {
    if (loading) {
      return <div>로딩 중...</div>;
    } else {
      return (
        <div>
          문제가 없습니다.
          <Button
            className="p-2 bg-emerald-300 rounded"
            onClick={() => {
              navigate("/");
            }}
          >
            뒤로가기
          </Button>
        </div>
      );
    }
  }

  return (
    <div>
      <Button
        className="p-2 bg-emerald-300 rounded"
        onClick={() => {
          navigate("/");
        }}
      >
        뒤로가기
      </Button>
      <div>
        남은 문제 수: {remainCount}/{totalCount}
      </div>
      {/* weight에 따라서 weight이 낮으면 점점 더 붉은색, weight이 높으면 점점 더 녹색으로 출력되도록 수정 */}
      <div
        className={clsx({
          "text-red-500": (forget?.weight ?? 0) < 0,
          "text-green-500": (forget?.weight ?? 0) > 0,
        })}
      >
        {forget?.weight ?? 0}
      </div>
      {/* dueDate가 오늘로부터 몇일전인지 출력 */}
      <div>
        {forget?.due_date &&
          `마지막 정답일: ${Math.abs(
            Math.floor(
              (new Date(forget?.due_date).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )}일 전`}
      </div>
      <div className="h-20 flex">
        {isSubmit ? (
          <>
            <div
              className="h-20 flex-1 flex items-center justify-center bg-red-300 rounded-xl text-xl"
              onClick={() => handleScore(-1)}
            >
              오답
            </div>
            <div
              className="h-20 flex-1 flex items-center justify-center bg-blue-300 rounded-xl text-xl"
              onClick={() => handleScore(1)}
            >
              정답
            </div>
          </>
        ) : (
          <>
            <div
              className="h-20 flex-1 flex items-center justify-center bg-green-300 rounded-xl text-xl"
              onClick={() => handleScore(1)}
            >
              통과
            </div>
            <Button
              onClick={() => setIsSubmit(true)}
              className="h-20 flex-1 flex items-center justify-center bg-gray-300 rounded-xl text-xl"
            >
              제출
            </Button>
          </>
        )}
      </div>
      <div className="font-bold">{question?.title}</div>
      <div>
        <div className=" whitespace-pre-line">{question?.content_text}</div>
        {question?.content_image && (
          <img src={question?.content_image} alt={"question-content"} />
        )}
      </div>
      답변 입력:
      <textarea
        className="border-2 border-gray-300 rounded-md w-full p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsSubmit(true);
          }
        }}
      ></textarea>
      {isSubmit && (
        <div className="whitespace-pre-line">
          정답: {question?.subjective_answer}
        </div>
      )}
    </div>
  );
}
