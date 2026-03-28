import { connectDB } from "@/lib/db";
import {
  NotificationLogModel,
  NotificationSubscriberModel,
  PushSubscriberModel
} from "@/model/portfolio.model";
import { findFirstAdmin } from "@/repositories/user-repository";

type NotificationType = "blogs" | "projects" | "assets";
type NotificationFeedType = "project" | "blog" | "asset";

type PreferenceFlags = {
  blogs?: boolean;
  projects?: boolean;
  assets?: boolean;
};

export type NotificationFeedItem = {
  type: NotificationFeedType;
  title: string;
  description: string;
  url: string;
  createdAt: Date;
};

async function getOwnerId() {
  const admin = await findFirstAdmin();
  if (!admin?._id) {
    throw new Error("Admin user not found.");
  }
  return admin._id;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function defaultPreferences(preferences?: PreferenceFlags) {
  return {
    blogs: preferences?.blogs ?? true,
    projects: preferences?.projects ?? true,
    assets: preferences?.assets ?? true
  };
}

function buildVerificationToken() {
  return crypto.randomUUID();
}

function verificationExpiry(hours = 24) {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

export async function getEmailSubscriber(email: string) {
  await connectDB();
  const ownerId = await getOwnerId();
  const normalizedEmail = normalizeEmail(email);
  return NotificationSubscriberModel.findOne({ ownerId, email: normalizedEmail });
}

export async function upsertEmailSubscriber(input: {
  email: string;
  name?: string;
  preferences?: PreferenceFlags;
  source?: string;
}) {
  await connectDB();
  const ownerId = await getOwnerId();
  const email = normalizeEmail(input.email);
  const now = new Date();
  const verificationToken = buildVerificationToken();
  const verificationExpiresAt = verificationExpiry();

  return NotificationSubscriberModel.findOneAndUpdate(
    { ownerId, email },
    {
      $set: {
        email,
        name: input.name?.trim() ?? "",
        status: "pending",
        verificationToken,
        verificationExpiresAt,
        preferences: defaultPreferences(input.preferences),
        source: input.source ?? "website",
        updatedAt: now
      },
      $setOnInsert: {
        ownerId,
        createdAt: now
      }
    },
    { upsert: true, new: true }
  );
}

export async function confirmEmailSubscriber(token: string) {
  await connectDB();
  const ownerId = await getOwnerId();
  const now = new Date();

  const subscriber = await NotificationSubscriberModel.findOne({
    ownerId,
    verificationToken: token,
    verificationExpiresAt: { $gt: now }
  });

  if (!subscriber) {
    return null;
  }

  subscriber.status = "subscribed";
  subscriber.verificationToken = null;
  subscriber.verificationExpiresAt = null;
  subscriber.updatedAt = new Date();
  await subscriber.save();

  return subscriber;
}

export async function unsubscribeEmail(email: string) {
  await connectDB();
  const ownerId = await getOwnerId();
  const normalizedEmail = normalizeEmail(email);
  return NotificationSubscriberModel.findOneAndUpdate(
    { ownerId, email: normalizedEmail },
    { $set: { status: "unsubscribed", updatedAt: new Date() } },
    { new: true }
  );
}

export async function updateEmailPreferences(email: string, preferences: PreferenceFlags) {
  await connectDB();
  const ownerId = await getOwnerId();
  const normalizedEmail = normalizeEmail(email);

  return NotificationSubscriberModel.findOneAndUpdate(
    { ownerId, email: normalizedEmail },
    {
      $set: {
        preferences: defaultPreferences(preferences),
        updatedAt: new Date()
      }
    },
    { new: true }
  );
}

export async function listEmailSubscribers(type?: NotificationType) {
  await connectDB();
  const ownerId = await getOwnerId();
  const filter: Record<string, unknown> = {
    ownerId,
    status: "subscribed"
  };

  if (type) {
    filter[`preferences.${type}`] = true;
  }

  const subscribers = await NotificationSubscriberModel.find(filter)
    .select("name email")
    .lean();

  return subscribers.map((subscriber: any) => ({
    name: subscriber.name?.trim() || subscriber.email.split("@")[0],
    email: subscriber.email
  }));
}

export async function listEmailSubscribersForAdmin(ownerId: string) {
  await connectDB();
  const subscribers = await NotificationSubscriberModel.find({ ownerId })
    .sort({ createdAt: -1 })
    .lean();

  return subscribers.map((subscriber: any) => ({
    id: subscriber._id?.toString?.() ?? "",
    name: subscriber.name,
    email: subscriber.email,
    status: subscriber.status,
    preferences: subscriber.preferences,
    source: subscriber.source,
    createdAt: subscriber.createdAt,
    updatedAt: subscriber.updatedAt
  }));
}

export async function registerPushToken(input: {
  token: string;
  preferences?: PreferenceFlags;
  userAgent?: string;
}) {
  await connectDB();
  const ownerId = await getOwnerId();
  const now = new Date();

  return PushSubscriberModel.findOneAndUpdate(
    { ownerId, token: input.token },
    {
      $set: {
        token: input.token,
        preferences: defaultPreferences(input.preferences),
        userAgent: input.userAgent ?? "",
        lastSeenAt: now
      },
      $setOnInsert: {
        ownerId,
        createdAt: now
      }
    },
    { upsert: true, new: true }
  );
}

export async function listPushTokens(type?: NotificationType) {
  await connectDB();
  const ownerId = await getOwnerId();
  const filter: Record<string, unknown> = { ownerId };

  if (type) {
    filter[`preferences.${type}`] = true;
  }

  const tokens = await PushSubscriberModel.find(filter).select("token").lean();
  return tokens.map((entry: any) => entry.token).filter(Boolean);
}

export async function listPushSubscribersForAdmin(ownerId: string) {
  await connectDB();
  const tokens = await PushSubscriberModel.find({ ownerId })
    .sort({ createdAt: -1 })
    .lean();

  return tokens.map((entry: any) => ({
    id: entry._id?.toString?.() ?? "",
    token: entry.token,
    preferences: entry.preferences,
    userAgent: entry.userAgent,
    createdAt: entry.createdAt,
    lastSeenAt: entry.lastSeenAt
  }));
}

export async function removePushTokens(tokens: string[]) {
  if (!tokens.length) return;
  await connectDB();
  const ownerId = await getOwnerId();
  await PushSubscriberModel.deleteMany({ ownerId, token: { $in: tokens } });
}

export async function createNotificationFeedEntry(input: {
  type: NotificationFeedType;
  title: string;
  description: string;
  url: string;
}) {
  await connectDB();
  const ownerId = await getOwnerId();

  const created = await NotificationLogModel.create({
    ownerId,
    type: input.type,
    title: input.title,
    description: input.description,
    url: input.url
  });

  return created;
}

export async function listNotificationFeedEntries(limit = 30) {
  await connectDB();
  let ownerId: string;
  try {
    ownerId = await getOwnerId();
  } catch {
    return [];
  }

  const entries = await NotificationLogModel.find({ ownerId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return entries.map((entry: any) => ({
    type: entry.type,
    title: entry.title,
    description: entry.description ?? "",
    url: entry.url ?? "",
    createdAt: entry.createdAt
  })) as NotificationFeedItem[];
}
