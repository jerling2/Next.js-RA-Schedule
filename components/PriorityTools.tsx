"use client"
import { createContext, useState, useContext, useEffect, Fragment } from 'react';
import type { Dispatch, SetStateAction, ReactNode, MouseEvent } from 'react';

export const LEFT_CLICK = 0;
export const RIGHT_CLICK = 2;
const EMPTY = -1;

type PriorityData = {[key: string]: number[]};

type PriorityClipboardData = {
    box?: number;
    termCol?: number[];
    termRow?: number[];
    weekCol?: number[];
    weekRow?: number[];
    weekTbl?: number[];
}

type PriorityClipboardContextType = {
    priorityClipboardData: PriorityClipboardData | undefined;
    setPriorityClipboardData: Dispatch<SetStateAction<PriorityClipboardData>> | undefined;
}

type PriorityContextType = {
    priorityData: PriorityData | undefined;
    setPriorityData: Dispatch<SetStateAction<PriorityData>> | undefined;
}

type UsePriorityContext = () => [
    PriorityData,
    Dispatch<SetStateAction<PriorityData>>
];

type UsePriorityClipboardContext  = () => [
    PriorityClipboardData, 
    Dispatch<SetStateAction<PriorityClipboardData>>
];

const PriorityContext = createContext<PriorityContextType>({
    priorityData: undefined, 
    setPriorityData: undefined
});

const PriorityClipboardContext = createContext<PriorityClipboardContextType>({
    priorityClipboardData: undefined,
    setPriorityClipboardData: undefined
});

interface PriorityProviderProps {
    children: ReactNode;
}

