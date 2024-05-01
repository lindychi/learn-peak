import React from "react";

import { TableInfo } from "@/types/table";

import { getQuestions, getQuestionsPaginated } from "@/services/questions";

import AdminTable from "@/components/admin/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminQuestionsPage() {
  const tableInfo: TableInfo[] = [
    {
      title: "종목",
      key: "title",
    },
    {
      title: "생성일",
      key: "created_at",
      render: (value: string) => {
        if (typeof value === "string") {
          return value.split(".")[0].replace("T", " ");
        }
      },
    },
  ];

  return (
    <div className="px-5">
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>subjects..!</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTable
            tableInfo={tableInfo}
            getTotalItems={getQuestions}
            getItems={getQuestionsPaginated}
          />
        </CardContent>
      </Card>
    </div>
  );
}
