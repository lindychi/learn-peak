import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/database.types";

export const updateOrInsertForget = async (
  userId: string,
  questionId: string,
  weight: number,
  forget?: Tables<"forgets">
) => {
  if (forget) {
    let calcWeight;
    if (weight > 0) {
      if ((forget?.weight ?? 0) > 0) {
        calcWeight = (forget?.weight ?? 0) * 2;
      } else {
        calcWeight = weight;
      }
    } else {
      if ((forget?.weight ?? 0) > 1) {
        calcWeight = (forget?.weight ?? 0) / 2;
      } else {
        calcWeight = weight;
      }
    }

    const dueDate =
      new Date(new Date().getTime() + 1000 * 60 * calcWeight)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ") + ":00";

    const { error } = await supabase
      .from("forgets")
      .update({
        due_date: dueDate,
        weight: calcWeight,
      })
      .eq("id", forget.id);
    if (error) {
      throw error;
    }
  } else {
    let calcWeight = weight;
    if (calcWeight < 0) {
      calcWeight = -1;
    }

    const dueDate =
      new Date(new Date().getTime() + 1000 * 60 * calcWeight)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ") + ":00";

    const { error } = await supabase
      .from("forgets")
      .insert([
        {
          user_id: userId,
          question_id: questionId,
          weight: calcWeight,
          due_date: dueDate,
        },
      ])
      .select();
    if (error) {
      throw error;
    }
  }
};
