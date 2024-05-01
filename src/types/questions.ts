export type QuestionType = "objective" | "subjective";

export const questionOptions = [
  {
    key: "objective",
    label: "객관식",
  },
  {
    key: "subjective",
    label: "주관식",
  },
];

export type QuestionFormState = {
  title: string;
  contentText: string;
  contentImage?: File;
  subjectiveAnswer: string;
  type: QuestionType;
  wrongAnswers: string[];
  subjectId: string;
};
