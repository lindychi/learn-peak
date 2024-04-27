import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/database.types";

export const updateOrInsertForget = async (
  userId: string,
  questionId: number,
  weight: number,
  forget?: Tables<"forgets">
) => {
  console.log(questionId, weight, forget);
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
    console.log(calcWeight, "<=", forget?.weight, "+", weight);

    const dueDate =
      new Date(new Date().getTime() + 1000 * 60 * calcWeight)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ") + ":00";
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
      calcWeight = -1;
    }
    console.log(calcWeight, "<=", weight);

    const dueDate =
      new Date(new Date().getTime() + 1000 * 60 * calcWeight)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ") + ":00";
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
