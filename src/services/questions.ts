import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/database.types";

import { QuestionFormState } from "@/types/questions";

export const addQuestions = async (formState: QuestionFormState) => {
  const { data: questions, error } = await supabase
    .from("questions")
    .insert([
      {
        type: formState.type,
        title: formState.title,
        content_text: formState.contentText,
        subjective_answer: formState.subjectiveAnswer,
        wrong_answers: JSON.stringify(formState.wrongAnswers),
        subject_id: formState.subjectId,
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
  subjects: string[],
  prevQuestionId?: string
) => {
  const { data: forgets } = await supabase
    .from("forgets")
    .select()
    .in("subject_id", subjects)
    .eq("user_id", userId)
    .gt(
      "due_date",
      new Date().toISOString().slice(0, 16).replace("T", " ") + ":00"
    );
  // 스킵 대상을 솎아내는 것이므로 gt가 맞음
  const skipIds = forgets?.map((forget) => forget.question_id) ?? [];

  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .in("subject_id", subjects);
  if (error) {
    throw error;
  }

  let filteredQuestions = questions.filter((questions) => {
    if (skipIds.includes(questions.id)) {
      return false;
    } else {
      return true;
    }
  });

  // 마지막 한 문제를 계속 틀릴때는 답변 순서만 바꿔서 출력하도록 설정
  if (filteredQuestions.length > 1) {
    filteredQuestions = filteredQuestions.filter(
      (question) => question.id !== prevQuestionId
    );
  }

  if (filteredQuestions.length === 0) {
    throw new Error("No more questions");
  }

  const targetIndex = Math.floor(Math.random() * filteredQuestions.length);
  const targetQuestion = filteredQuestions[targetIndex];
  const { data: targetForget } = await supabase
    .from("forgets")
    .select()
    .eq("question_id", targetQuestion.id);

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
