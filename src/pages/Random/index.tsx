import { useEffect, useState } from "react";
import { getRandomQuestion } from "../../services/questions";
import { getUser } from "../../services/user";
import { Tables } from "../../types/database.types";
import { updateOrInsertForget } from "../../services/forgets";

type Props = {};

export default function RandomQuestions({}: Props) {
  const [question, setQuestion] = useState<Tables<"questions">>();
  const [forget, setForget] = useState<Tables<"forgets">>();
  const [isSubmit, setIsSubmit] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

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
      return <div>문제가 없습니다.</div>;
    }
  }

  return (
    <div>
      RandomQuestions<div>{question?.title}</div>
      <div>
        <div className=" whitespace-pre-line">{question?.contentText}</div>
        {question?.contentImage && (
          <img src={question?.contentImage} alt={"question-content"} />
        )}
      </div>
      답변 입력:<textarea className="border"></textarea>
      <button onClick={() => setIsSubmit(true)}>제출</button>
      {isSubmit && (
        <div>
          <div>정답: {question?.answer}</div>
          <div className="flex justify-around">
            <button
              className="p-2 bg-red-400"
              onClick={() => {
                if (!userId) {
                  alert("로그인이 필요합니다.");
                } else if (!question) {
                  alert("문제를 불러오는 중입니다.");
                } else {
                  updateOrInsertForget(userId, question?.id, -1, forget);
                }
              }}
            >
              오답
            </button>
            <button
              className="p-2 bg-blue-400"
              onClick={() => {
                if (!userId) {
                  alert("로그인이 필요합니다.");
                } else if (!question) {
                  alert("문제를 불러오는 중입니다.");
                } else {
                  updateOrInsertForget(userId, question?.id, 1, forget);
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
