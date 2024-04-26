import { useEffect, useState } from "react";
import { getRandomQuestion } from "../../services/questions";
import { getUser } from "../../services/user";
import { Tables } from "../../types/database.types";
import { updateOrInsertForget } from "../../services/forgets";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

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
          <button
            className="p-2 bg-emerald-300 rounded"
            onClick={() => {
              navigate("/");
            }}
          >
            뒤로가기
          </button>
        </div>
      );
    }
  }

  return (
    <div>
      <button
        className="p-2 bg-emerald-300 rounded"
        onClick={() => {
          navigate("/");
        }}
      >
        뒤로가기
      </button>
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
        {forget?.dueDate &&
          `마지막 정답일: ${Math.abs(
            Math.floor(
              (new Date(forget?.dueDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )}일 전`}
      </div>
      <div className="font-bold">{question?.title}</div>
      <div>
        <div className=" whitespace-pre-line">{question?.contentText}</div>
        {question?.contentImage && (
          <img src={question?.contentImage} alt={"question-content"} />
        )}
      </div>
      답변 입력:
      <textarea
        className="border-2 border-gray-300 rounded-md w-full p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button onClick={() => setIsSubmit(true)}>제출</button>
      {isSubmit && (
        <div>
          <div className="whitespace-pre-line">정답: {question?.answer}</div>
          <div className="flex justify-around">
            <button
              className="p-2 bg-red-400"
              onClick={async () => {
                if (!userId) {
                  alert("로그인이 필요합니다.");
                } else if (!question) {
                  alert("문제를 불러오는 중입니다.");
                } else {
                  await updateOrInsertForget(userId, question?.id, -1, forget);
                  refreshQuestion();
                }
                // 새 문제 불러오기
              }}
            >
              오답
            </button>
            <button
              className="p-2 bg-blue-400"
              onClick={async () => {
                if (!userId) {
                  alert("로그인이 필요합니다.");
                } else if (!question) {
                  alert("문제를 불러오는 중입니다.");
                } else {
                  await updateOrInsertForget(userId, question?.id, 1, forget);
                  refreshQuestion();
                }
              }}
            >
              정답
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
