import { onRequest } from "firebase-functions/v2/https";
import { identity } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";
import { auth } from "./admin.js";
export const decodeJWT = onRequest(async (req, res) => {
  logger.debug(`Decode JWT received request ${req}`);
  const contentType = req.headers['content-type'];
  if (contentType === undefined || contentType !== "application/json") {
    logger.debug(`Request must be application/json. Request rejected.`);
    res.status(400).send({
      error: "Content type must be application/json"
    });
  }
  try {
    logger.debug(`Request is application/json. Trying to extract token`);
    const {
      token
    } = req.body;
    logger.debug(`Token is ${token}`);
    if (typeof token !== "string") {
      logger.error(`Token is not a string.`);
      throw new Error("Token must be a string");
    }
    logger.debug(`Verifying token's integretiy...`);
    const decodedIdToken = await auth.verifyIdToken(token);
    logger.debug(`Token is valid. Prepare to send client the decoded token`);
    logger.info(`User: ${decodedIdToken.email ? decodedIdToken.email : 'anon'} signed in`);
    res.status(200).send({
      data: decodedIdToken
    });
    logger.debug(`Done.`);
  } catch (error) {
    logger.error(`Invalid body of request. ${error}`);
    res.status(400).send({
      error: "Invalid body of request"
    });
  }
});
export const addDefaultClaimsOnSignUp = identity.beforeUserCreated(() => {
  logger.info("Adding custom claim to user");
  return {
    customClaims: {
      role: "user"
    }
  };
});