/**
 * WeekSelector component displays a weekly schedule with checkboxes for primary and secondary tasks.
 * The component dynamically generates the days of the week and includes checkboxes for each day.
 * It allows users to check the boxes for "primary" and "secondary" tasks for each day of the week.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.weekNumber - The week number to be displayed in the component.
 * 
 * @returns {JSX.Element} The rendered WeekSelector component.
 */
"use client";
import { useState, MouseEvent } from "react"
import PriorityBox from "./PriorityBox";


interface WeekSelectorProps {
    weekNumber: number;
}

const MIN_PRIORITY = 1; // This is actually the 'highest' priority. Think "golf" score.
const MAX_PRIORITY = 7; // this is actually the 'lowest' priority. Think "golf" score.
const MID_PRIORITY = (MIN_PRIORITY + MAX_PRIORITY) / 2;

export default function WeekSelector({ weekNumber }: WeekSelectorProps) {

    const [shiftPriorities, setShiftPriority] = useState<number[]>(Array(14).fill(MID_PRIORITY));

    const handleShiftPriorityChange = (index: number, value: number) => {
        const updatedShiftPriorities = [...shiftPriorities];
        updatedShiftPriorities[index] = value;
        console.log(updatedShiftPriorities);
        setShiftPriority(updatedShiftPriorities);
    };

    return (
        <div className="flex justify-center select-none">
            <div className="w-4/5 max-w-4xl bg-white text-black flex flex-col p-4">
                <div className="flex flex-row text-2xl mb-5 justify-center">
                    Week {weekNumber}
                </div>
                <div className="relative grid grid-cols-8 place-items-center text-center">
                    <div className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400" style={{ gridRow: '1', gridColumn: '1 / span 8' }}></div>
                    <div className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400" style={{ gridRow: '2', gridColumn: '1 / span 8' }}></div>
                    <div className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400" style={{ gridRow: '3', gridColumn: '1 / span 8' }}></div>
                    <div className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400" style={{ gridRow: '4', gridColumn: '1 / span 8' }}></div>
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                        <div key={day} style={{ gridRow: '1', gridColumn: `${index + 2}` }}>
                            {day}
                        </div>
                    ))}

                    <div className="place-self-stretch text-left" style={{ gridRow: '2', gridColumn: '1' }}>
                        Primary
                    </div>
                    {[...Array(7)].map((_, index) => (
                        <div 
                            key={index}
                            onContextMenu={(e: MouseEvent) => e.preventDefault()} // Prevent menu from opening when user right clicks.
                            className="h-full aspect-square"
                            style={{ gridRow: '2', gridColumn: `${index + 2}`}}>
                            <PriorityBox 
                                index={index} 
                                minPriority={MIN_PRIORITY}
                                maxPriority={MAX_PRIORITY}
                                value={shiftPriorities[index]} 
                                onChange={handleShiftPriorityChange}
                            />
                        </div>
                    ))}
                    <div className="place-self-stretch text-left" style={{ gridRow: '3', gridColumn: '1' }}>
                        Secondary
                    </div>
                    {[...Array(7)].map((_, index) => (
                        <div 
                        key={index}
                        onContextMenu={(e: MouseEvent) => e.preventDefault()} // Prevent menu from opening when user right clicks.
                        className="h-full aspect-square"
                        style={{ gridRow: '3', gridColumn: `${index + 2}`}}>
                        <PriorityBox 
                            index={index + 7} 
                            minPriority={MIN_PRIORITY}
                            maxPriority={MAX_PRIORITY}
                            value={shiftPriorities[index + 7]} 
                            onChange={handleShiftPriorityChange}
                        />
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};