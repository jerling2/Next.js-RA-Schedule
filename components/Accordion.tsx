import { useEffect, useState, Fragment} from 'react';
import type { ReactNode, ReactElement } from 'react';


interface AccordionContainerProps {
    contents: ReactNode[];
    render: (content: ReactNode, index: number) => ReactElement<typeof AccordionElement>;
};

export function AccordionContainer({ contents, render }: AccordionContainerProps) {
    return (
        <div>
            {contents.map((_, index) => 
                <Fragment key={index}>
                    {render(contents[index], index)}
                </Fragment>
            )}
        </div>
    );
}

interface AccordionElementProps {
    children: ReactNode;
    index: number;
};

export function AccordionElement({ children, index }: AccordionElementProps) {
    useEffect(() => {
        console.log(`my index is ${index}`);
    }, []);

    return (
        <div>
            {children}
        </div>
    );
}