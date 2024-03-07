import { useEffect, useState } from "react";
import { getRandomQuestion } from "../../services/questions";
import { getUser } from "../../services/user";
import { Tables } from "../../types/database.types";
import { updateOrInsertForget } from "../../services/forgets";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function RandomQuestions({}: Props) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Tables<"questions">>();
  const [forget, setForget] = useState<Tables<"forgets">>();
  const [isSubmit, setIsSubmit] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<string>("");

  const refreshQuestion = async () => {
    setIsSubmit(false);
    setInput("");
    setLoading(true);
    if (userId) {
      getRandomQuestion(userId)
        .then(({ targetQuestion, targetForget }) => {
          setQuestion(targetQuestion);
          setForget(targetForget);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getUser().then((user) => {
      setUserId(user.id);
      getRandomQuestion(user.id)
        .then(({ targetQuestion, targetForget }) => {
          setQuestion(targetQuestion);
          setForget(targetForget);
        })
        .finally(() => {
          setLoading(false);
        });
    });
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
          <div>정답: {question?.answer}</div>
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
