type renderAccordionType = (
    header: ReactNode,
    content: ReactNode,
    isExpanded: boolean,
    onClick: (e: React.MouseEvent) => void,
    index: number
) => ReactNode;

type AccordionHandleClick = (
    setStateAction: Dispatch<SetStateAction<boolean[]>>,
    index: number,
    mouseEvent?: React.MouseEvent,
) => void;

interface AccordionElement {
    children: ReactNode;
    className?: string;
    isExpanded: boolean;
    onClick: () => void;
}

interface AccordionProps {
    className?: string;
    accordionHandleClick?: AccordionHandleClick;
    headers?: ReactNode[];
    contents: ReactNode[];
    render: renderAccordionType;
};