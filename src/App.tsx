import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/libs/supabase";

import { getUser } from "@/services/user";

import { Button } from "@/components/ui/button";
import SubjectCheckList from "@/components/FO/SubjectCheckList";

import { ReloadIcon } from "@radix-ui/react-icons";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const user = await getUser();
      setUser(user.email);
      setIsLoading(false);
    } catch (e) {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <div>{user}</div>
          <Button onClick={logout} disabled={isLoading} className="flex gap-2">
            {isLoading && <ReloadIcon className="animate-spin" />}
            로그아웃
          </Button>
        </div>

        <SubjectCheckList isLoading={isLoading} />
      </div>
    </>
  );
}

export default App;
