import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/database.types";

import { QuestionFormState } from "@/types/questions";

export const addQuestions = async (formState: QuestionFormState) => {
  const { data: questions, error } = await supabase
    .from("questions")
    .insert([
      {
        title: formState.title,
        content_text: formState.contentText,
        subjective_answer: formState.subjectiveAnswer,
      },
    ])
    .select();
  if (error) {
    throw error;
  }

  if (formState.contentImage) {
    const path = `question-images/${
      questions[0].id
    }.${formState.contentImage.name.split(".").pop()}`;
    const { error } = await supabase.storage
      .from("questions")
      .upload(path, formState.contentImage);
    if (error) {
      throw error;
    }

    const { data } = await supabase.storage
      .from("questions")
      .getPublicUrl(path);
    if (data.publicUrl) {
      const { error } = await supabase
        .from("questions")
        .update({ content_image: data.publicUrl })
        .eq("id", questions[0].id);
      if (error) {
        console.error(error);
        throw error;
      }
    }
  }

  return questions;
};

export const getRandomQuestion = async (
  userId: string,
  prevQuestionId?: string
) => {
  const { data: forgets } = await supabase
    .from("forgets")
    .select()
    .eq("user_id", userId)
    .gt(
      "dueDate",
      new Date().toISOString().slice(0, 16).replace("T", " ") + ":00"
    );
  // 스킵 대상을 솎아내는 것이므로 gt가 맞음
  const skipIds = forgets?.map((forget) => forget.question_id) ?? [];
  // console.log(skipIds);

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*");
  if (error) {
    throw error;
  }

  const filteredQuestions = questions.filter((questions) => {
    if (skipIds.includes(questions.id) || questions.id === prevQuestionId) {
      return false;
    } else {
      return true;
    }
  });

  const targetQuestion =
    filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
  const { data: targetForget } = await supabase
    .from("forgets")
    .select()
    .eq("user_id", userId)
    .eq("question_id", targetQuestion.id);

  // console.log(
  //   "randomQuestion",
  //   targetQuestion,
  //   targetForget?.[0],
  //   filteredQuestions.length,
  //   questions.length
  // );

  return {
    targetQuestion,
    targetForget: targetForget?.[0],
    remainCount: filteredQuestions.length,
    totalCount: questions.length,
  };
};

export const getQuestions = async () => {
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*");
  if (error) {
    throw error;
  }

  return questions as Tables<"questions">[];
};

export const getQuestionsPaginated = async (page: number, limit: number) => {
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .range(page * limit, (page + 1) * limit - 1);
  if (error) {
    throw error;
  }

  return questions as Tables<"questions">[];
};
