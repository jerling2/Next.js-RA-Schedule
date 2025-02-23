interface InteractiveLabelProps {
    label: string;
    activeStyle: string;
    rowOrCol: 'row' | 'col';
    tags: string;
    handleClick: (e: React.MouseEvent) => void;
    handleHover: (isHover: boolean) => void;
}

type InteractiveLabelActiveStyles = {
    activeHeader: string[];
    activeLabel: string[];
}


