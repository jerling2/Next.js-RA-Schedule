interface TermPriorityProps {
    state: PriorityTermState;
    readonly className?: string;
}

interface PriorityTermState {
    id: string;
    layout: {
        numWeeks: number;
        weeksPerRow: number;
        numRoles: number;
    };
    __numBlocks?: number;
    __blockStyles?: InteractiveLabelActiveStyles[];
    __boxes?: PriorityBoxArray[];
    __hover?: [number, 'row' | 'col' | null, number | null];
}

interface TermBlockProps {
    boxes: PriorityBoxArray
    blockIdx: number; 
    numCols: number;
    weeksPerRow: number;
    numRoles: number;
    activeStyles: InteractiveLabelActiveStyles;
    handleClick: (e: React.MouseEvent, rowOrCol: 'row' | 'col', blockIdx: number, index: number) => void;
    handleHover: (isHover: boolean, rowOrCol: 'row' | 'col', blockIdx: number, index: number) => void;
}

type UpdateTermPriorities = (newPriorities: number[]) => void;