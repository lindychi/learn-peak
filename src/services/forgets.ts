import { supabase } from "../libs/supabase";
import { Tables } from "../types/database.types";

export const updateOrInsertForget = async (
  userId: string,
  questionId: number,
  weight: number,
  forget?: Tables<"forgets">
) => {
  if (forget) {
    let calcWeight = forget?.weight ?? 0 + weight;
    if (calcWeight < 0) {
      calcWeight = 0;
    }

    const dueDate = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * calcWeight
    )
      .toISOString()
      .slice(0, 10);
    console.log("failed dueDate" + dueDate);

    const { error } = await supabase
      .from("forgets")
      .update({
        dueDate: dueDate,
        weight: calcWeight,
      })
      .eq("id", forget.id);
    if (error) {
      throw error;
    }
  } else {
    let calcWeight = weight;
    if (calcWeight < 0) {
      calcWeight = 0;
    }

    const dueDate = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * calcWeight
    )
      .toISOString()
      .slice(0, 10);
    console.log("failed dueDate" + dueDate);

    const { error } = await supabase
      .from("forgets")
      .insert([
        {
          user_id: userId,
          question_id: questionId,
          weight: calcWeight,
          dueDate: dueDate,
        },
      ])
      .select();
    if (error) {
      throw error;
    }
  }
};
