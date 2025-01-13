import { useState, Fragment} from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type renderAccordionType = (
    header: ReactNode,
    content: ReactNode,
    isExpanded: boolean,
    onClick: () => void,
    index: number
) => ReactNode;

export type AccordionHandleClick = (
    setStateAction: Dispatch<SetStateAction<boolean[]>>,
    index: number
) => void;

export interface AccordionElement {
    children: ReactNode;
    className?: string;
    isExpanded: boolean;
    onClick: () => void;
}

export interface AccordionProps {
    className?: string;
    accordionHandleClick?: AccordionHandleClick;
    headers?: ReactNode[];
    contents: ReactNode[];
    render: renderAccordionType;
};

export function Accordion({ className='', accordionHandleClick=singleExpand, headers=[], contents, render }: AccordionProps) {
    const [expandList, setExpandList] = useState<boolean[]>(Array(contents.length).fill(false));

    const handleClick = (index: number) => {
        accordionHandleClick(setExpandList, index);
    }

    return (
        <div className={className}>
            {contents.map((_, index) => 
                <Fragment key={index}>
                    {render(headers?.[index] ?? '', contents[index], expandList[index], () => handleClick(index), index)}
                </Fragment>
            )}
        </div>
    );
}

export const singleExpand: AccordionHandleClick = (setStateAction, index) => {
    setStateAction((prev) => {
        const updatedList = Array(prev.length).fill(false);
        updatedList[index] = !prev[index];
        return updatedList;
    });
}