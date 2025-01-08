import dotenv from 'dotenv';
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
dotenv.config({
  path: '.env.local'
});
if (process.env.PROJECT_ID === undefined) {
  throw new Error("Project ID not defined");
}
const app = initializeApp({
  projectId: process.env.PROJECT_ID
});
const auth = getAuth(app);
export { app, auth };