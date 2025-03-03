"use client"
import { KeyboardProvider } from "@/ui";
import { PriorityProvider, PriorityClipboardProvider, TermPriority, WeekPriority, NUM_ROLES, NUM_DAYS, WEEKS_PER_ROW, NUM_WEEKS } from "@/priority";


export default function Document() {
    return (
        <div>
            <KeyboardProvider>
                <PriorityProvider>
                    <PriorityClipboardProvider>
                        <TermPriority 
                            state={{
                                id: 'term',
                                layout: {
                                    numWeeks: NUM_WEEKS,
                                    weeksPerRow: WEEKS_PER_ROW,
                                    numRoles: NUM_ROLES
                                }
                            }}
                        />
                        <WeekPriority 
                            state={{
                                id: 'week',
                                layout: {
                                    numDays: NUM_DAYS,
                                    numRoles: NUM_ROLES,
                                }
                            }}
                        />
                    </PriorityClipboardProvider>
                </PriorityProvider>
            </KeyboardProvider>
        </div>
    );
}