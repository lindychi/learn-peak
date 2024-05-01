import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/libs/supabase";

import { getUser } from "@/services/user";

import { Button } from "@/components/ui/button";
import SubjectCheckList from "@/components/FO/SubjectCheckList";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | undefined>();

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

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center">
          {user}
          <Button onClick={logout}>로그아웃</Button>
        </div>

        <SubjectCheckList />
      </div>
    </>
  );
}

export default App;
