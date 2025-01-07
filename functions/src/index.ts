/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { auth } from "@/admin";

export const signInWithJWT = onRequest(async (req, res) => {
    const contentType = req.headers['content-type'];
    if (contentType === undefined || contentType !== "application/json") {
        res.status(400).send({error: "Content type must be application/json"});
    }
    try {
        const { token } = req.body;
        if (typeof token !== "string") {
            throw new Error("Token must be a string");
        }
        const result = await auth.verifyIdToken(token);
        res.status(200).send({message: "OK", data: result.uid});
        logger.info(`UUID ${result.uid} signed in!`);
    } catch {
        res.status(400).send({error: "Invalid body of request"});
    }
});


// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send(process.env.TEST);
// });
