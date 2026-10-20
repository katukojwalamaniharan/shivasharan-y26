import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const SUPER_ADMIN_EMAIL = 'katukojwalamaniharanchary@gmail.com';
export const WORKSPACE_ID = 'faang-hub';

// Validate connection to Firestore on boot as required by firebase-integration-rpc
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Defensive Payload Validation & Truncation Helpers (Synchronized with firebase-blueprint.json)
export const ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

export function sanitizeId(raw: string, fallback = 'item_1'): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
  return cleaned.length > 0 && ID_REGEX.test(cleaned) ? cleaned : fallback;
}

export function truncateStr(val: string | undefined | null, maxLen: number, minLen = 0, fallback = ''): string {
  const str = (val ?? '').trim();
  if (str.length < minLen) {
    return fallback.slice(0, maxLen);
  }
  return str.slice(0, maxLen);
}

export function clampInt(val: number, min: number, max: number): number {
  const intVal = Math.floor(Number.isFinite(val) ? val : min);
  return Math.max(min, Math.min(max, intVal));
}

export function sanitizeBoundedStringArray(arr: string[], maxItems: number): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item) => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim().slice(0, 128))
    .slice(0, maxItems);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
