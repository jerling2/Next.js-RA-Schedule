# Auth Feature

## Overview

The Auth feature provides contexts to assist in the `App`'s sign in flow. This includes contexts for managing the user's authorization object and storing the user's sign in credentials (i.e. email). 

## Contexts

- `AuthProvider`
    
    - Manages the user's auth object.
    - Listens for changes in the user's auth.

- `EmailProvider`

    - Stores the user's email in local `sessionStorage`.

## Hooks

- `useAuthContext`

    - `user:` information about the current `'Firebase/auth'` user.
    - `setUser:` set the current user.
    - `loading:` boolean value whether or not the user is loading.
    - `setLoading:` set the loading status of the user.

- `useEmailContext`

    - `email:` the email credential of the user.
    - `setEmail:` set the email credential of the user.


## Module Dependencies

- `AuthProvider` -> `Utils/Client`

    - Uses initialized auth object.