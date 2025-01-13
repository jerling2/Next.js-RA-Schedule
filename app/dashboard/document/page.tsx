"use client";
import DashboardHeader from "@/components/DashboardHeader";
import XCircle from "@/public/icons/xCircle.svg"
import CheckCircle from "@/public/icons/checkCircle.svg"
import ChevronDown from "@/public/icons/chevronDown.svg"
import ChevronUp from "@/public/icons/chevronUp.svg"
import { PriorityProvider, TermPriority, WeekPriority } from "@/components/PriorityTools";
import { Accordion, renderAccordionType } from "@/components/Accordion";
import { useContext, createContext } from 'react';

const AccordionElementContext = createContext<boolean>(false);

interface HeaderComponentProps {
    checked: boolean;
    header: string;
}

function HeaderComponent({ checked, header }: HeaderComponentProps) {
    const isExpanded = useContext(AccordionElementContext);
    return (
        <div className="flex flex-row w-full justify-between">
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
    return (
        <AccordionElementContext.Provider value={isExpanded}>
            {index !== 0 && <hr className="border-background-4"/>}
            <div className={`flex items-center h-12 bg-background-3 select-none cursor-pointer ${isExpanded ? '!bg-blue-500' : ''}`}
                onClick={onClick}>
                {header}
            </div>
            {isExpanded && 
            <div className='transition transition-all duration-1000 select-none'>
                {content}
            </div>}
        </AccordionElementContext.Provider>
    );
}

export default function Document() {
    
    return (
        <div className="relative flex flex-col w-screen h-screen [&>*]:px-dynamic-container">
            <DashboardHeader />
            <div className="relative flex justify-center min-w-fit">
                <PriorityProvider>
                    <Accordion 
                        className="min-w-[800px] h-fit bg-background-2 overflow-hidden mt-7 rounded-xl"
                        render={renderAccordion}
                        headers={[
                            <HeaderComponent checked={false} header="Weekly Preferences" />,
                            <HeaderComponent checked={true} header="Week 1" />,
                            <HeaderComponent checked={true} header="Week 2" />,
                            <HeaderComponent checked={true} header="Week 3" />,
                            <HeaderComponent checked={true} header="Week 4" />,
                            <HeaderComponent checked={true} header="Week 5" />,
                            <HeaderComponent checked={true} header="Week 6" />,
                            <HeaderComponent checked={true} header="Week 7" />,
                            <HeaderComponent checked={true} header="Week 8" />,
                            <HeaderComponent checked={true} header="Week 9" />,
                            <HeaderComponent checked={true} header="Week 10" />,
                            <HeaderComponent checked={true} header="Week 11" />,
                        ]}
                        contents={[
                            <TermPriority termId="term-priorities" className="bg-red-500"/>,
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
            </div>
        </div>
    );
}