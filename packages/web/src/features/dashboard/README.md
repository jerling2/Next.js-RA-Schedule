# Dashboard Feature

## Overview

The Dashboard feature describes how the user's dashboard layout. 

## Components

- `Avatar`

    - A interactable and personizable icon for the user's dashboard.

- `DashboardHeader`

    - Describes the layout and functionality of the dashboard's header.
    - Contains methods to mange the user's auth (e.g. sign out and delete account).
    - Supports navigation to the `App`'s landing page.

## Module Dependencies

- `DashboardHeader`

    - `-> features/auth`
    - `-> utils/client`