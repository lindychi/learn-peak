import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/database.types";

export const getSubjects = async () => {
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) {
    throw error;
  }

  return data as Tables<"subjects">[];
};
