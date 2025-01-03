"use client";
import { useState } from 'react';
import WeekSelector from "@/components/WeekSelector";
import TermSelctor from "@/components/TermSelector";
import FormSubmit from "@/components/FormSubmit";


const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const NUM_DAYS = DAYS.length;
const EMPTY = -1;


export default function Form() {
  const numWeeks = 11;
  const weeksPerRow = 5;
  
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

  const handleFormSubmit = (name: string, uoid: string) => {
    const isSucess = Object.entries(preferences).every(([key, arr]) => {
      const index = arr.indexOf(EMPTY);
      if (index !== -1) {
        if (key === "term") {
          const primary_or_secondary = Math.floor(index / numWeeks) === 0 ? "primary" : "secondary";

          setFormError(`*please select a preference for ${primary_or_secondary} on Week ${index % numWeeks + 1} in Term Priority`);
        } else {
          const primary_or_secondary = Math.floor(index / NUM_DAYS) === 0 ? "primary" : "secondary";

          setFormError(`*please select a preference for ${primary_or_secondary} on ${DAYS[index % NUM_DAYS]} in ${key}`);
        }
        return false;
      } 
      return true;
    });
    if (isSucess) {
      handlePostData(JSON.stringify({
        ...preferences,
        'name': name,
        'uoid': uoid,
      }));
    }
  };

  const handlePostData = async (bodyJSON: string) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyJSON
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      } else {
        alert('An unknown error has occured');
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <TermSelctor preferences={preferences['term']} onPreferenceChange={(preferences) => handlePreferenceChange('term', preferences)} numWeeks={numWeeks} weeksPerRow={weeksPerRow} minPriority={1} maxPriority={11} />
      
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
