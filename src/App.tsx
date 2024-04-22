import { ChangeEvent, useEffect, useRef, useState } from "react";
import { supabase } from "./libs/supabase";
import { useNavigate } from "react-router-dom";
import { QuestionFormState } from "./types/questions";
import { addQuestions } from "./services/questions";
import { getUser } from "./services/user";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | undefined>();
  const [formState, setFormState] = useState<QuestionFormState>({
    title: "",
    contentText: "",
    contentImage: undefined,
    answer: "",
  });
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  // 파일 입력 필드에 대한 참조 생성
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const loadUser = async () => {
    const user = await getUser();

    setUser(user.email);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setFormState({
        ...formState,
        contentImage: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 formState를 사용하여 필요한 로직을 처리합니다.

    try {
      const data = await addQuestions(formState);
      console.log(data);

      setFormState({
        title: "",
        contentText: "",
        contentImage: undefined,
        answer: "",
      });
      setPreviewImage(undefined);

      // 파일 입력 필드 직접 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-between">
          {user}
          <button onClick={logout}>Logout</button>
        </div>

        <button
          onClick={() => navigate("/random")}
          className="p-2 bg-emerald-300 rounded"
        >
          문제 풀이 고고띵
        </button>

        {user === "igam0000@gmail.com" && (
          <div>
            <div>문제 추가</div>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">문제 제목:</label>
                <textarea
                  id="title"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md w-full p-2"
                />
              </div>
              <div>
                <label htmlFor="contentText">문제 내용 (텍스트):</label>
                <textarea
                  id="contentText"
                  name="contentText"
                  value={formState.contentText}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md w-full p-2"
                />
              </div>
              <div>
                <label htmlFor="contentImage">문제 내용 (이미지):</label>
                <input
                  type="file"
                  id="contentImage"
                  name="contentImage"
                  onChange={handleImageChange}
                  ref={fileInputRef} // 참조 설정
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ maxWidth: "500px", maxHeight: "500px" }}
                  />
                )}
              </div>
              <div>
                <label htmlFor="answer">답:</label>
                <textarea
                  id="answer"
                  name="answer"
                  value={formState.answer}
                  onChange={handleInputChange}
                  className="border-2 border-gray-300 rounded-md w-full p-2"
                />
              </div>
              <button type="submit">제출</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
