import { supabase } from "../libs/supabase";
import { QuestionFormState } from "../types/questions";

export const addQuestions = async (formState: QuestionFormState) => {
  const { data: questions, error } = await supabase
    .from("questions")
    .insert([
      {
        title: formState.title,
        contentText: formState.contentText,
        answer: formState.answer,
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
      console.log(
        "publicUrl",
        data.publicUrl,
        "targetQuestion",
        questions[0].id
      );
      const { error } = await supabase
        .from("questions")
        .update({ contentImage: data.publicUrl })
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
  prevQuestionId?: number
) => {
  const { data: forgets } = await supabase
    .from("forgets")
    .select()
    .eq("user_id", userId)
    .gt("dueDate", new Date().toISOString().slice(0, 10));
  // 스킵 대상을 솎아내는 것이므로 gt가 맞음
  const skipIds = forgets?.map((forget) => forget.question_id) ?? [];
  console.log(skipIds);

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
  let targetForget;
  if (targetQuestion) {
    targetForget = forgets?.find(
      (forget) => forget.question_id === targetQuestion.id
    );
  }

  console.log(
    "randomQuestion",
    targetQuestion,
    targetForget,
    filteredQuestions.length,
    questions.length
  );

  return {
    targetQuestion,
    targetForget,
    remainCount: filteredQuestions.length,
    totalCount: questions.length,
  };
};
