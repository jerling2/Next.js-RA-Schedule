"use client";
import DashboardHeader from "@/components/DashboardHeader";
import XCircle from "@/public/icons/xCircle.svg"
import CheckCircle from "@/public/icons/checkCircle.svg"
import ChevronDown from "@/public/icons/chevronDown.svg"
import ChevronUp from "@/public/icons/chevronUp.svg"
import { PriorityProvider, PriorityClipboardProvider, TermPriority, WeekPriority, usePriorityContext, usePriorityClipboardContext, LEFT_CLICK, RIGHT_CLICK } from "@/components/PriorityTools";
import { Accordion, renderAccordionType } from "@/components/Accordion";
import { useContext, createContext, useRef, useState, useEffect } from 'react';
import type { AnimationEvent, MouseEvent } from 'react';
type DOMKeyboardEvent = KeyboardEvent;

const AccordionElementContext = createContext<boolean>(false);

interface HeaderComponentProps {
    checked: boolean;
    header: string;
    foreignKey?: string;
}

function HeaderComponent({ checked, header, foreignKey='' }: HeaderComponentProps) {
    const isExpanded = useContext(AccordionElementContext);
    const [globalPriorityData, setGlobalPriorityData] = usePriorityContext();
    const [priorityClipboardData, setPriorityClipboardData] = usePriorityClipboardContext();

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        if (!e.shiftKey) {
            return;
        }
        if (foreignKey.startsWith('week') && e.button === LEFT_CLICK) {
            const clipboardData = priorityClipboardData['weekTbl'];
            if (clipboardData === undefined) {
                return;
            } 
            setGlobalPriorityData((prev) => {
                const updatedGlobalPriorityData = {...prev};
                updatedGlobalPriorityData[foreignKey] = clipboardData;
                return updatedGlobalPriorityData;
            });
        } else if (foreignKey.startsWith('week') && e.button === RIGHT_CLICK) {
            setPriorityClipboardData((prev) => {
                const updatedClipboard = {...prev};
                updatedClipboard['weekTbl'] = globalPriorityData[foreignKey];
                return updatedClipboard;
            });
        }
    }

    return (
        <div className="relative flex flex-row w-full justify-between"
        onClick={(e: MouseEvent) => handleClick(e)}
        onContextMenu={(e: MouseEvent) => handleClick(e)}>
            <div className="flex flex-row items-center">
                {!checked && <XCircle className="w-[32px] h-[32px] mx-7" />}
                {checked && <CheckCircle className="w-[32px] h-[32px] mx-7 text-green-500" />}
                <div className="ml-2 text-xl font-bold">
                    {header}
                </div>
            </div>
            {!isExpanded && <ChevronDown className="w-[24px] h-[24px] mr-7" />}
            {isExpanded && <ChevronUp className="w-[24px] h-[24px] mr-7" />}
        </div>
    );
}

const renderAccordion: renderAccordionType = (header, content, isExpanded, onClick, index) => {
    const accordionElementRef = useRef<HTMLDivElement | null>(null);
    const [contentCollapsed, setContentCollapsed] = useState<boolean>(true);
    const [childHeight, setChildHeight] = useState<number>(0);
    const [mouseEnter, setMouseEnter] = useState<boolean>(false);
    const [shiftPress, setShiftPress] = useState<boolean>(false);
    const [copyOutlineStyle, setCopyOutlineStyle] = useState<{[key: string]: string}>({});

    const handleCloseAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
        if (e.animationName.startsWith('accordionClose') && accordionElementRef.current) {
            accordionElementRef.current.style.height = '0px';
            setContentCollapsed(true);
        } 
    };

    const handleKeyDown = (e: DOMKeyboardEvent) => {
        if (e.key === "Shift") {
            setShiftPress(true);
        }
    };

    const handleKeyUp = (e: DOMKeyboardEvent) => {
        if (e.key === "Shift") {
            setShiftPress(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }, [])

    useEffect(() => {
        if (isExpanded && accordionElementRef.current) {
            accordionElementRef.current.style.height = 'auto';
            setContentCollapsed(false);
        }
    }, [isExpanded]);

    useEffect(() => {
        if (accordionElementRef.current) {
            setChildHeight(accordionElementRef.current.children[0].clientHeight ?? 0);
        }
    }, [accordionElementRef])

    useEffect(() => {
        if (shiftPress && mouseEnter) {
            setCopyOutlineStyle({
                boxShadow: 'rgb(34, 197, 94) 0 0 1px 2px inset, rgb(34, 197, 94) 0 0 2px 2px inset',
                cursor: 'copy'
            });
        } else {
            setCopyOutlineStyle({cursor: 'pointer'});
        }
    }, [shiftPress, mouseEnter])

    return (
        <AccordionElementContext.Provider value={isExpanded}>
            {index !== 0 && <hr className="border-background-4"/>}
            <div
                onMouseEnter={() => setMouseEnter(true)} 
                onMouseLeave={() => setMouseEnter(false)}
                className={`flex ${index === 0 ? 'rounded-t-xl' : ''} ${index === 11 && contentCollapsed ? 'rounded-b-xl' : ''} items-center h-12 bg-background-3 select-none ${isExpanded ? '!bg-secondary' : ''}`}
                style={copyOutlineStyle}
                onClick={(e) => {onClick(e)}}>
                {header}
            </div>
            <div 
                ref={accordionElementRef}
                style={{
                    height: '0px',
                }}
                // The classname is a bit hacked together and very specific to the content size of the particular according i'm rendering.
                // Keyframes are difficult to generate dynamically so I have two predifined keyframes which I'm applying by filtering based on child's content height.
                className={`${isExpanded ? `${childHeight > 300 ? 'animate-accordion-open-400' : 'animate-accordion-open-200'} overflow-hidden transition transition-all select-none h-auto` : `${childHeight > 300 ? 'animate-accordion-close-400' : 'animate-accordion-close-200'} transition transition-all select-none overflow-hidden`}`}
                onAnimationEnd={(e) => handleCloseAnimationEnd(e)}>
                {content}
            </div>
        </AccordionElementContext.Provider>
    );
}

