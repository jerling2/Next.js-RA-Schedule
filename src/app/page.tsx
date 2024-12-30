"use client";
import { useState } from 'react';
import WeekSelector from "@/components/WeekSelector";
import TermSelctor from "@/components/TermSelector";
import FormSubmit from "@/components/FormSubmit";


const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Home() {
  const numWeeks = 11;
  
  const [preferences, setPreferences] = useState<{ [key: string]: number[] }>(
    Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`)
      .reduce<{ [key: string]: number[] }>((acc, key) => {
        acc[key] = Array(14).fill(1); 
        return acc}, 
        {'term': Array(numWeeks * 2).fill(1)}
    )
  );

  const [formError, setFormError] = useState<string>("");

  const handlePreferenceChange = (key: string, preferences: number[]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: preferences,
    }));
  };

  const handleFormSubmit = () => {
    const isSucess = Object.entries(preferences).every(([key, arr]) => {
      const index = arr.indexOf(-1);
      if (index !== -1) {
        const primary_or_secondary = index % 2 === 0 ? "primary" : "secondary";
        if (key === "term") {
          setFormError(`*please select a preference for ${primary_or_secondary} on Week ${index % numWeeks + 1} in Term Priority`);
        } else {
          setFormError(`*please select a preference for ${primary_or_secondary} on ${DAYS[index % 7]} in ${key}`);
        }
        return false;
      } 
      return true;
    });
    if (isSucess) {
      console.log("Form submitted! - implement this.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <TermSelctor preferences={preferences['term']} onPreferenceChange={(preferences) => handlePreferenceChange('term', preferences)} numWeeks={numWeeks} weeksPerRow={5} minPriority={1} maxPriority={11} />
      
      {[...Array(11)].map((_, index) => {
        const weekIdx = `Week ${index + 1}`;
        return (
          <WeekSelector key={index} preferences={preferences[weekIdx]} onPreferenceChange={(preferences) => handlePreferenceChange(weekIdx, preferences)} weekNumber={index + 1} minPriority={1} maxPriority={7} />
        );
      })}

      <FormSubmit onFormSubmit={handleFormSubmit} formError={formError} />

    </div>
  );
}
