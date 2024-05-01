import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  QuestionFormState,
  QuestionType,
  questionOptions,
} from "@/types/questions";
import { Tables } from "@/types/database.types";

import { addQuestions } from "@/services/questions";
import { getSubjects } from "@/services/subjects";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminAddQuestionDialog() {
  const [formState, setFormState] = useState<QuestionFormState>({
    title: "",
    contentText: "",
    contentImage: undefined,
    subjectiveAnswer: "",
    type: "subjective",
    wrongAnswers: ["", "", ""],
    subjectId: "",
  });
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [subjectOptions, setSubjectOptions] = useState<Tables<"subjects">[]>(
    []
  );

  //   파일 입력 필드에 대한 참조 생성
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleWrongAnswerChange =
    (index: number) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;

      setFormState((prev) => {
        const wrongAnswers = prev.wrongAnswers ?? ["", "", ""];
        return {
          ...formState,
          wrongAnswers: wrongAnswers.map((answer, i) =>
            i === index ? value : answer
          ),
        };
      });
    };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setFormState({
        ...formState,
        contentImage: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 formState를 사용하여 필요한 로직을 처리합니다.

    try {
      await addQuestions(formState);

      setFormState((prev) => ({
        ...prev,
        title: "",
        contentText: "",
        contentImage: undefined,
        subjectiveAnswer: "",
        wrongAnswers: ["", "", ""],
      }));
      setPreviewImage(undefined);

      // 파일 입력 필드 직접 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadSubjects = async () => {
    getSubjects().then((subjects) => {
      setSubjectOptions(subjects);
      setFormState({
        ...formState,
        subjectId: subjects[0].id,
      });
    });
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>문제 추가</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>문제 추가</DialogTitle>
            <DialogDescription>문제를 추가합니다.</DialogDescription>
          </DialogHeader>

          <div>
            시험 종류:
            <Select
              onValueChange={(value) => {
                setFormState({
                  ...formState,
                  subjectId: value as QuestionType,
                });
              }}
              defaultValue={formState.subjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="시험 종류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            문제 타입:
            <Select
              onValueChange={(value) => {
                setFormState({
                  ...formState,
                  type: value as QuestionType,
                });
              }}
              defaultValue={"subjective"}
            >
              <SelectTrigger>
                <SelectValue placeholder="문제 타입을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {questionOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label htmlFor="title">문제 제목:</label>
            <textarea
              id="title"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded-md w-full p-2"
            />
          </div>
          <div>
            <label htmlFor="contentText">문제 내용 (텍스트):</label>
            <textarea
              id="contentText"
              name="contentText"
              value={formState.contentText}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded-md w-full p-2"
            />
          </div>
          {formState.type === "subjective" && (
            <div>
              <label htmlFor="contentImage">문제 내용 (이미지):</label>
              <input
                type="file"
                id="contentImage"
                name="contentImage"
                onChange={handleImageChange}
                ref={fileInputRef} // 참조 설정
              />
              {previewImage && <img src={previewImage} alt="Preview" />}
            </div>
          )}
          <div>
            <label htmlFor="subjectiveAnswer">답:</label>
            <textarea
              id="subjectiveAnswer"
              name="subjectiveAnswer"
              value={formState.subjectiveAnswer}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded-md w-full p-2"
            />
            {formState.type === "objective" && (
              <>
                <label>오답:</label>
                <textarea
                  id="wrongAnswer1"
                  name="wrongAnswer1"
                  value={formState.wrongAnswers[0]}
                  onChange={handleWrongAnswerChange(0)}
                  className="border-2 border-gray-300 rounded-md w-full p-2"
                />
                <textarea
                  id="wrongAnswer2"
                  name="wrongAnswer2"
                  value={formState.wrongAnswers[1]}
                  onChange={handleWrongAnswerChange(1)}
                  className="border-2 border-gray-300 rounded-md w-full p-2"
                />
                <textarea
                  id="wrongAnswer3"
                  name="wrongAnswer3"
                  value={formState.wrongAnswers[2]}
                  onChange={handleWrongAnswerChange(2)}
                  className="border-2 border-gray-300 rounded-md w-full p-2"
                />
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
