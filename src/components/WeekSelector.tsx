"use client";
import { useState, MouseEvent, CSSProperties } from "react"
import PriorityBox from "./PriorityBox";

interface WeekSelectorProps {
    weekNumber: number;
    minPriority: number;
    maxPriority: number;
}

export default function WeekSelector({ weekNumber, minPriority, maxPriority }: WeekSelectorProps) {
    const numRows = 3;
    const numCols = 8;
    const [shiftPriorities, setShiftPriority] = useState<number[]>(Array(14).fill(-1));

    const handleShiftPriorityChange = (index: number, value: number) => {
        const updatedShiftPriorities = [...shiftPriorities];
        updatedShiftPriorities[index] = value;
        setShiftPriority(updatedShiftPriorities);
    };

    return (
        <div 
        style={{'--cols': numCols} as CSSProperties}
        className="flex justify-center select-none">
            <div className="w-4/5 max-w-4xl bg-white text-black flex flex-col p-4">
               
                {/* Table Title */}
                <div className="flex flex-row text-2xl mb-5 justify-center">
                    Week {weekNumber}
                </div>

                <div className="relative grid grid-cols-[var(--cols)] place-items-center text-center">
                    {/* Gridlines */}
                    {[...Array(numRows)].map((_, index) => (
                        <div
                            key={index}
                            className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400"
                            style={{ gridRow: `${index + 2}`, gridColumn: '1 / span var(--cols)' }}
                        />
                    ))}

                    {/* Table headers */}
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                        <div key={day} style={{ gridRow: '1', gridColumn: `${index + 2}` }}>
                            {day}
                        </div>
                    ))}

                    {/* Primary and Secondary labels */}
                    <div className="place-self-stretch text-left" style={{ gridRow: '2', gridColumn: '1' }}>
                        Primary
                    </div>
                    <div className="place-self-stretch text-left" style={{ gridRow: '3', gridColumn: '1' }}>
                        Secondary
                    </div>
                    
                    {/* Priority boxes */}
                    {[...Array(2)].map((_, rowIter) => {
                        return ([...Array(7)].map((_, colIter) => {
                            const rowNum = `${rowIter + 2}`;
                            const colNum = `${colIter + 2}`;
                            const blockIdx = rowIter * 7 + colIter;
                            return (
                                <div
                                    key={blockIdx}
                                    onContextMenu={(e: MouseEvent) => e.preventDefault()} // Prevent menu from opening when user right clicks.
                                    className="h-full aspect-square"
                                    style={{ gridRow: rowNum, gridColumn: colNum }}>
                                    <PriorityBox 
                                        index={blockIdx} 
                                        minPriority={minPriority}
                                        maxPriority={maxPriority}
                                        value={shiftPriorities[blockIdx]} 
                                        onChange={handleShiftPriorityChange}
                                    />
                                </div>
                            );
                        }));
                    })}
                </div>
            </div>
        </div>
    );
};