import { LucideLoaderCircle } from "lucide-react";

import { Button } from "../ui/button";

type SubmitButtonProps = { label: string; isPending: boolean };

const SubmitButton = ({ label, isPending }: SubmitButtonProps) => {
  return (
    <Button disabled={isPending} type="submit">
      {isPending && (
        <LucideLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
      )}
      {label}
    </Button>
  );
};

export { SubmitButton };
