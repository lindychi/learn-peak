import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { Link } from "react-router-dom";

type Props = { title: string; link: string; icon: React.ReactNode };

export default function SideTooltip({ title, link, icon }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={link}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:text-neutral-800 hover:bg-neutral-300 md:h-8 md:w-8"
        >
          {icon}
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{title}</TooltipContent>
    </Tooltip>
  );
}
