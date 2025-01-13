"use client"
import { createContext, useState, useContext, useEffect, Fragment } from 'react';
import type { Dispatch, SetStateAction, ReactNode, MouseEvent } from 'react';

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;
const EMPTY = -1;

type PriorityData = {[key: string]: number[]};

type PriorityContextType = {
    priorityData: PriorityData | undefined;
    setPriorityData: Dispatch<SetStateAction<PriorityData>> | undefined;
}

type UsePriorityContext = () => [PriorityData, Dispatch<SetStateAction<PriorityData>>];

const PriorityContext = createContext<PriorityContextType>({
    priorityData: undefined, 
    setPriorityData: undefined
});

interface PriorityProviderProps {
    children: ReactNode;
}

interface PriorityBoxProps {
    priority: number;
    prioritySchema: {
        min: number;
        max: number;
        empty: number;
    }
    onPrioritychange: (updatedPriority: number) => void;
}

interface TermPriorityProps {
    termId: string;
    schema?: {
        numWeeks?: number,
        weeksPerRow?: number,
    }
    readonly className?: string;
}

interface WeekPriorityProps {
    weekId: string;
    className?: string;
}

export function PriorityProvider({ children }: PriorityProviderProps) {
    const [priorityData, setPriorityData] = useState<PriorityData>({})
    
    return (
        <PriorityContext.Provider value={{
            'priorityData': priorityData, 
            'setPriorityData': setPriorityData
        }}>
            {children}
        </PriorityContext.Provider>
    );
}

export const usePriorityContext: UsePriorityContext = () => {
    const { priorityData, setPriorityData } = useContext(PriorityContext);
    if (priorityData === undefined || setPriorityData === undefined) {
        throw new Error("Cannot use the priority context outside a PriorityProvider");
    }
    return [priorityData, setPriorityData];
}

export function PriorityBox({ priority, prioritySchema, onPrioritychange }: PriorityBoxProps) {
    const { min, max, empty } = prioritySchema;
    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        if (e.button === LEFT_CLICK) {
            let updatedPriority = undefined;
            if (priority === empty) {
                updatedPriority = max;
            } else {
                updatedPriority = priority > min ? priority - 1 : empty;
            }
            onPrioritychange(updatedPriority);
        } 
        if (e.button === RIGHT_CLICK) {
            let updatedPriority = undefined;
            if (priority === empty) {
                updatedPriority = min;
            } else {
                updatedPriority = priority < max ? priority + 1 : empty;
            }
            onPrioritychange(updatedPriority);
        }
    }
    
    return (
        <div 
        className='select-none cursor-pointer bg-blue-500'
        onContextMenu={handleClick} //< for right clicks.
        onClick={handleClick}>{priority}
        </div>

    );
}  

