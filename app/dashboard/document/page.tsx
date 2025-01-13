"use client";
import DashboardHeader from "@/components/DashboardHeader";
import { AccordionContainer, AccordionElement } from "@/components/Accordion";

export default function Document() {
    return (
        <div className="relative flex flex-col w-screen h-screen [&>*]:px-dynamic-container">
            <DashboardHeader />
            <div className="relative flex h-full min-w-fit">
                <div className="relative max-h-[100px] aspect-square bg-background-2">
                    <AccordionContainer 
                        contents={[
                            <div>
                                test
                            </div>,
                            <div>
                                test 2
                            </div>
                        ]}
                        render={(content, index: number) => (
                            <AccordionElement index={index}>
                                {content}
                            </AccordionElement>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}