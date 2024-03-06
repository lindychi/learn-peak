import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabase";
import { FcGoogle } from "react-icons/fc";

type Props = {};

export default function Login({}: Props) {
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (signInError) {
        throw signInError;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const loginCheck = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }

      if (data.session) {
        // 사용자가 로그인한 경우, "/"로 리디렉션 또는 필요한 로직 실행
        navigate("/");
      } else {
        // 사용자가 로그인하지 않은 경우, 로그인 페이지로 리디렉션
        navigate("/login");
      }
    };
    loginCheck();
  }, [navigate]);

  return (
    <section className="w-full h-full min-h-screen flex justify-center items-center bg-emerald-900">
      <div className="bg-white p-4 rounded-lg text-2xl flex flex-col items-center gap-2">
        로그인
        {/* <form className="flex flex-col gap-2">
          <input type="text" placeholder="아이디" />
          <input type="text" placeholder="비밀번호" />
          <button>로그인</button>
        </form> */}
        {/* 구글, OAuth 로그인 섹션 */}
        <section>
          <div className="flex flex-col gap-2">
            <button
              className="border-2 border-emerald-900 bg-white"
              onClick={async () => {
                googleLogin();
              }}
            >
              <FcGoogle />
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
