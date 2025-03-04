import Link from "next/link";

import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { ticketsPath } from "@/utils/path";

export default function NotFound() {
  return (
    <Placeholder
      label="Ticket not found"
      renderButton={(className) => (
        <Button asChild variant="outline" className={className}>
          <Link href={ticketsPath()}>Go to Tickets</Link>
        </Button>
      )}
    />
  );
}
