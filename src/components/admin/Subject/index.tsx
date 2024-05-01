import { TableInfo } from "@/types/table";

import { getSubjects, getSubjectsPaginated } from "@/services/subjects";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminTable from "../Table";

export default function AdminSubject() {
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
            getTotalItems={getSubjects}
            getItems={getSubjectsPaginated}
          />
        </CardContent>
      </Card>
    </div>
  );
}
