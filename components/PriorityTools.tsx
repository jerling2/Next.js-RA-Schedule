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
        shadow?: string;
        opacity?: number;
        intensity?: number;
    }
    onPrioritychange: (updatedPriority: number) => void;
    className?: string;
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

export function PriorityBox(
    { priority, prioritySchema, onPrioritychange, className=''}: PriorityBoxProps
) {
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

    
    const shadow = prioritySchema && prioritySchema['shadow'] ? prioritySchema['shadow'].replace(
        '%%', `${prioritySchema['opacity']}`).replace('%%', `${prioritySchema['intensity']}`) : '';

    return (
        <div 
        style={{
            boxShadow: shadow
        }}
        className={`priority-box relative select-none cursor-pointer w-[30px] h-[30px]
        place-self-center p-0 flex justify-center items-center bg-background-1 border
        border-background-3 border-2`}
        onContextMenu={handleClick} //< for right clicks.
        onClick={handleClick}>
            {priority !== empty && priority}
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
        className={`relative grid ${className} bg-background-2 [&>.row.header]:bg-background-3 p-7
        [&>.row.header]:py-1 [&>.row.header]:w-stretch [&>.row.header]:shadow-direct-b box-border
        gap-y-2 [&>.row.header]:text-center [&>.row.label]:bg-clip-text
        [&>.row.label]:text-transparent [&>.row.label]:bg-gradient-to-r
        [&>.row.label.secondary]:from-cyan-500 [&>.row.label.secondary]:to-blue-500 
        [&>.row.label.primary]:from-orange-500 [&>.row.label.primary]:to-red-500`}>
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
                    <div className='row primary label'>
                        Primary
                    </div>
                    {Array.from({ length: weeksPerRow }, (_, k) => {
                        const weekNumber = i * weeksPerRow + k + 1;
                        const index = weekNumber - 1;
                        const priority = localPriorityData[index];
                        return (
                            weekNumber <= numWeeks && 
                            <PriorityBox
                                key={k}
                                priority={priority}
                                prioritySchema={{
                                    ...prioritySchema,
                                    shadow: 'rgba(255, 255, 0, %%) 0px 0px 3px %%px inset',
                                    opacity: priority !== EMPTY ? 1 - (priority / numWeeks) : 0,
                                    intensity: priority !== EMPTY ? 3 * (1 - (priority / numWeeks)) : 0
                                }}
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
                    <div className='row secondary label'>
                        Secondary
                    </div>
                    {Array.from({ length: weeksPerRow }, (_, k) => {
                        const weekNumber = i * weeksPerRow + k + 1;
                        const index = numWeeks + weekNumber - 1;
                        const priority = localPriorityData[index];
                        return (
                            weekNumber <= numWeeks && 
                            <PriorityBox
                                key={k}
                                priority={priority}
                                prioritySchema={{
                                    ...prioritySchema,
                                    shadow: 'rgba(6, 182, 212, %%) 0px 0px 3px %%px inset',
                                    opacity:  priority !== EMPTY ? 1.2 - (priority / numWeeks) : 0,
                                    intensity: priority !== EMPTY ? 3 * (1 - (priority / numWeeks)) : 0
                                }}
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
        <div className={`grid grid-cols-8 ${className} bg-background-2 p-7
        [&>.row.header]:bg-background-3 [&>.row.header]:py-1 [&>.row.header]:w-stretch
        [&>.row.header]:shadow-direct-b gap-y-2 [&>.row.header]:text-center
        [&>.row.label]:bg-clip-text [&>.row.label]:text-transparent [&>.row.label]:bg-gradient-to-r
        [&>.row.label.secondary]:from-cyan-500 [&>.row.label.secondary]:to-blue-500 
        [&>.row.label.primary]:from-orange-500 [&>.row.label.primary]:to-red-500`}>
            <div className='empty row header'></div>
            {Array.from({ length: 7 }, (_, index) =>
                <div key={index} className='row header'>
                    {NumToDay[index]}
                </div>
            )}
            <div className='row primary label'>
                primary
            </div>
            {Array.from({ length: 7 }, (_, index) => {
                const priority = localPriorityData[index];
                return (
                    <PriorityBox
                        key={index}
                        priority={priority}
                        prioritySchema={{
                            ...prioritySchema,
                            shadow: 'rgba(255, 255, 0, %%) 0px 0px 3px %%px inset',
                            opacity:  priority !== EMPTY ? 1 - (priority / 7) : 0,
                            intensity: priority !== EMPTY ? 3 * (1 - (priority / 7)) : 0,
                        }}
                        onPrioritychange={
                            (value) => handleLocalPriorityChange(index, value)
                        }
                    />
                )}
            )}
            <div className='row secondary label'>
                secondary
            </div>
            {Array.from({ length: 7 }, (_, iter) => {
                const index = iter + 7;
                const priority = localPriorityData[index];
                return (
                    <PriorityBox
                        key={index}
                        priority={priority}
                        prioritySchema={{
                            ...prioritySchema,
                            shadow: 'rgba(6, 182, 212, %%) 0px 0px 3px %%px inset',
                            opacity:  priority !== EMPTY ? 1.2 - (priority / 7) : 0,
                            intensity: priority !== EMPTY ? 3 * (1 - (priority / 7)) : 0,
                        }}
                        onPrioritychange={
                            (value) => handleLocalPriorityChange(index, value)
                        }
                    />
                )}
            )}
        </div>
    );
}