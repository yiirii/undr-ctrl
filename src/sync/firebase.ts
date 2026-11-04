// Real backend: Firebase Auth (email + password) and Firestore records under users/{uid}/records.
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, collection, doc, setDoc, onSnapshot, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import type { Backend } from './backend';
import type { Remote, PushResult } from './engine';
import type { Rec } from './model';

const enc = (key: string) => key.replace(/\//g, '~'); // Firestore ids can't contain "/"

export function firebaseBackend(): Backend {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  let db: Firestore;
  try { db = initializeFirestore(app, { ignoreUndefinedProperties: true, localCache: persistentLocalCache({ tabManager: persistentSingleTabManager(undefined) }) }); }
  catch { db = initializeFirestore(app, { ignoreUndefinedProperties: true }); }
  return {
    onUser: (cb) => onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid, email: u.email ?? '' } : null)),
    signIn: async (e, p) => { await signInWithEmailAndPassword(auth, e.trim(), p); },
    signUp: async (e, p) => { await createUserWithEmailAndPassword(auth, e.trim(), p); },
    signOut: () => signOut(auth),
    resetPassword: (e) => sendPasswordResetEmail(auth, e.trim()),
    remote: (uid): Remote => ({
      async push(recs: Rec[]): Promise<PushResult> {
        const res = await Promise.allSettled(recs.map((r) => setDoc(doc(db, 'users', uid, 'records', enc(r.key)), r)));
        const rejected: string[] = [];
        res.forEach((x, i) => {
          if (x.status === 'rejected') {
            const code = (x.reason as { code?: string })?.code ?? '';
            if (code === 'permission-denied') rejected.push(recs[i].key); // server already has something newer
            else throw x.reason;
          }
        });
        return { rejected };
      },
      subscribe(cb) {
        let initial = true;
        return onSnapshot(collection(db, 'users', uid, 'records'), { includeMetadataChanges: true }, (snap) => {
          // The first delivery must come from the server, never only the offline cache (see engine first-sync).
          if (initial) {
            if (snap.metadata.fromCache) return;
            initial = false;
            cb(snap.docs.map((d) => d.data() as Rec));
            return;
          }
          const changed = snap.docChanges().filter((c) => c.type !== 'removed' && !c.doc.metadata.hasPendingWrites).map((c) => c.doc.data() as Rec);
          if (changed.length) cb(changed);
        });
      },
    }),
  };
}

/** Firestore rules to paste in the console (also saved as firestore.rules). */
export const RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/records/{key} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid
                    && request.resource.data.updatedAt > resource.data.updatedAt;
      allow delete: if false;
    }
  }
}`;
