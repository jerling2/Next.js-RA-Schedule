import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { auth } from "./admin.js";
export const decodeJWT = onRequest(async (req, res) => {
  const contentType = req.headers['content-type'];
  if (contentType === undefined || contentType !== "application/json") {
    res.status(400).send({
      error: "Content type must be application/json"
    });
  }
  try {
    const {
      token
    } = req.body;
    if (typeof token !== "string") {
      throw new Error("Token must be a string");
    }
    const decodedIdToken = await auth.verifyIdToken(token);
    logger.info(`User: ${decodedIdToken.email ? decodedIdToken.email : 'anon'} signed in`);
    res.status(200).send({
      data: decodedIdToken
    });
  } catch {
    res.status(400).send({
      error: "Invalid body of request"
    });
  }
});