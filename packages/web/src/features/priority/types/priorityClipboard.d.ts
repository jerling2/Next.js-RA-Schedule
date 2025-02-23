/* ========================================================================= */
/*                         Priority Clipboard Context                        */
/* ========================================================================= */
type PriorityClipboardContext = {
    priorityClipboard: PriorityClipboard | undefined;
    setPriorityClipboard: SetPriorityClipboard | undefined;
};
/* ========================================================================= */
/* ========================================================================= */
/*                       Use Priority Clipboard Context                      */
/* ========================================================================= */
type UsePriorityClipboardContext = [PriorityClipboard, UpdatePriorityClipboard];

type UpdatePriorityClipboard = (
    value: (prev: PriorityClipboard) => PriorityClipboard
) => void;
/* ========================================================================= */
/* ========================================================================= */
/*                           Use Priority Clipboard                          */
/* ========================================================================= */
interface UsePriorityClipboardI {
    box: [
        handleCopy: HandleCopy<'box'>,
        handlePaste: HandlePaste<'box'>
    ];
    term: [
        handleCopy: HandleCopy<'term'>,
        handlePaste: HandlePaste<'term'>
    ];
    week: [
        handleCopy: HandleCopy<'week'>,
        handlePaste: HandlePaste<'week'>
    ];
}

interface CopyI {
    box: (priority: number) => void;
    term: (priorities: number[], rowOrCol: 'row' | 'col') => void;
    week: (priorities: number[], rowOrCol: 'row' | 'col') => void;
}

interface PasteI {
    box: (updatePriority: UpdateBoxPriority) => void;
    term: (updateTermPriorities: UpdateTermPriorities, rowOrCol: 'row' | 'col') => void;
    week: (updateWeekPriorities: UpdateWeekPriorities, rowOrCol: 'row' | 'col') => void;
}

type PriorityClipboard = {
    'box'?: number;
    'termrow'?: number[];
    'termcol'?: number[];
    'weekrow'?: number[];
    'weekcol'?: number[];
}

type HandleCopy<K extends keyof CopyI> = CopyI[K];

type HandlePaste<K extends keyof PasteI> = PasteI[K];

type GetKey = (
    key: keyof UsePriorityClipboardI, 
    rowOrCol?: 'row' | 'col' | ''
) => keyof PriorityClipboard;
/* ========================================================================= */
