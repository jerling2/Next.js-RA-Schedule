"use client";
import { useEffect, useState } from "react";
import { useTypeState } from "@/lib/hooks";
import { usePriorityClipboard, usePriorityContext, EMPTY, PriorityBox, InteractableLabel } from "@/priority";
import { LEFT_CLICK, RIGHT_CLICK } from "@/constants";
import { useKeyboardContext } from "@/ui";


export function TermPriority({ state, className='' }: TermPriorityProps) {
    const [isInitialized, setIsInitialized] = useState<Boolean>(false);
    const [termState, updateTermState] = useTypeState<PriorityTermState>(state);
    const [handleCopy, handlePaste] = usePriorityClipboard('term');
    const [globalPriorities, updatePriorities] = usePriorityContext();
    const keyboardState = useKeyboardContext();

    // ===================================================================== //
    //                   Handle Click (i.e. Copy & Paste)                    //
    // ===================================================================== //

    const handleClick = (
        e: React.MouseEvent, 
        rowOrCol: 'row' | 'col', 
        blockIdx: number, 
        iter: number
    ) => {
        e.preventDefault();
        if (!keyboardState.shift) {
            return;
        }
        const { weeksPerRow, numWeeks } = termState.layout;
        const { __numBlocks } = termState;
        const numCols = __getNumCols(blockIdx, __numBlocks, weeksPerRow, numWeeks)
        switch (e.button) {
            case LEFT_CLICK: {
                if (rowOrCol === 'row') {
                    const start = iter * numCols;
                    const end = start + numCols;
                    const updateTermPriorities: UpdateTermPriorities = (newPriorities) => {
                        updatePriorities(termState.id, blockIdx, (prev) => (
                            prev.map((value, index) => (
                                index >= start && index < end
                                    ? newPriorities[index % numCols] ?? EMPTY
                                    : value
                            ))
                        ));
                    }
                    return handlePaste(updateTermPriorities, "row");
                } else {
                    const updateTermPriorities: UpdateTermPriorities = (newPriorities) => {
                        updatePriorities(termState.id, blockIdx, (prev) => (
                            prev.map((value, index) => (
                                index % numCols === iter
                                    ? newPriorities[Math.floor(index / numCols)]
                                    : value
                            ))
                        ));
                    }
                    return handlePaste(updateTermPriorities, "col");
                }
            } 
            case RIGHT_CLICK: {
                const blockPriorities = globalPriorities[termState.id][blockIdx];
                if (rowOrCol === 'row') {
                    const start = iter * numCols;
                    const end = start + numCols;
                    const priorities = blockPriorities.slice(start, end);
                    return handleCopy(priorities, "row");
                } else {
                    const priorities = blockPriorities.filter((_, index) => (
                        index % numCols === iter
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

    // Listen to changes in the termState.hover to decide whether to apply/remove the activeStyle.
    const handleHover = (
        isHover: boolean,
        rowOrCol: 'row' | 'col',
        blockIdx: number,
        index: number
    ) => {
        const headerOrLabel: keyof InteractiveLabelActiveStyles = rowOrCol === 'row'
            ? 'activeLabel'
            : 'activeHeader';
        const activeStyle = 'cursor-copy outline outline-green-500 outline-2 z-10';

        if (isHover && keyboardState.shift) {
            updateTermState('__blockStyles', (prev) => {
                const updatedBlockStyles = [...prev];
                updatedBlockStyles[blockIdx][headerOrLabel][index] = activeStyle;
                return updatedBlockStyles;
            });
        } 

        if (isHover) {
            updateTermState('__hover', [blockIdx, rowOrCol, index]);
        } else {
            updateTermState('__blockStyles', (prev) => {
                const updatedBlockStyles = [...prev];
                updatedBlockStyles[blockIdx][headerOrLabel][index] = '';
                return updatedBlockStyles;
            });
            updateTermState('__hover', [null, null, null]);
        }
    }

    // Listen for changes in the shift key to decide whether to apply/remove the activeStyle.
    useEffect(() => {
        const {__hover, __blockStyles} = termState;
        if (__hover === undefined || __blockStyles === undefined) {
            return;
        }

        const [blockIdx, rowOrCol, index] = __hover;
        
        if (blockIdx === null || rowOrCol === null || index === null) {
            return;
        }
        
        const headerOrLabel: keyof InteractiveLabelActiveStyles = rowOrCol === 'row'
            ? 'activeLabel'
            : 'activeHeader';
        const activeStyle = 'cursor-copy outline outline-green-500 outline-2 z-10';

        if (keyboardState.shift) {
            updateTermState('__blockStyles', (prev) => {
                const updatedBlockStyles = [...prev];
                updatedBlockStyles[blockIdx][headerOrLabel][index] = activeStyle;
                return updatedBlockStyles;
            });
        } else {
            updateTermState('__blockStyles', (prev) => {
                const updatedBlockStyles = [...prev];
                updatedBlockStyles[blockIdx][headerOrLabel][index] = '';
                return updatedBlockStyles;
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
            max: termState.layout.numWeeks,
            empty: EMPTY
        },
        activeStyleTemplate: {
            shadowFormat: primaryOrSecondary === 'primary'
                ? 'rgba(255, 255, 0, %%) 0px 0px 3px %%px inset'
                : 'rgba(6, 182, 212, %%) 0px 0px 3px %%px inset',
            opacityFunction: (priority) => (
                priority !== EMPTY
                    ? 1 - (priority / termState.layout.numWeeks) 
                    : 0
            ),
            intensityFunction: (priority) => (
                priority !== EMPTY
                    ? 3 * (1 - (priority / termState.layout.numWeeks)) 
                    : 0
            )
        },
    });

    // ===================================================================== //
    //                            Initialization                             //
    // ===================================================================== //
    
    // Initialize initialPriorites && termState.{__hover, __numBlocks, __blockStyles, __boxes}
    useEffect(() => {
        const { numWeeks, weeksPerRow, numRoles } = termState.layout;
        const numBlocks = Math.ceil(numWeeks / weeksPerRow);
        for (let blockIdx = 0; blockIdx < numBlocks; ++blockIdx) {
            const initialPriorities: number[] = Array(numWeeks * numRoles).fill(EMPTY);
            updatePriorities(termState.id, blockIdx, initialPriorities);
        }
        updateTermState('__numBlocks', numBlocks);
        updateTermState('__hover', [null, null, null]);
    }, [termState.layout]);
    
    // Initialize termState.{__blockStyles, __boxes} (dependent on __numBlocks)
    useEffect(() => {
        if (termState.__numBlocks === undefined) {
            return;
        }
        const { numWeeks, weeksPerRow, numRoles } = termState.layout;
        const numBlocks = termState.__numBlocks;
        if (termState.__blockStyles === undefined) {
            updateTermState('__blockStyles', 
                Array.from({ length: numBlocks }, (_, blockIdx) => {
                    const numCols = __getNumCols(blockIdx, numBlocks, weeksPerRow, numWeeks);
                    return {
                        activeHeader: Array(numCols).fill(''),
                        activeLabel: Array(numRoles).fill('')
                    }
            }));
        }
        if (termState.__boxes === undefined) {
            const boxes = Array.from({ length: numBlocks }, (_, blockIdx) => {
                const numCols = __getNumCols(blockIdx, numBlocks, weeksPerRow, numWeeks);
                return Array.from({ length: numCols * numRoles }, (_, index) => 
                    <PriorityBox
                        key={index}
                        initialState={
                            createInitialBoxState(
                                [termState.id, blockIdx, index],
                                index - numCols < 0 ? 'primary' : 'secondary'
                            )
                        }
                    />
                );
            });
            updateTermState('__boxes', boxes);
        }
    }, [termState.layout, termState.__numBlocks]);

    // set isInitialized to true once all states are initialized
    useEffect(() => {
        if (!isInitialized 
            && termState.__blockStyles 
            && termState.__boxes 
            && termState.__hover 
            && termState.__numBlocks
            && Object.keys(globalPriorities[termState.id]).length === termState.__numBlocks) {
            setIsInitialized(true);
            console.log(globalPriorities)
        }
    }, [termState.__blockStyles, termState.__boxes, termState.__hover, termState.__numBlocks])

    // ====================================================================== //

    return (
        isInitialized && 
        <div 
        style={{
            gridTemplateColumns: `repeat(${termState.layout.weeksPerRow + 1}, minmax(0, 1fr))`
        }}
        className={`relative grid ${className} bg-background-2 [&>.row.header]:bg-background-3 p-7
        [&>.row.header]:py-1 [&>.row.header]:w-stretch [&>.row.header]:shadow-direct-b box-border
        gap-y-2 [&>.row.header]:text-center [&>.row.label]:bg-clip-text
        [&>.row.label]:text-transparent [&>.row.label]:bg-gradient-to-r
        [&>.row.label.secondary]:from-cyan-500 [&>.row.label.secondary]:to-blue-500 
        [&>.row.label.primary]:from-orange-500 [&>.row.label.primary]:to-red-500`}>
        {Array.from({ length: termState.__numBlocks }, (_, blockIdx) => {
            const { numWeeks, weeksPerRow, numRoles } = termState.layout;
            const {__numBlocks, __boxes, __blockStyles } = termState;
            const numCols = __getNumCols(blockIdx, __numBlocks, weeksPerRow, numWeeks)
            return <Block 
                key={blockIdx}
                boxes={__boxes[blockIdx]}
                blockIdx={blockIdx}
                weeksPerRow={weeksPerRow}
                numRoles={numRoles}
                numCols={numCols}
                activeStyles={__blockStyles[blockIdx]}
                handleClick={handleClick}
                handleHover={handleHover}
            />
        })}
        </div>
    )
}


function Block(props: TermBlockProps) {
    const numPads = props.weeksPerRow - props.numCols;
    
    return (
        <>
        <div className='empty row header' />
        {Array.from({ length: props.numCols }, (_, index) =>
            <InteractableLabel key={index}
                label={`Week ${props.blockIdx * props.weeksPerRow + index + 1}`}
                rowOrCol='row'
                tags='header'
                activeStyle={props.activeStyles['activeHeader'][index]}
                handleClick={(e) => props.handleClick(e, 'col', props.blockIdx, index)}
                handleHover={(isHover) => props.handleHover(isHover, 'col', props.blockIdx, index)}
            />
        )}
        {/* If this is the last block, then add padding to move to the next row of the grid. */}
        {Array.from({ length: numPads }, (_, index) => 
            <div key={index} className='empty row content' />
        )}
        <InteractableLabel 
            label='Primary'
            rowOrCol='row'
            tags='row primary label'
            activeStyle={props.activeStyles['activeLabel'][0]}
            handleClick={(e) => props.handleClick(e, 'row', props.blockIdx, 0)}
            handleHover={(isHover) => props.handleHover(isHover, 'row', props.blockIdx, 0)}
        />
        {Array.from({ length:props.numCols }, (_, index) => 
            props.boxes[index]
        )}
        {/* If this is the last block, then add padding to move to the next row of the grid. */}
        {Array.from({ length: numPads }, (_, index) => 
            <div key={index} className='empty row content' />
        )}
        <InteractableLabel 
            label='Secondary'
            rowOrCol='row'
            tags='row secondary label'
            activeStyle={props.activeStyles['activeLabel'][1]}
            handleClick={(e) => props.handleClick(e, 'row', props.blockIdx, 1)}
            handleHover={(isHover) => props.handleHover(isHover, 'row', props.blockIdx, 1)}
        />
        {Array.from({ length: props.numCols }, (_, index) => 
            props.boxes[index + props.numCols]
        )}
        </>
    )
}


function __getNumCols(blockIdx: number, numBlocks: number, weeksPerRow: number, numWeeks: number) {
    return blockIdx === numBlocks - 1
        ? Math.min(numWeeks - blockIdx * weeksPerRow)
        : weeksPerRow
};