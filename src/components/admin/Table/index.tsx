import React, { useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

import { TableInfo } from "@/types/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type WithId = {
  id: string; // 또는 다른 타입으로 변경 가능
};

type Props<T extends WithId> = {
  pageLimit?: number;
  tableInfo: TableInfo[];
  getTotalItems: () => Promise<T[]>;
  getItems: (page: number, pageLimit: number) => Promise<T[]>;
};

export default function AdminTable<T extends WithId>({
  tableInfo,
  getTotalItems,
  getItems,
  pageLimit = 10,
}: Props<T>) {
  const [page, setPage] = React.useState(0);
  const [pageRange, setPageRange] = React.useState<number[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [items, setItems] = React.useState<T[]>([]);

  useEffect(() => {
    getItems(page, pageLimit).then((subjects) => {
      setItems(subjects);
    });
    getTotalItems().then((subjects) => {
      const pageCount = Math.ceil(subjects.length / pageLimit);
      setPageCount(pageCount);
      const sequentialArray = [];
      for (let i = page + 1 - 3; i <= page + 1 + 3; i++) {
        sequentialArray.push(i);
      }
      setPageRange(sequentialArray);
    });
  }, [page]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {tableInfo.map((row) => (
              <TableHead key={row.key} className={row.className}>
                {row.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((subject) => (
            <TableRow key={subject.id}>
              {tableInfo.map((row) => (
                <TableCell key={row.key} className={row.className}>
                  {row.render ? (
                    <>{row.render(subject[row.key as keyof T] as string)}</>
                  ) : (
                    <>{subject[row.key as keyof T]}</>
                  )}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          {pageRange.map((pageItem) => {
            if (pageItem <= 0) return null;
            if (pageCount < pageItem) return null;
            return (
              <PaginationItem
                key={pageItem}
                onClick={() => {
                  setPage(pageItem - 1);
                }}
              >
                <PaginationLink isActive={pageItem - 1 === page}>
                  {pageItem}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </PaginationContent>
      </Pagination>
    </>
  );
}
