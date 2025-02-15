/**
 * Firebase JavaScript Auth Ref: https://firebase.google.com/docs/reference/js/auth.md#auth_package
 */
"use client";
import { FirebaseError } from 'firebase/app';
import { User, ActionCodeSettings } from "firebase/auth";
import { auth } from '@/client/firebase';
import { getIdToken, createUserWithEmailAndPassword, Auth, fetchSignInMethodsForEmail, signInWithEmailAndPassword, UserCredential, signOut} from 'firebase/auth';

type SignupEmail = (
    auth: Auth,
    email: string,
    password: string,
) => void;

const signupEmail: SignupEmail = async (auth, email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        } else {
            console.log('Uknown error', error);
        }
    }
}

type SigninEmail = (
    email: string,
    password: string,
) => Promise<UserCredential | undefined>;

const signinEmail: SigninEmail = async (email, password) => {
    try {
        // await setPersistence(auth, browserSessionPersistence); //< Set browser persistance.
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
        if (!(error instanceof FirebaseError)) {
            throw new Error("unknown error");
        } else if (error.code === "auth/invalid-email") {
            throw new Error("Invalid email");
        } else {
            return undefined;
        }
    }
}

type CheckUserEmail = (
    email: string,
) => Promise<Boolean>;

const checkUserEmail: CheckUserEmail = async (email) => {
    try {
        console.log(auth, email);
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log(methods)
        return (methods.length > 0);
    } catch (error: unknown) {
        if (!(error instanceof FirebaseError)) {
            alert(`firebase error: ${error}`);
        }
        return false;
    }
}

type FetchAuthToken = (
    user: User, 
) => Promise<boolean>;

const fetchAuthToken: FetchAuthToken = async (user) => {
    try {
        const JWT = await getIdToken(user);
        const response = await fetch('/api/authenticate', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${JWT}`
            }
        });
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error: unknown) {
        alert(`Problem in fetchAuthToken ${error}`);
        return false;
    };
}

const signOutUser = async () => {
    try {
        await signOut(auth);
        await fetch('/api/signOut', {
            method: "POST",
            credentials: "same-origin"
        })
    } catch(error: unknown) {
        alert(`Uncaught error ${error}`);
    }
}

export { auth, fetchAuthToken, signupEmail, signinEmail, checkUserEmail, signOutUser };

