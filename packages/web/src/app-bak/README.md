# App Router Organization  

## Domains  

Pages related to a specific domain (e.g., authentication) should be grouped within the same route group. Route groups are created by enclosing the folder name in parentheses, e.g., `(auth)`. These groups enhance the readability of the app router without affecting the URL structure.  

## Component Implementations  

Component implementations should not be defined within `page.tsx` files. Instead, they should be placed within the corresponding domain inside the `features/(domain)` directory. This ensures better organization, maintainability, and separation of concerns. 