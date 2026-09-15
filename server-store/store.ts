import { Expo } from "expo-server-sdk";

const MAX_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

let listingsCreated = 0;

/** Sends a notification to five users whenever five listings have been created. */
export async function notifyAfterFiveListings(
  expoPushTokens: string[]
): Promise<void> {
  listingsCreated++;

  if (listingsCreated < 5) return;
  listingsCreated -= 5;
  

  const messages = expoPushTokens
    .filter((token) => Expo.isExpoPushToken(token))
    .slice(0, 5)
    .map((to) => ({
      to,
      sound: "default" as const,
      title: "New listings available",
      body: "Five new listings have been created.",
    }));

  const expo = new Expo();
  for (let index = 0; index < messages.length; index += 100) {
    await expo.sendPushNotificationsAsync(messages.slice(index, index + 100));
  }
}

export async function checkLimit(req: Request): Promise<Response | null> {
  const uniqueClientID =
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-client-id");

  if (!uniqueClientID) {
    return new Response("Missing client ID", { status: 400 });
  }

  const now = Date.now();
  const entry = store.get(uniqueClientID);

  // expired or first visit — reset
  if (!entry || now > entry.resetAt) {
    store.set(uniqueClientID, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_LIMIT) {
    const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: retryAfterSecs,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSecs),
        },
      }
    );
  }

  entry.count++;
  return null;
}


setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, WINDOW_MS);
