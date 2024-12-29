"use client";
import { CSSProperties, useState, MouseEvent } from "react";
import PriorityBox from "./PriorityBox";

interface TermSelectorProps {
    numWeeks: number,
    weeksPerRow: number,
    minPriority: number,
    maxPriority: number
};

export default function TermSelctor(
    { numWeeks, weeksPerRow, minPriority, maxPriority }: TermSelectorProps) {

    const numLanes = Math.ceil(numWeeks / weeksPerRow);
    const numRoleRows = numLanes * 2;
    const midPriority = Math.ceil((maxPriority + minPriority) / 2);
    
    const [shiftPriorities, setShiftPriority] = useState<number[]>(Array(numWeeks * 2).fill(midPriority));

    const handleShiftPriorityChange = (index: number, value: number) => {
        const updatedShiftPriorities = [...shiftPriorities];
        updatedShiftPriorities[index] = value;
        console.log(updatedShiftPriorities);
        setShiftPriority(updatedShiftPriorities);
    };

    return (
        <div 
        style={{ "--cols": weeksPerRow} as CSSProperties}
        className="flex justify-center select-none">
            <div className="w-4/5 max-w-4xl text-black flex flex-col p-4">
                
                {/* Table Title */}
                <div className="flex flex-row text-2xl mb-5 justify-center">
                    Term Priority
                </div>
               
                <div className="relative grid grid-cols-(var(--cols)) place-items-center text-center">
                
                    {/* Gridlines */}
                    {[...Array(numRoleRows + numLanes)].map((_, index) => (
                        <div 
                            key={index}
                            className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400"
                            style={{ gridRow: `${index + 2}`, gridColumn: '1 / span (var(--cols))' }} 
                        />
                    ))}
                  
                    {/* Table Headers */}
                    {[...Array(numLanes)].map((_, index) => {
                        const startWeek = index * weeksPerRow + 1;
                        const weeksInRow = Math.min(numWeeks - (index * weeksPerRow), weeksPerRow)
                        const rowNum = `${index * 3 + 1}`;
                        return ([...Array(weeksInRow)].map((_, index) => (
                            <div 
                                key={index}
                                className="mt-4"
                                style={{ gridRow: rowNum, gridColumn: `${index + 2}`}}>
                                Week {startWeek + index}
                            </div>    
                        )));
                    })}
                    
                    {/* Primary & Secondary Labels */}
                    {[...Array(numRoleRows)].map((_, index) => {
                        const rowNum = `${index + 2 + Math.floor(index / 2)}`;
                        return (
                            <div 
                                key={index} 
                                className="place-self-stretch text-left"
                                style={{ gridRow: rowNum, gridColumn: '1' }}>
                                {index % 2 === 0 ? 'Primary' : 'Secondary'}
                            </div>
                        );
                    })}

                    {/* Priority Boxes */}
                    {[...Array(2)].map((_, offset) => {
                        return ([...Array(numWeeks)].map((_, index) => {
                            const rowNum = Math.floor(index / weeksPerRow) * 3 + (offset + 2);
                            const colNum = index % weeksPerRow + 2;
                            const blockIdx = offset * numWeeks + index;
                            return (
                                <div 
                                    key={blockIdx}
                                    className="h-full aspect-square"
                                    onContextMenu={(e: MouseEvent) => e.preventDefault()} // Prevent menu from opening when user right clicks.
                                    style={{ gridRow: rowNum, gridColumn: colNum}}>
                                    <PriorityBox 
                                        index={blockIdx} 
                                        minPriority={minPriority} 
                                        maxPriority={maxPriority} 
                                        value={shiftPriorities[blockIdx]} 
                                        onChange={handleShiftPriorityChange}/>
                                </div>
                            );
                        }));
                    })}
                    
                </div>
            </div>
        </div>
    );
};