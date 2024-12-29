"use client";
import { CSSProperties, useState, MouseEvent } from "react";
import PriorityBox from "./PriorityBox";


const NUM_WEEKS = 11;
const WEEKS_PER_ROW = 5;
const NUM_LANES = Math.ceil(NUM_WEEKS / WEEKS_PER_ROW);
const NUM_ROLE_ROWS = NUM_LANES * 2;


const MIN_PRIORITY = 1
const MAX_PRIORITY = NUM_WEEKS;
const MID_PRIORITY = Math.ceil((MAX_PRIORITY + MIN_PRIORITY) / 2);


export default function TermSelctor() {
    const [shiftPriorities, setShiftPriority] = useState<number[]>(Array(NUM_WEEKS * 2).fill(MID_PRIORITY));

    const handleShiftPriorityChange = (index: number, value: number) => {
        const updatedShiftPriorities = [...shiftPriorities];
        updatedShiftPriorities[index] = value;
        console.log(updatedShiftPriorities);
        setShiftPriority(updatedShiftPriorities);
    };

    return (
        <div 
        style={{ "--cols": WEEKS_PER_ROW} as CSSProperties}
        className="flex justify-center select-none">
            <div className="w-4/5 max-w-4xl text-black flex flex-col p-4">
                <div className="flex flex-row text-2xl mb-5 justify-center">
                    Term Priority
                </div>
                <div className="relative grid grid-cols-(var(--cols)) place-items-center text-center">
                    {[...Array(NUM_ROLE_ROWS + NUM_LANES)].map((_, index) => (
                        <div 
                            key={index}
                            className="absolute -top-[0.5px] left-0 right-0 place-self-stretch border-t border-slate-400"
                            style={{ gridRow: `${index + 2}`, gridColumn: '1 / span (var(--cols))' }} 
                        />
                    ))}
                    {[...Array(NUM_LANES)].map((_, index) => {
                        const startWeek = index * WEEKS_PER_ROW + 1;
                        const weeksInRow = Math.min(NUM_WEEKS - (index * WEEKS_PER_ROW), WEEKS_PER_ROW)
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
                    {[...Array(NUM_ROLE_ROWS)].map((_, index) => {
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
                    {[...Array(2)].map((_, offset) => {
                        return ([...Array(NUM_WEEKS)].map((_, index) => {
                            const rowNum = Math.floor(index / WEEKS_PER_ROW) * 3 + (offset + 2);
                            const colNum = index % WEEKS_PER_ROW + 2;
                            const blockIdx = offset * NUM_WEEKS + index;
                            return (
                                <div 
                                    key={blockIdx}
                                    className="h-full aspect-square"
                                    onContextMenu={(e: MouseEvent) => e.preventDefault()} // Prevent menu from opening when user right clicks.
                                    style={{ gridRow: rowNum, gridColumn: colNum}}>
                                    <PriorityBox 
                                        index={blockIdx} 
                                        minPriority={MIN_PRIORITY} 
                                        maxPriority={MAX_PRIORITY} 
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