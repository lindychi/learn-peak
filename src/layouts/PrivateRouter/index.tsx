import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/libs/supabase";

type Props = { children: JSX.Element };

export default function PrivateRouter({ children }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const loginCheck = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        setLoading(false);
        if (data.session) {
          // 사용자가 로그인한 경우, "/"로 리디렉션 또는 필요한 로직 실행
          console.log("private router: User is logged in");
          navigate("/");
        } else {
          // 사용자가 로그인하지 않은 경우, 로그인 페이지로 리디렉션
          navigate("/login");
        }
      } catch (e) {
        console.log(e);
      }
    };

    loginCheck();
  }, [navigate]);

  if (loading) {
    return null;
  }

  return children;
}
