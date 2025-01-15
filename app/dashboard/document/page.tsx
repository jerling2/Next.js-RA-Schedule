"use client";
import DashboardHeader from "@/components/DashboardHeader";
import XCircle from "@/public/icons/xCircle.svg"
import CheckCircle from "@/public/icons/checkCircle.svg"
import ChevronDown from "@/public/icons/chevronDown.svg"
import ChevronUp from "@/public/icons/chevronUp.svg"
import { PriorityProvider, PriorityClipboardProvider, TermPriority, WeekPriority, usePriorityContext, usePriorityClipboardContext, LEFT_CLICK, RIGHT_CLICK } from "@/components/PriorityTools";
import { Accordion, renderAccordionType } from "@/components/Accordion";
import { useContext, createContext, useRef } from 'react';
import type { AnimationEvent, MouseEvent } from 'react';

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
        <div className="flex flex-row w-full justify-between"
        onClick={(e: MouseEvent) => handleClick(e)}
        onContextMenu={(e: MouseEvent) => handleClick(e)}>
            <div className="flex flex-row items-center">
                {!checked && <XCircle className="w-[32px] h-[32px] mx-7" />}
                {checked && <CheckCircle className="w-[32px] h-[32px] mx-7" />}
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

    // Make sure the element stays closed after the closing animation plays.
    const handleCloseAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
        if (e.animationName.startsWith('accordionClose') && accordionElementRef.current) {
            accordionElementRef.current.style.height = '0px';
        } 
    }

    // Make sure the element stays open after the opening animation plays.
    const handleAccordionClick = (e: MouseEvent) => {
        if (!isExpanded && accordionElementRef.current && !e.shiftKey) {
            accordionElementRef.current.style.height = 'auto';
        }
    }

    const getChildHeight = (): number => {
        if (!accordionElementRef.current) {
            return 0
        }
        return accordionElementRef.current.children[0].clientHeight ?? 0;
    }

    return (
        <AccordionElementContext.Provider value={isExpanded}>
            {index !== 0 && <hr className="border-background-4"/>}
            <div className={`flex items-center h-12 bg-background-3 select-none cursor-pointer ${isExpanded ? '!bg-secondary' : ''}`}
                onClick={(e) => {onClick(e); handleAccordionClick(e)}}>
                {header}
            </div>
            <div 
                ref={accordionElementRef}
                style={{
                    height: '0px',
                }}
                // The classname is a bit hacked together and very specific to the content size of the particular according i'm rendering.
                // Keyframes are difficult to generate dynamically so I have two predifined keyframes which I'm applying by filtering based on child's content height.
                className={`${isExpanded ? `${getChildHeight() > 300 ? 'animate-accordion-open-400' : 'animate-accordion-open-200'} overflow-hidden transition transition-all select-none h-auto` : `${getChildHeight() > 300 ? 'animate-accordion-close-400' : 'animate-accordion-close-200'} transition transition-all select-none overflow-hidden`}`}
                onAnimationEnd={(e) => handleCloseAnimationEnd(e)}>
                {content}
            </div>
        </AccordionElementContext.Provider>
    );
}

export default function Document() {
    return (
        <div className="relative flex flex-col w-screen h-[100%] [&>*]:px-dynamic-container">
            <DashboardHeader />
            <div className="relative flex justify-center min-w-fit">
                <PriorityClipboardProvider>
                    <PriorityProvider>
                        <Accordion 
                            className="overflow-hidden min-w-[800px] my-16 rounded-xl 
                                bg-background-2"
                            render={renderAccordion}
                            headers={[
                                <HeaderComponent checked={false} header="Weekly Preferences" foreignKey="term-priorities" />,
                                <HeaderComponent checked={true} header="Week 1" foreignKey="week-1-priorities" />,
                                <HeaderComponent checked={true} header="Week 2" foreignKey="week-2-priorities" />,
                                <HeaderComponent checked={true} header="Week 3" foreignKey="week-3-priorities" />,
                                <HeaderComponent checked={true} header="Week 4" foreignKey="week-4-priorities" />,
                                <HeaderComponent checked={true} header="Week 5" foreignKey="week-5-priorities" />,
                                <HeaderComponent checked={true} header="Week 6" foreignKey="week-6-priorities" />,
                                <HeaderComponent checked={true} header="Week 7" foreignKey="week-7-priorities" />,
                                <HeaderComponent checked={true} header="Week 8" foreignKey="week-8-priorities" />,
                                <HeaderComponent checked={true} header="Week 9" foreignKey="week-9-priorities" />,
                                <HeaderComponent checked={true} header="Week 10" foreignKey="week-10-priorities" />,
                                <HeaderComponent checked={true} header="Week 11" foreignKey="week-11-priorities" />,
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
                    </PriorityProvider>
                </PriorityClipboardProvider>
            </div>
        </div>
    );
}