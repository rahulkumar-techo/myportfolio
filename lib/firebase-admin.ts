import admin from "firebase-admin";

type FirebaseServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function parseServiceAccount(): FirebaseServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (raw) {
    try {
      const json = JSON.parse(raw);
      return {
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: String(json.private_key || "").replace(/\\n/g, "\n")
      };
    } catch {
      try {
        const decoded = Buffer.from(raw, "base64").toString("utf-8");
        const json = JSON.parse(decoded);
        return {
          projectId: json.project_id,
          clientEmail: json.client_email,
          privateKey: String(json.private_key || "").replace(/\\n/g, "\n")
        };
      } catch {
        return null;
      }
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

function getAdminApp() {
  if (admin.apps.length) {
    return admin.app();
  }

  const serviceAccount = parseServiceAccount();

  if (!serviceAccount) {
    throw new Error("Firebase admin credentials are missing.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export function getFirebaseAdminMessaging() {
  return getAdminApp().messaging();
}
