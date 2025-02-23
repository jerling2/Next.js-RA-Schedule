# UI Feature

## Overview

The UI feature contains various components to assist in navigation, data entry, and user experience. 

## Components

- `Accordion`

    - Implements an 'accordion' style button.

- `FieldInput`

    - Stylized text input.
    - Supports pattern enforcement.
    - Supports disabled/invalid styles.

- `NextButton`

    - Stylized button for clicking to the next page.
    - Communicates the loading status of the next page.

- `PopUpMenu`

    - Creates a menu at a [x, y] coordinate of the screen.
    - Supports a customizable display via a render function.

## Module Dependencies

- `PopUpMenu -> lib/constants`