import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/database.types";

export const getSubjects = async () => {
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) {
    throw error;
  }

  return data as Tables<"subjects">[];
};

// getSubjects에 페이지네이션 적용
export const getSubjectsPaginated = async (page: number, limit: number) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1);
  if (error) {
    throw error;
  }

  return data as Tables<"subjects">[];
};
