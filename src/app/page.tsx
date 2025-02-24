import { ticketsPath } from "@/path";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h2 className="text-2xl">Home Page</h2>

      <Link href={ticketsPath()} className="underline">
        Go to tickets
      </Link>
    </div>
  );
};

export default HomePage;
