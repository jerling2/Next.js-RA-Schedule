type SignupEmail = (
    auth: Auth,
    email: string,
    password: string,
) => void;

type SigninEmail = (
    email: string,
    password: string,
) => Promise<UserCredential | undefined>;

type CheckUserEmail = (
    email: string,
) => Promise<Boolean>;

type FetchAuthToken = (
    user: User, 
) => Promise<boolean>;