function AccordionContainer() {
    /**
     * Note to future self: this is an awful way of doing this because of the k * n complexity
     * of iterating through all the lists whenever the global state changes. Please change this
     * for the final version. Thank you!
     * */
    const x = usePriorityContext()[0];
    return <Accordion 
        className="overflow-hidden min-w-[800px] my-16 rounded-xl 
            bg-background-2"
        render={renderAccordion}
        headers={[
            <HeaderComponent checked={x['term-priorities']?.every(y => y !== -1) ?? false} header="Weekly Preferences" foreignKey="term-priorities" />,
            <HeaderComponent checked={x['week-1-priorities']?.every(y => y !== -1) ?? false} header="Week 1" foreignKey="week-1-priorities" />,
            <HeaderComponent checked={x['week-2-priorities']?.every(y => y !== -1) ?? false} header="Week 2" foreignKey="week-2-priorities" />,
            <HeaderComponent checked={x['week-3-priorities']?.every(y => y !== -1) ?? false} header="Week 3" foreignKey="week-3-priorities" />,
            <HeaderComponent checked={x['week-4-priorities']?.every(y => y !== -1) ?? false} header="Week 4" foreignKey="week-4-priorities" />,
            <HeaderComponent checked={x['week-5-priorities']?.every(y => y !== -1) ?? false} header="Week 5" foreignKey="week-5-priorities" />,
            <HeaderComponent checked={x['week-6-priorities']?.every(y => y !== -1) ?? false} header="Week 6" foreignKey="week-6-priorities" />,
            <HeaderComponent checked={x['week-7-priorities']?.every(y => y !== -1) ?? false} header="Week 7" foreignKey="week-7-priorities" />,
            <HeaderComponent checked={x['week-8-priorities']?.every(y => y !== -1) ?? false} header="Week 8" foreignKey="week-8-priorities" />,
            <HeaderComponent checked={x['week-9-priorities']?.every(y => y !== -1) ?? false} header="Week 9" foreignKey="week-9-priorities" />,
            <HeaderComponent checked={x['week-10-priorities']?.every(y => y !== -1) ?? false} header="Week 10" foreignKey="week-10-priorities" />,
            <HeaderComponent checked={x['week-11-priorities']?.every(y => y !== -1) ?? false} header="Week 11" foreignKey="week-11-priorities" />,
        ]}
        contents={[
            <TermPriority termId="term-priorities" />,
            <WeekPriority weekId="week-1-priorities" />,
            <WeekPriority weekId="week-2-priorities" />,
            <WeekPriority weekId="week-3-priorities" />,
            <WeekPriority weekId="week-4-priorities" />,
            <WeekPriority weekId="week-5-priorities" />,
            <WeekPriority weekId="week-6-priorities" />,
            <WeekPriority weekId="week-7-priorities" />,
            <WeekPriority weekId="week-8-priorities" />,
            <WeekPriority weekId="week-9-priorities" />,
            <WeekPriority weekId="week-10-priorities" />,
            <WeekPriority weekId="week-11-priorities" />
        ]}
    />
}

export default function Document() {
    return (
        <div className="relative flex flex-col w-screen h-[100%] [&>*]:px-dynamic-container">
            <DashboardHeader />
            <div className="relative flex justify-center min-w-fit">
                <PriorityClipboardProvider>
                    <PriorityProvider>
                        <AccordionContainer />
                    </PriorityProvider>
                </PriorityClipboardProvider>
            </div>
        </div>
    );
}