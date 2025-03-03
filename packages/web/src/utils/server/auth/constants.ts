import { DecodedIdToken } from "firebase-admin/auth"

// 'default' DecodedIdToken to be used as a type gaurd.
export const DECODED_ID_TOKEN: DecodedIdToken = {
    aud: '',
    auth_time: 0,
    exp: 0,
    iat: 0,
    iss: '',
    sub: '',
    uid: '',
    firebase: {
        identities: {},
        sign_in_provider: ''
    }
}