import { supabase } from "@/libs/supabase";

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  return data.user;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
