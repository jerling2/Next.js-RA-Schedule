# Priority Feature

## Overview

The Priority feature implements the flow for entering priority preferences for shifts.

## Components

- `PriorityBox`

    - Left/Right click to **RAISE/LOWER** priority.
    - Shift + right click to **COPY** the priority of a PriorityBox.
    - Shift + left click to **PASTE** priority to another PriorityBox.

- `InteractiveLabel`

    - Display a row or column label.
    - Adds an outline to the label when the mouse is over the label and the shift button is active.
    - Calls copy/paste routines when the user clicks on the label.

- `PriorityTerm`

    - Layout priority by week for the term.
    - Shift + right click on a header label (e.g. 'week 1') or a row label (e.g. 'primary') to **COPY** that column or row. 
    - Shift + left click on a header label (e.g. 'week 1') or a row label (e.g. 'primary) to **PASTE** a column or row to another column or row.

- `PriorityWeek`

    - Layout priority by day for the week.
    - Shift + right click on a header label (e.g. 'Monday') or row label (e.g. 'secondary') to **COPY** that column or row.
    - Shift + left click on a header label (e.g. 'Monday') or a row label (e.g. 'secondary') to **PASTE** a column or row to another column or row.

## Hooks

- `usePriorityContext`

    - Returns a hashmap and update function to access/modify the priority data in the `PriorityProvider`'s context.  
    - Used by the `PriorityBox`, `PriorityTerm`, and `PriorityWeek` components.

- `usePriorityClipboardContext`

    - Returns a hashmap and update function to access/modify the priority data in the `PriorityClipboardProvider`'s context.
    - Used by the `usePriorityClipboard` hook.

- `usePriorityClipboard`

    - Return flexible methods to **COPY**/**PASTE** priority data for the `PriorityBox`, `PriorityTerm`, and `PriorityWeek` components. 
    - Used by the `PriorityBox`, `PriorityTerm`, and `PriorityWeek` components.

## Contexts 

- `PriorityProvider`

    - Maps: (id, block, index) $\rightarrow$ priority value.
    - **NOTE**: Week components only have one block, whereas Term components can have many blocks.
    
    *Examples*:
    - Term, Week 6, Primary is priority 11.
        - ex: ('term', 1, 0) $\rightarrow$ 11
    - Term, Week 6, Secondary is priority 8.
        - ex: ('term', 1, 1) $\rightarrow$ 8
    - Week 1, Sunday, Primary is priority 4.
        - ex: ('week-1', 0, 0) $\rightarrow$ 4
    - Week 1, Sunday, Secondary is priority 2.
        - ex: ('week-1', 0, 1) $\rightarrow$ 2
    - Week 2, Monday, Primary is priority 5.
        - ex: ('week-2', 0, 2) $\rightarrow$ 5

- `PriorityClipboardProvider`

    - Maps (id) $\rightarrow$ `number | number[]`.
    - Where id=["box", "termrow", "termcol", "weekrow", "weekcol"].

## Module Dependencies

- `PriorityBox`, `PriorityTerm`, `PriorityWeek`

    - `-> features/ui`
    - `-> lib/hooks/useTypeState`
    - `-> lib/constants`