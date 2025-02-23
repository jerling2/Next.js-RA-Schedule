"use client";
import { usePriorityClipboardContext } from "@/priority";

const __getKey: GetKey = (key, rowOrCol='') => {
    return key + rowOrCol as keyof PriorityClipboard;
}

export const usePriorityClipboard = <K extends keyof UsePriorityClipboardI>(
    key: K
): UsePriorityClipboardI[K] => {
    const [priorityClipboard, updatePriorityClipboard] = usePriorityClipboardContext();
    switch (key) {
        case 'box': {
            const handleCopy: HandleCopy<'box'> = (priority) => {
                const clipboardKey = key as 'box'
                updatePriorityClipboard((prev) => ({
                    ...prev,
                    [clipboardKey]: priority,
                }));
            };
            const handlePaste: HandlePaste<'box'> = (UpdateBoxPriority) => {
                const clipboardKey = key as 'box'
                if (priorityClipboard[clipboardKey] === undefined) {
                    return;
                }
                UpdateBoxPriority(priorityClipboard[clipboardKey]);
            };
            return [handleCopy, handlePaste] as UsePriorityClipboardI[K];
        } case 'term': {
            const handleCopy: HandleCopy<'term'> = (priorities, rowOrCol) => {
                const clipboardKey = __getKey(key, rowOrCol);
                updatePriorityClipboard((prev) => ({
                    ...prev,
                    [clipboardKey]: priorities,
                }));
            };
            const handlePaste: HandlePaste<'term'> = (updateTermPriorities, rowOrCol) => {
                const clipboardKey = __getKey(key, rowOrCol);
                if (priorityClipboard[clipboardKey] === undefined) {
                    return;
                }
                updateTermPriorities(priorityClipboard[clipboardKey] as number[]);
            };
            return [handleCopy, handlePaste] as UsePriorityClipboardI[K];
        } case 'week': {
            const handleCopy: HandleCopy<'week'> = (priorities, rowOrCol) => {
                const clipboardKey = __getKey(key, rowOrCol);
                updatePriorityClipboard((prev) => ({
                    ...prev,
                    [clipboardKey]: priorities,
                }));
            };
            const handlePaste: HandlePaste<'week'> = (updateWeekPriorities, rowOrCol) => {
                const clipboardKey = __getKey(key, rowOrCol);
                if (priorityClipboard[clipboardKey] === undefined) {
                    return;
                }
                updateWeekPriorities(priorityClipboard[clipboardKey]);
            };
            return [handleCopy, handlePaste] as UsePriorityClipboardI[K];
        } default: {
            throw new Error(`usePriorityClipboard(key='${key}') is not supported.`)
        }
    }
}