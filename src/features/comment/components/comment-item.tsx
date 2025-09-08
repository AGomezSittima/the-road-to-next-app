import { format } from "date-fns";
import React from "react";

import { Content } from "@/components/content";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CommentWithMetadata } from "../types";

export type CommentItemSection = {
  label: string;
  content: React.ReactNode;
};

type CommentItemProps = {
  comment: CommentWithMetadata;
  sections: CommentItemSection[];
  buttons: React.ReactNode[];
};

const CommentItem = ({ comment, sections, buttons }: CommentItemProps) => {
  return (
    <div className="flex gap-x-2">
      <Card className="flex flex-1 flex-col gap-y-1 p-4">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {comment.user?.username ?? "Deleted User"}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(comment.createdAt, "yyyy-MM-dd, HH:mm")}
          </p>
        </div>
        <Content>{comment.content}</Content>

        {sections.map((section) => (
          <div key={section.label} className="mt-2 space-y-2">
            <Separator />

            <h4 className="text-sm text-muted-foreground">{section.label}</h4>

            <div>{section.content}</div>
          </div>
        ))}
      </Card>

      <div className="flex flex-col gap-y-1">{buttons}</div>
    </div>
  );
};

export { CommentItem };
