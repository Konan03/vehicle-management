import * as admin from 'firebase-admin';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken; // Agrega la propiedad `user` con el tipo `DecodedIdToken`
    }
  }
}

export {};
