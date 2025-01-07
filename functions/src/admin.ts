
import dotenv from 'dotenv';
import admin from "firebase-admin"; //< for some reason I can't import { initializeApp }.
import { getAuth } from "firebase-admin/auth";

dotenv.config({ path: '.env.local' });

if (process.env.PROJECT_ID === undefined) {
    throw new Error("Project ID not defined");
}

const app = admin.initializeApp({ projectId: process.env.PROJECT_ID });
const auth = getAuth(app);

export { app, auth };
