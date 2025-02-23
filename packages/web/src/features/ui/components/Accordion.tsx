"use client";
import { useState, Fragment} from 'react';


export function Accordion({ className='', accordionHandleClick=singleExpand, headers=[], contents, render }: AccordionProps) {
    const [expandList, setExpandList] = useState<boolean[]>(Array(contents.length).fill(false));

    const handleClick = (e: React.MouseEvent, index: number) => {
        accordionHandleClick(setExpandList, index, e);
    }

    return (
        <div className={className}>
            {contents.map((_, index) => 
                <Fragment key={index}>
                    {render(headers?.[index] ?? '', contents[index], expandList[index], (e) => handleClick(e, index), index)}
                </Fragment>
            )}
        </div>
    );
}


export const singleExpand: AccordionHandleClick = (setStateAction, index, mouseEvent) => {
    if (mouseEvent && mouseEvent.shiftKey) {
        return
    }
    setStateAction((prev) => {
        const updatedList = Array(prev.length).fill(false);
        updatedList[index] = !prev[index];
        return updatedList;
    });
}