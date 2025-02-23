type PriorityWeekState = {
    id: string;
    layout: {
        numDays: number;
        numRoles: number;
    };
    __activeStyles?: InteractiveLabelActiveStyles;
    __boxes?: PriorityBoxArray;
    __hover?: ['row' | 'col' | null, number | null];
}

interface WeekPriorityProps {
    state: PriorityWeekState;
    className?: string;
}

interface WeekLabelProps {
    label: string;
    activeStyle: string;
    rowOrCol: 'row' | 'col';
    tags: string;
    handleClick: (e: React.MouseEvent) => void;
    handleHover: (isHover: boolean) => void;
}