export function TermPriority({ termId, schema, className='' }: TermPriorityProps) {
    const numWeeks = schema && schema['numWeeks'] ? schema['numWeeks'] : 11;
    const weeksPerRow = schema && schema['numWeeks'] ? schema['numWeeks'] : 5;
    const numBlocks = Math.ceil(numWeeks / weeksPerRow);
    const [globalPriorityData, setGlobalPriorityData] = usePriorityContext();
    const [localPriorityData, setLocalPriorityData] = useState<number[]>(
        Array(numWeeks * 2).fill(EMPTY)
    );
    const prioritySchema = {
        min: 1,
        max: numWeeks,
        empty: EMPTY,
    }

    const handleLocalPriorityChange = (index: number, value: number) => {
        setLocalPriorityData((prev) => {
            const updatedLocalPriorityData = [...prev];
            updatedLocalPriorityData[index] = value;
            return updatedLocalPriorityData;
        });
    }
    
    useEffect(() => {
        if (globalPriorityData.hasOwnProperty(termId)) {
            setLocalPriorityData(globalPriorityData[termId]);
        }
    }, []);

    useEffect(() => {
        setGlobalPriorityData((prev) => {
            const updatedPriorityData = {...prev};
            updatedPriorityData[termId] = localPriorityData;
            console.log(updatedPriorityData);
            return updatedPriorityData;
        }); 
    }, [localPriorityData]);

    return (
        <div 
        style={{
            gridTemplateColumns: `repeat(${weeksPerRow + 1}, minmax(0, 1fr))`
        }}
        className={`grid ${className}`}>
            {Array.from({ length: numBlocks }, (_, i) => (
                <Fragment key={i}>
                    {/* Add one empty space to the start of the header row. */}
                    <div className='empty row header' />
                    {Array.from({ length: weeksPerRow }, (_, k) => {
                        const weekNumber = i * weeksPerRow + k + 1;
                        return (
                            weekNumber <= numWeeks && 
                            <div key={k} className='row header'>
                                Week {weekNumber}
                            </div>
                        );
                    })}
                    {/* If this is the last block (and there's more than one block),
                        then add enough padding to move to the start of the next row. */}
                    {(numBlocks > 1 && i === numBlocks - 1) &&
                    Array.from({ length: weeksPerRow - (numWeeks % weeksPerRow)}, (_, k) => {
                        return (
                            <div key={k} className='empty row content'/>
                        );
                    })}
                    {/* Primary row */}
                    <div className='row primary-label'>
                        Primary
                    </div>
                    {Array.from({ length: weeksPerRow }, (_, k) => {
                        const weekNumber = i * weeksPerRow + k + 1;
                        const index = weekNumber - 1;
                        return (
                            weekNumber <= numWeeks && 
                            <PriorityBox
                                key={k}
                                priority={localPriorityData[index]}
                                prioritySchema={prioritySchema}
                                onPrioritychange={
                                    (value) => handleLocalPriorityChange(index, value)
                                }
                            />
                        );
                    })}
                    {/* If this is the last block (and there's more than one block),
                        then add enough padding to move to the start of the next row. */}
                    {(numBlocks > 1 && i === numBlocks - 1) &&
                    Array.from({ length: weeksPerRow - (numWeeks % weeksPerRow)}, (_, k) => {
                        return (
                            <div key={k} className='empty row content'/>
                        );
                    })}
                    {/* Secondary row */}
                    <div className='row secondary-label'>
                        Secondary
                    </div>
                    {Array.from({ length: weeksPerRow }, (_, k) => {
                        const weekNumber = i * weeksPerRow + k + 1;
                        const index = numWeeks + weekNumber - 1;
                        return (
                            weekNumber <= numWeeks && 
                            <PriorityBox
                                key={k}
                                priority={localPriorityData[index]}
                                prioritySchema={prioritySchema}
                                onPrioritychange={
                                    (value) => handleLocalPriorityChange(index, value)
                                }
                            />
                        );
                    })}
                </Fragment>
            ))}
        </div>
    );
}

export function WeekPriority({ weekId, className='' }: WeekPriorityProps) {
    const [globalPriorityData, setGlobalPriorityData] = usePriorityContext();
    const [localPriorityData, setLocalPriorityData] = useState<number[]>(Array(14).fill(EMPTY));
    const NumToDay = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const prioritySchema = {
        min: 1,
        max: 7,
        empty: EMPTY,
    }

    const handleLocalPriorityChange = (index: number, value: number) => {
        setLocalPriorityData((prev) => {
            const updatedLocalPriorityData = [...prev];
            updatedLocalPriorityData[index] = value;
            return updatedLocalPriorityData;
        });
    }

    useEffect(() => {
        if (globalPriorityData.hasOwnProperty(weekId)) {
            setLocalPriorityData(globalPriorityData[weekId]);
        }
    }, []);
    
    useEffect(() => {
        setGlobalPriorityData((prev) => {
            const updatedPriorityData = {...prev};
            updatedPriorityData[weekId] = localPriorityData;
            return updatedPriorityData;
        }); 
    }, [localPriorityData]);

    return (
        <div className={`grid grid-cols-8 ${className}`}>
            <div className='empty row header'></div>
            {Array.from({ length: 7 }, (_, index) =>
                <div key={index} className='row header'>
                    {NumToDay[index]}
                </div>
            )}
            <div className='row primary-label'>
                primary
            </div>
            {Array.from({ length: 7 }, (_, index) =>
                <PriorityBox
                    key={index}
                    priority={localPriorityData[index]}
                    prioritySchema={prioritySchema}
                    onPrioritychange={(value) => handleLocalPriorityChange(index, value)}
                />
            )}
            <div className='row secondary-label'>
                secondary
            </div>
            {Array.from({ length: 7 }, (_, index) =>
                <PriorityBox
                    key={index + 7}
                    priority={localPriorityData[index + 7]}
                    prioritySchema={prioritySchema}
                    onPrioritychange={(value) => handleLocalPriorityChange(index + 7, value)}
                />
            )}
        </div>
    );
}