# Priority Feature

## Overview

The Priority feature implements the flow for entering priority preferences for shifts.

## Components

- `PriorityBox`

    - Left/Right click to increase/decrease priority.
    - Shift + right click to copy the priority of a PriorityBox.
    - Shift + left click to paste priority to another PriorityBox.

- `PriorityTerm`

    - Layout priority by week for the term.
    - Shift + right click on a header label (e.g. 'week 1') to copy that column.
    - Shift + left click on a header label to paste a column to another column.
    - Shift + right click on a row label (e.g. 'primary') to copy that row.
    - Shift + left click on a header label to paste a row to another row.

- `PriorityWeek`

    - Layout priority by day for the week.
    - Shift + right click on a header label (e.g. 'Monday') to copy that column.
    - Shift + left click on a header label to paste a column to another column.
    - Shift + right click on a row label (e.g. 'primary') to copy that row.
    - Shift + left click on a header label to paste a row to another row.

## Hooks

- `usePriorityClipboardContext`

    - Provides access to the data on the priority clipboard.

- `usePriorityClipboard`

    - `handleCopy` provides an flexible interface to copy priority data to the clipboard.
    - `handlePaste` provides an flexible interface to paste priority data from the clipboard.


- `usePriorityContext`

    - Provides access to all the priority data in the context.

## Contexts 

- `PriorityClipboardProvider`

    - Stores clipboard data for the priority components.

- `PriorityProvider`

    - Centralizes all priority data for easier access to external modules.


## Module Dependencies

- `PriorityBox`, `PriorityTerm`, `PriorityWeek`

    - `-> features/ui`
    - `-> lib/hooks/useTypeState`
    - `-> lib/constants`