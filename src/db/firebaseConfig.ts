import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

const serviceAccountPath = path.resolve(process.env.FIREBASE_CREDENTIALS_PATH || '');
console.log(`Attempting to load Firebase credentials from: ${serviceAccountPath}`);


// Verifica si el archivo de credenciales existe
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Service account file not found at ${serviceAccountPath}`);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  databaseURL: "https://car-garage-management-d4a33-default-rtdb.firebaseio.com"
});

const auth = admin.auth();
const db = admin.database();

export { auth, db };
