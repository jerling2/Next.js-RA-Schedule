"use client";
import { useEffect, useState, Fragment } from "react";
import { useTypeState } from "@/shared/typeState";
import { useKeyboardContext } from "@/ui";
import { LEFT_CLICK, RIGHT_CLICK } from "@/shared/system";
import { usePriorityContext, usePriorityClipboard, PriorityBox, InteractableLabel, EMPTY, NUM_TO_DAY, NUM_TO_ROLE } from "@/priority";


export function WeekPriority({ state, className='' }: WeekPriorityProps) {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [weekState, updateWeekState] = useTypeState<PriorityWeekState>(state);
    const [handleCopy, handlePaste] = usePriorityClipboard('week');
    const [globalPriorities, updatePriorities] = usePriorityContext();
    const keyboardState = useKeyboardContext();

    // ===================================================================== //
    //                   Handle Click (i.e. Copy & Paste)                    //
    // ===================================================================== //

    const handleClick = (
        e: React.MouseEvent, 
        rowOrCol: 'row' | 'col', 
        iter: number
    ) => {
        e.preventDefault();
        if (!keyboardState.shift) {
            return;
        }
        const { numDays } = weekState.layout;
        switch (e.button) {
            case LEFT_CLICK: {
                if (rowOrCol === 'row') {
                    const start = iter * numDays;
                    const end = start + numDays;
                    const updateTermPriorities: UpdateTermPriorities = (newPriorities) => {
                        updatePriorities(weekState.id, 0, (prev) => (
                            prev.map((value, index) => (
                                index >= start && index < end
                                    ? newPriorities[index % numDays]
                                    : value
                            ))
                        ));
                    }
                    return handlePaste(updateTermPriorities, "row");
                } else {
                    const updateTermPriorities: UpdateTermPriorities = (newPriorities) => {
                        updatePriorities(weekState.id, 0, (prev) => (
                            prev.map((value, index) => (
                                index % numDays === iter
                                    ? newPriorities[Math.floor(index / numDays)]
                                    : value
                            ))
                        ));
                    }
                    return handlePaste(updateTermPriorities, "col");
                }
            } 
            case RIGHT_CLICK: {
                const weekPriorities = globalPriorities[weekState.id][0];
                if (rowOrCol === 'row') {
                    const start = iter * numDays;
                    const end = start + numDays;
                    const priorities = weekPriorities.slice(start, end);
                    return handleCopy(priorities, "row");
                } else {
                    const priorities = weekPriorities.filter((_, index) => (
                        index % numDays === iter
                    ))
                    return handleCopy(priorities, "col");
                }
            } default: {
                throw new Error(`handleClick(e=${e.button}, ...) is not supported`);
            }
        }
    }

    // ===================================================================== //
    //                              Handle Hover                             //
    // ===================================================================== //

    const handleHover = (
        isHover: boolean,
        rowOrCol: 'row' | 'col',
        index: number
    ) => {
        const activeStyle = 'cursor-copy outline outline-green-500 outline-2 z-10';
        const headerOrLabel: keyof InteractiveLabelActiveStyles = rowOrCol === 'row'
            ? 'activeLabel'
            : 'activeHeader';
        if (isHover && keyboardState.shift) {
            updateWeekState('__activeStyles', (prev) => {
                const updatedActiveStyles = prev;
                updatedActiveStyles[headerOrLabel][index] = activeStyle;
                return updatedActiveStyles;
            });
        }
        if (isHover) {
            updateWeekState('__hover', [rowOrCol, index]);
        } else {
            updateWeekState('__activeStyles', (prev) => {
                const updatedActiveStyles = prev;
                updatedActiveStyles[headerOrLabel][index] = '';
                return updatedActiveStyles;
            });
            updateWeekState('__hover', [null, null]);
        }
    }

    useEffect(() => {
        const {__hover, __activeStyles} = weekState;
        if (__hover === undefined || __activeStyles === undefined) {
            return;
        }
        const [rowOrCol, index] = __hover;
        if (rowOrCol === null || index === null) {
            return;
        }
        const headerOrLabel: keyof InteractiveLabelActiveStyles = rowOrCol === 'row'
            ? 'activeLabel'
            : 'activeHeader';
        const activeStyle = 'cursor-copy outline outline-green-500 outline-2 z-10';
        if (keyboardState.shift) {
            updateWeekState('__activeStyles', (prev) => {
                const updatedActiveStyles = prev;
                updatedActiveStyles[headerOrLabel][index] = activeStyle;
                return updatedActiveStyles;
            });
        } else {
            updateWeekState('__activeStyles', (prev) => {
                const updatedActiveStyles = prev;
                updatedActiveStyles[headerOrLabel][index] = '';
                return updatedActiveStyles;
            });
        }
    }, [keyboardState.shift])

    // ===================================================================== //
    //                      Manage Priority Box Children                     //
    // ===================================================================== //

    const createInitialBoxState: CreateInitialBoxState = (boxPriorityLocation, primaryOrSecondary) => ({
        boxPriorityLocation: boxPriorityLocation,
        config: {
            min: 1,
            max: weekState.layout.numDays,
            empty: EMPTY
        },
        activeStyleTemplate: {
            shadowFormat: primaryOrSecondary === 'primary'
                ? 'rgba(255, 255, 0, %%) 0px 0px 3px %%px inset'
                : 'rgba(6, 182, 212, %%) 0px 0px 3px %%px inset',
            opacityFunction: (priority) => (
                priority !== EMPTY
                    ? 1 - (priority / weekState.layout.numDays) 
                    : 0
            ),
            intensityFunction: (priority) => (
                priority !== EMPTY
                    ? 3 * (1 - (priority / weekState.layout.numDays)) 
                    : 0
            )
        },
    });

    // ===================================================================== //
    //                            Initialization                             //
    // ===================================================================== //

    // Initialize intialPriorites && weekState.{__hover, __activeStyles, __boxes}
    useEffect(() => {
        const { numDays, numRoles } = weekState.layout;
        const initialPriorities: number[] = Array(numDays * numRoles).fill(EMPTY);
        updatePriorities(weekState.id, 0, initialPriorities);
        updateWeekState('__activeStyles', {
            activeHeader: Array(numDays).fill(''),
            activeLabel: Array(numRoles).fill('')
        });
        updateWeekState('__boxes', 
            Array.from({ length: numDays * numRoles }, (_, index) =>
            <PriorityBox
                key={index}
                initialState={
                    createInitialBoxState(
                        [weekState.id, 0, index],
                        index - numDays < 0 ? 'primary' : 'secondary'
                    )
                }
            />
        ))
        updateWeekState('__hover', [null, null]);
    }, [weekState.layout]);

    // set isInitialized to true once all states are initialized
    useEffect(() => {
        if (!isInitialized
            && weekState.__activeStyles
            && weekState.__boxes
            && weekState.__hover
            && Object.keys(globalPriorities[weekState.id]).length === 1) {
            setIsInitialized(true);
        }
    }, [weekState.__activeStyles, weekState.__boxes, weekState.__hover])

    // ====================================================================== //
    return (
        isInitialized &&
        <div className={`grid grid-cols-8 ${className} bg-background-2 p-7
        [&>.row.header]:bg-background-3 [&>.row.header]:py-1 [&>.row.header]:w-stretch
        [&>.row.header]:shadow-direct-b gap-y-2 [&>.row.header]:text-center
        [&>.row.label]:bg-clip-text [&>.row.label]:text-transparent [&>.row.label]:bg-gradient-to-r
        [&>.row.label.secondary]:from-cyan-500 [&>.row.label.secondary]:to-blue-500 
        [&>.row.label.primary]:from-orange-500 [&>.row.label.primary]:to-red-500`}>
            <div className='empty row header' />
            {Array.from({ length: weekState.layout.numDays }, (_, index) =>
                <InteractableLabel 
                    key={index}
                    label={NUM_TO_DAY[index]}
                    tags="row header"
                    rowOrCol="col"
                    activeStyle={weekState.__activeStyles['activeHeader'][index]}
                    handleClick={(e) => handleClick(e, 'col', index)}
                    handleHover={(isHover) => handleHover(isHover, 'col', index)}
                />
            )}
            {Array.from({ length: weekState.layout.numRoles }, (_, iter) => 
                <Fragment key={iter}>
                <InteractableLabel 
                    key={iter}
                    label={NUM_TO_ROLE[0]}
                    tags={`row ${NUM_TO_ROLE[iter].toLowerCase()} label`}
                    rowOrCol="row"
                    activeStyle={weekState.__activeStyles['activeLabel'][iter]}
                    handleClick={(e) => handleClick(e, 'row', iter)}
                    handleHover={(isHover) => handleHover(isHover, 'row', iter)}
                />
                {Array.from({ length: weekState.layout.numDays }, (_, index) =>
                    weekState.__boxes[iter * weekState.layout.numDays + index]
                )}
                </Fragment>
            )}
        </div>
    );
}