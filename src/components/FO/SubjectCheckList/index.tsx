import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Tables } from "@/types/database.types";

import { getSubjects } from "@/services/subjects";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z.object({
  subjects: z.array(z.string()), // subject는 문자열 배열로 가정합니다.
});

export default function SubjectCheckList() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Tables<"subjects">[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema), // Zod 스키마를 사용하여 유효성 검사를 수행합니다.
    defaultValues: {
      subjects:
        (JSON.parse(
          window.localStorage.getItem("subjects") ?? "[]"
        ) as string[]) ?? [],
    },
  });

  const loadSubjects = async () => {
    getSubjects().then((subjects) => {
      setSubjects(subjects);
    });
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="subjects"
          render={() => (
            <FormItem className="flex flex-col gap-1">
              {subjects.map((subject) => (
                <FormField
                  key={subject.id}
                  control={form.control}
                  name="subjects"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={subject.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={
                              Array.isArray(field?.value) &&
                              field.value.includes(subject?.id)
                            }
                            onCheckedChange={(checked) => {
                              const newValue = Array.isArray(field.value)
                                ? checked
                                  ? [...field.value, subject.id]
                                  : field.value.filter(
                                      (value) => value !== subject.id
                                    )
                                : [subject.id]; // if field.value is not an array, initialize it as one
                              window.localStorage.setItem(
                                "subjects",
                                JSON.stringify(newValue)
                              );
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {subject.title}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          onClick={() =>
            navigate("/random", {
              state: { subjects: form.getValues().subjects },
            })
          }
          className="p-2 bg-emerald-500 rounded"
        >
          문제 풀기
        </Button>
      </form>
    </Form>
  );
}
