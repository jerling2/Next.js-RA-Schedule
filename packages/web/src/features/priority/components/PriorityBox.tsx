"use client";
import { useEffect } from "react";
import { LEFT_CLICK, RIGHT_CLICK } from "@/shared/system";
import { useKeyboardContext } from "@/ui"
import { usePriorityClipboard, usePriorityContext } from "@/priority"
import { useTypeState } from "@/shared/typeState";


export function PriorityBox({ initialState }: PriorityBoxProps) {
    const [boxState, updateBoxState] = useTypeState<PriorityBoxState>(initialState)
    const [globalPriorities, updatePriorities] = usePriorityContext();
    const [handleCopy, handlePaste] = usePriorityClipboard('box');
    const keyboardState = useKeyboardContext();
    const [key, blockIdx, index] = boxState.boxPriorityLocation;
    const priority = globalPriorities[key][blockIdx][index];

    const updatePriority: UpdateBoxPriority = (newPriority) => {
        updatePriorities(key, blockIdx, (prev) => (
            prev.map((value, i) => (
                i === index
                    ? newPriority
                    : value
            ))
        ))
    }

    // Update the box shadow when the box's priority changes.
    useEffect(() => {
        const { shadowFormat, opacityFunction, intensityFunction } = boxState.activeStyleTemplate;
        const opacity = opacityFunction(priority);
        const intensity = intensityFunction(priority);
        const shadow = shadowFormat.replace('%%', `${opacity}`).replace('%%', `${intensity}`);
            updateBoxState('__shadow', shadow);
    }, [globalPriorities[key][blockIdx][index]]);

    // Initialize boxState.__focus
    useEffect(() => {
        if (keyboardState.shift && boxState.__isHover) {
            updateBoxState('__focus', '!cursor-copy border-green-500');
        } else {
            updateBoxState('__focus', '');
        }
    }, [keyboardState.shift, boxState.__isHover])

    /** 
     * Priority Box Interactions:
     *   1. shift + left click = PASTE
     *   2. shift + right click = COPY
     *   3. left click = LOWER PRIORITY
     *   4. right click = RAISE PRIORITY
     */
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault() //< Prevent the browser's option menu from displaying after a right click.
        const { min, max, empty } = boxState.config;

        if (keyboardState.shift) {
            if (e.button === LEFT_CLICK) {
                handlePaste(updatePriority);
            } else if (e.button === RIGHT_CLICK) {
                handleCopy(priority);
            }
            return;
        }
        if (e.button === LEFT_CLICK) {
            if (priority === empty) {
                updatePriority(max);
            } else if (priority > min) {
                updatePriority(priority - 1);
            } else {
                updatePriority(empty);
            }
        } else if (e.button === RIGHT_CLICK) {
            if (priority === empty) {
                updatePriority(min);
            } else if (priority < max) {
                updatePriority(priority + 1);
            } else {
                updatePriority(empty);
            }
        }
    }

    return (
        <div 
        style={{
            boxShadow: boxState.__shadow ?? ''
        }}
        className={`priority-box relative select-none cursor-pointer w-[30px] h-[30px]
        place-self-center p-0 flex justify-center items-center bg-background-1 border
        border-background-3 border-2 ${boxState.__focus ?? ''}`}
        onContextMenu={handleClick} //< for right clicks.
        onClick={handleClick}
        onMouseEnter={() => updateBoxState('__isHover', true)}
        onMouseLeave={() => updateBoxState('__isHover', false)}>
            {
            priority !== boxState.config.empty
                ? priority
                : ''
            } 
        </div>
    );
}  