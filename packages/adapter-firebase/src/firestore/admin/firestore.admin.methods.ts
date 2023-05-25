import { CollectionReference, DocumentReference, DocumentSnapshot, Firestore } from "firebase-admin/firestore";
import { RequestInstance } from "@hyper-fetch/core";

import { FirestoreDBMethods } from "adapter";
import { getStatus } from "utils";
import { getOrderedResultFirestore } from "../firestore.utils";
import { applyConstraints, getRef } from "./firestore.admin.utils";

export const getFirestoreMethodsAdmin = <R extends RequestInstance>(
  request: R,
  database: Firestore,
  url: string,
  onSuccess,
  onError,
  resolve,
  events: { onRequestStart; onResponseEnd; onResponseStart; onRequestEnd },
): Record<
  FirestoreDBMethods,
  (data: {
    // TODO fix any
    constraints?: any[];
    data?: any;
    options?: Record<string, any>;
  }) => void
> => {
  const [cleanUrl] = url.split("?");
  return {
    getDoc: async () => {
      events.onRequestStart();
      const path = getRef(database, cleanUrl);
      try {
        const snapshot = (await path.get()) as DocumentSnapshot;
        events.onRequestEnd();
        events.onResponseStart();
        const result = snapshot.data() || null;
        const status = result ? "success" : "emptyResource";
        onSuccess(result, status, { ref: path, snapshot }, resolve);
      } catch (e) {
        onError(e, "error", { ref: path }, resolve);
      }
      events.onResponseEnd();
    },
    getDocs: async ({ constraints = [] }: { constraints: any[] }) => {
      const path = getRef(database, cleanUrl) as CollectionReference;
      const query = applyConstraints(path, constraints);

      try {
        events.onRequestStart();
        const querySnapshot = await query.get();
        events.onRequestEnd();
        events.onResponseStart();
        const result = getOrderedResultFirestore(querySnapshot);
        const status = getStatus(result);

        onSuccess(result, status, { ref: path, snapshot: querySnapshot }, resolve);
      } catch (e) {
        events.onRequestEnd();
        events.onResponseStart();
        onError(e, "error", { ref: path }, resolve);
      }
      events.onResponseEnd();
    },
    setDoc: async ({ data, options }) => {
      const path = getRef(database, cleanUrl) as DocumentReference;
      const merge = options?.merge === true;
      try {
        events.onRequestStart();
        const res = await path.set(data, { merge });
        events.onRequestEnd();
        events.onResponseStart();
        onSuccess(res, "success", { ref: path }, resolve);
      } catch (e) {
        events.onRequestEnd();
        events.onResponseStart();
        onError(e, "error", { ref: path }, resolve);
      }
      events.onResponseEnd();
    },
    addDoc: async ({ data }) => {
      const ref = getRef(database, cleanUrl) as CollectionReference;
      try {
        events.onRequestStart();
        const docRef = await ref.add(data);
        events.onRequestEnd();
        events.onResponseStart();
        onSuccess(data, "success", { ref: docRef }, resolve);
      } catch (e) {
        events.onRequestEnd();
        events.onResponseStart();
        onError(e, "error", { ref }, resolve);
      }
      events.onResponseEnd();
    },
    updateDoc: async ({ data }) => {
      const path = getRef(database, cleanUrl) as DocumentReference;
      try {
        events.onRequestStart();
        await path.update(data);
        events.onRequestEnd();
        events.onResponseStart();
        onSuccess(data, "success", { ref: path }, resolve);
      } catch (e) {
        events.onRequestEnd();
        events.onResponseStart();
        onError(e, "error", { ref: path }, resolve);
      }
      events.onResponseEnd();
    },
    deleteDoc: async () => {
      const path = getRef(database, cleanUrl) as DocumentReference;
      try {
        events.onRequestStart();
        await path.delete();
        events.onRequestEnd();
        events.onResponseStart();
        onSuccess(null, "success", { ref: path }, resolve);
      } catch (e) {
        onError(e, "error", { ref: path }, resolve);
      }
      events.onResponseEnd();
    },
  };
};
