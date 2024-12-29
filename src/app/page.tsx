import Image from "next/image";
import WeekSelector from "@/components/WeekSelector";
import TermSelctor from "@/components/TermSelector";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <TermSelctor numWeeks={11} weeksPerRow={5} minPriority={1} maxPriority={11} />
      {[...Array(11)].map((_, index) => (
        <WeekSelector key={index} weekNumber={index + 1} minPriority={1} maxPriority={7} />
      ))}
    </div>
  );
}
