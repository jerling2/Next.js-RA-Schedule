/**
 * Firebase JavaScript Auth Ref: https://firebase.google.com/docs/reference/js/auth.md#auth_package
 */
"use client";
import { FirebaseError } from 'firebase/app';
import { User } from "firebase/auth";
import { auth } from '@/lib/client/firebase';
import { getIdToken, setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, Auth, fetchSignInMethodsForEmail, signInWithEmailAndPassword, UserCredential} from 'firebase/auth';
import { useRouter } from "next/navigation";

/*can 

TODO:
 * signInWithCredential(auth, credential) https://firebase.google.com/docs/reference/js/auth.md#signinwithcredential_8074518
 * signOut(auth) https://firebase.google.com/docs/reference/js/auth.md#signout_2a61ea7
 * sendEmailVerification(user, actionCodeSettings) https://firebase.google.com/docs/reference/js/auth.md#sendemailverification_6a885d6
 * updatePassword(user, newPassword) https://firebase.google.com/docs/reference/js/auth.md#updatepassword_6df673e
 * updateEmail(user, newEmail) https://firebase.google.com/docs/reference/js/auth.md#updateemail_7737d57
*/

type SignupEmail = (
    auth: Auth,
    email: string,
    password: string,
) => void;

const signupEmail: SignupEmail = async (auth, email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password); //< returns UserCredentials
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
        await setPersistence(auth, browserSessionPersistence);
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
        const methods = await fetchSignInMethodsForEmail(auth, email);
        return (methods.length > 0);
    } catch (error: unknown) {
        if (!(error instanceof FirebaseError)) {
            alert(error);
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

export { auth, fetchAuthToken, signupEmail, signinEmail, checkUserEmail };