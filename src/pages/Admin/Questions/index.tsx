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
import AdminAddQuestionDialog from "@/components/admin/Dialog/AddQuestion";

export default function AdminQuestionsPage() {
  const tableInfo: TableInfo[] = [
    {
      title: "종목",
      key: "title",
    },
    {
      title: "문제 타입",
      key: "type",
      render: (value: string) => {
        if (value === "objective") {
          return "객관식";
        } else if (value === "subjective") {
          return "주관식";
        }
      },
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
          <CardTitle>Questions</CardTitle>
          <CardDescription>문제 리스트</CardDescription>
          <AdminAddQuestionDialog />
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