interface PriorityClipboardProviderProps {
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

export function PriorityClipboardProvider({ children }: PriorityClipboardProviderProps) {
    const [priorityClipboardData, setPriorityClipboardData] = useState<PriorityClipboardData>({})
    return (
        <PriorityClipboardContext.Provider value={{
            'priorityClipboardData': priorityClipboardData, 
            'setPriorityClipboardData': setPriorityClipboardData
        }}>
            {children}
        </PriorityClipboardContext.Provider>
    );
}

export const usePriorityClipboardContext: UsePriorityClipboardContext = () => {
    const { priorityClipboardData, setPriorityClipboardData } = useContext(PriorityClipboardContext);
    if (priorityClipboardData === undefined || setPriorityClipboardData === undefined) {
        throw new Error("Cannot use the priority clipboard context outside a PriorityClipboardProvider");
    }
    return [priorityClipboardData, setPriorityClipboardData];
}

export function PriorityBox(
    { priority, prioritySchema, onPrioritychange, className=''}: PriorityBoxProps
) {
    const { min, max, empty } = prioritySchema;
   
    try {
        const [priorityClipboardData, setPriorityClipboardData] = usePriorityClipboardContext();
        var handleCopy = (priority: number) => {
            setPriorityClipboardData((clipboard) => {
                const updatedClipboard = {...clipboard};
                updatedClipboard['box'] = priority;
                return updatedClipboard;
            });
        }
        var handlePaste = () => {
            const pastedValue = priorityClipboardData['box'];
            if (pastedValue !== undefined && pastedValue >= min && pastedValue <= max) {
                onPrioritychange(pastedValue);
            }
        };
    } catch {
        var handleCopy = (priority: number) => {};
        var handlePaste = () => {};
    }

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        if (e.shiftKey && e.button === LEFT_CLICK) {
            handlePaste();
        } else if (e.shiftKey && e.button === RIGHT_CLICK) {
            handleCopy(priority);
        }
        else if (e.button === LEFT_CLICK) {
            let updatedPriority = undefined;
            if (priority === empty) {
                updatedPriority = max;
            } else {
                updatedPriority = priority > min ? priority - 1 : empty;
            }
            onPrioritychange(updatedPriority);
        } 
        else if (e.button === RIGHT_CLICK) {
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
    try {
        const [priorityClipboardData, setPriorityClipboardData] = usePriorityClipboardContext();
        var handleRowCopy = (blockIter: number, rowIter: number) => {
            const index = blockIter * weeksPerRow + rowIter * numWeeks;
            const numElements = index % numWeeks === numWeeks - 1 ? numWeeks % weeksPerRow : weeksPerRow;
            const rowSlice = localPriorityData.slice(index, index + numElements);
            const rowData = rowSlice.concat(Array(weeksPerRow - rowSlice.length).fill(prioritySchema.empty));
            setPriorityClipboardData((clipboard) => {
                const updatedClipboard = {...clipboard};
                updatedClipboard['termRow'] = rowData;
                return updatedClipboard;
            })
        };
        var handleColCopy = (blockIter: number, colIter: number) => {
            const index = blockIter * weeksPerRow + colIter;
            const colData = [localPriorityData[index], localPriorityData[index + numWeeks]];
            setPriorityClipboardData((clipboard) => {
                const updatedClipboard = {...clipboard};
                updatedClipboard['termCol'] = colData;
                return updatedClipboard;
            })
        };
        var handleRowPaste = (blockIter: number, rowIter: number) => {
            const rowData = priorityClipboardData['termRow'];
            if (rowData === undefined) {
                return;
            }
            const index = blockIter * weeksPerRow + rowIter * numWeeks;
            const numElements = index % numWeeks === numWeeks - 1 ? numWeeks % weeksPerRow : weeksPerRow;

            setLocalPriorityData((prev) => {
                const updatedLocalPriorityData = [...prev];
                updatedLocalPriorityData.splice(index, numElements, ...rowData.slice(0, numElements));
                return updatedLocalPriorityData;
            });
        };
        var handleColPaste = (blockIter: number, colIter: number) => {
            const colData = priorityClipboardData['termCol'];
            if (colData === undefined) {
                return;
            }
            const index = blockIter * weeksPerRow + colIter;
            setLocalPriorityData((prev) => {
                const updatedLocalPriorityData = [...prev];
                updatedLocalPriorityData.splice(index, 1, colData[0]);
                updatedLocalPriorityData.splice(index + numWeeks, 1, colData[1]);
                return updatedLocalPriorityData;
            });
        };
    } catch {
        var handleRowCopy = (blockIter: number, rowIter: number) => {};
        var handleColCopy = (blockIter: number, colIter: number) => {};
        var handleRowPaste = (blockIter: number, rowIter: number) => {};
        var handleColPaste = (blockIter: number, colIter: number) => {};
    }


    type ClickOn = "row" | "col";
    const handleClick = (e: MouseEvent, clickOn: ClickOn, block: number, index: number) => {
        e.preventDefault();
        if (!e.shiftKey) {
            return;
        }
        if (clickOn === "row" && e.button === LEFT_CLICK) {
            handleRowPaste(block, index);
        } else if (clickOn === "row" && e.button === RIGHT_CLICK) {
            handleRowCopy(block, index);
        } else if (clickOn === "col" && e.button === LEFT_CLICK) {
            handleColPaste(block, index);
        } else if (clickOn === "col" && e.button === RIGHT_CLICK) {
            handleColCopy(block, index);
        } 
    };

    const handleLocalPriorityChange = (index: number, value: number) => {
        setLocalPriorityData((prev) => {
            const updatedLocalPriorityData = [...prev];
            updatedLocalPriorityData[index] = value;
            return updatedLocalPriorityData;
        });
    };
    
    useEffect(() => {
        if (globalPriorityData.hasOwnProperty(termId)) {
            setLocalPriorityData(globalPriorityData[termId]);
        }
    }, []);

    useEffect(() => {
        if (localPriorityData === globalPriorityData[termId]) {
            return;
        }
        setGlobalPriorityData((prev) => {
            const updatedPriorityData = {...prev};
            updatedPriorityData[termId] = localPriorityData;
            return updatedPriorityData;
        }); 
    }, [localPriorityData]);

    useEffect(() => {
        if (!globalPriorityData.hasOwnProperty(termId)) {
            return;
        }
        if (globalPriorityData[termId] === localPriorityData) {
            return;
        }
        setLocalPriorityData(globalPriorityData[termId]);
    }, [globalPriorityData[termId]]);

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
                            <div key={k} 
                                className='row header'
                                onClick={(e: MouseEvent) => handleClick(e, "col", i, k)}
                                onContextMenu={(e: MouseEvent) => handleClick(e, "col", i, k)}>
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
                    <div className='row primary label'
                        onClick={(e: MouseEvent) => handleClick(e, "row", i, 0)}
                        onContextMenu={(e: MouseEvent) => handleClick(e, "row", i, 0)}>
                        Primary
                    </div>
                    {Array.from({ length: weeksPerRow }, (_, k) => {
                        const weekNumber = i * weeksPerRow + k + 1;
                        const index = weekNumber - 1;
                        const priority = localPriorityData[index]; //< problem
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
                    <div className='row secondary label'
                        onClick={(e: MouseEvent) => handleClick(e, "row", i, 1)}
                        onContextMenu={(e: MouseEvent) => handleClick(e, "row", i, 1)}>
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

    try {
        const [priorityClipboardData, setPriorityClipboardData] = usePriorityClipboardContext();
        var handleRowCopy = (index: number) => {
            const rowData = localPriorityData.slice(index*7, index + 7);
            setPriorityClipboardData((clipboard) => {
                const updatedClipboard = {...clipboard};
                updatedClipboard['weekRow'] = rowData;
                return updatedClipboard;
            })
        };
        var handleColCopy = (index: number) => {
            const colData = [localPriorityData[index], localPriorityData[index + 7]];
            setPriorityClipboardData((clipboard) => {
                const updatedClipboard = {...clipboard};
                updatedClipboard['weekCol'] = colData;
                return updatedClipboard;
            });
        };
        var handleRowPaste = (index: number) => {
            const rowData  = priorityClipboardData['weekRow'];
            if (rowData !== undefined) {
                setLocalPriorityData((prev) => {
                    const updatedLocalPriorities = [...prev];
                    updatedLocalPriorities.splice(index * 7, 7, ...rowData);
                    return updatedLocalPriorities;
                }); 
            }
        };
        var handleColPaste = (index: number) => {
            const colData = priorityClipboardData['weekCol'];
            if (colData !== undefined) {
                setLocalPriorityData((prev) => {
                    const updatedLocalPriorities = [...prev];
                    updatedLocalPriorities.splice(index, 1, colData[0]);
                    updatedLocalPriorities.splice(index + 7, 1, colData[1]);
                    return updatedLocalPriorities;
                }); 
            }
        };
    } catch {
        var handleRowCopy = (index: number) => {};
        var handleColCopy = (index: number) => {};
        var handleRowPaste = (index: number) => {};
        var handleColPaste = (index: number) => {};
    }

    type ClickOn = "row" | "col";
    const handleClick = (e: MouseEvent, clickOn: ClickOn, index: number) => {
        e.preventDefault();
        if (!e.shiftKey) {
            return;
        }
        if (clickOn === 'row' && e.button === LEFT_CLICK) {
            handleRowPaste(index);
        } else if (clickOn === 'row' && e.button === RIGHT_CLICK) {
            handleRowCopy(index);
        } else if (clickOn === 'col' && e.button === LEFT_CLICK) {
            handleColPaste(index);
        } else if (clickOn === 'col' && e.button === RIGHT_CLICK) {
            handleColCopy(index);
        }
    }

    const NumToDay = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const prioritySchema = {
        min: 1,
        max: 7,
        empty: EMPTY,
    };

    const handleLocalPriorityChange = (index: number, value: number) => {
        setLocalPriorityData((prev) => {
            const updatedLocalPriorityData = [...prev];
            updatedLocalPriorityData[index] = value;
            return updatedLocalPriorityData;
        });
    };

    useEffect(() => {
        if (globalPriorityData.hasOwnProperty(weekId)) {
            setLocalPriorityData(globalPriorityData[weekId]);
        }
    }, []);
    
    useEffect(() => {
        if (localPriorityData === globalPriorityData[weekId]) {
            return;
        }
        setGlobalPriorityData((prev) => {
            const updatedPriorityData = {...prev};
            updatedPriorityData[weekId] = localPriorityData;
            return updatedPriorityData;
        }); 
    }, [localPriorityData]);

    useEffect(() => {
        if (!globalPriorityData.hasOwnProperty(weekId)) {
            return;
        }
        if (globalPriorityData[weekId] === localPriorityData) {
            return;
        }
        setLocalPriorityData(globalPriorityData[weekId]);
    }, [globalPriorityData[weekId]]);

    return (
        <div className={`grid grid-cols-8 ${className} bg-background-2 p-7
        [&>.row.header]:bg-background-3 [&>.row.header]:py-1 [&>.row.header]:w-stretch
        [&>.row.header]:shadow-direct-b gap-y-2 [&>.row.header]:text-center
        [&>.row.label]:bg-clip-text [&>.row.label]:text-transparent [&>.row.label]:bg-gradient-to-r
        [&>.row.label.secondary]:from-cyan-500 [&>.row.label.secondary]:to-blue-500 
        [&>.row.label.primary]:from-orange-500 [&>.row.label.primary]:to-red-500`}>
            <div className='empty row header'></div>
            {Array.from({ length: 7 }, (_, index) =>
                <div key={index}
                    className='row header'
                    onClick={(e: MouseEvent) => handleClick(e, "col", index)}
                    onContextMenu={(e: MouseEvent) => handleClick(e, "col", index)}>
                    {NumToDay[index]}
                </div>
            )}
            <div className='row primary label'
                onClick={(e: MouseEvent) => handleClick(e, "row", 0)}
                onContextMenu={(e: MouseEvent) => handleClick(e, "row", 0)}>
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
            <div className='row secondary label'
                onClick={(e: MouseEvent) => handleClick(e, "row", 1)}
                onContextMenu={(e: MouseEvent) => handleClick(e, "row", 1)}>
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