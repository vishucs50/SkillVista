import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

let cachedSecrets = null;
let lastFetchTime = 0;
let isManagerActive = false;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL for fast rotation without redeploying

const getSecretsManagerClient = () => {
  const region = process.env.AWS_REGION || process.env.S3_REGION || "ap-south-1";
  const accessKeyId =
    process.env.SES_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.SES_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;

  return new SecretsManagerClient({
    region,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
  });
};

/**
 * Loads secrets from AWS Secrets Manager.
 * Dynamic values in Secrets Manager OVERRIDE process.env so you can rotate
 * passwords, API keys, and configurations instantly with ZERO redeployments.
 */
export async function getAppSecrets() {
  const now = Date.now();
  if (cachedSecrets && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedSecrets;
  }

  const fallbackEnv = {
    MONGODB_URI: process.env.MONGODB_URI,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
    SES_REGION: process.env.SES_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
  };

  const secretName = process.env.SECRETS_MANAGER_SECRET_NAME || "skillvista/app-secrets";

  try {
    const client = getSecretsManagerClient();
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName }),
    );

    if (response.SecretString) {
      const parsedSecrets = JSON.parse(response.SecretString);
      // Secrets Manager overrides process.env so changes take effect without redeployment
      cachedSecrets = { ...fallbackEnv, ...parsedSecrets };
      lastFetchTime = now;
      isManagerActive = true;
      return cachedSecrets;
    }
  } catch (error) {
    console.warn(
      `[SecretsManager] Could not load ${secretName}, using process.env:`,
      error instanceof Error ? error.message : String(error),
    );
    isManagerActive = false;
  }

  cachedSecrets = fallbackEnv;
  lastFetchTime = now;
  return cachedSecrets;
}

/**
 * Check if the secrets were successfully fetched from AWS Secrets Manager
 */
export async function isFromSecretsManager() {
  await getAppSecrets();
  return isManagerActive;
}

/**
 * Quick helper to retrieve a specific secret key
 */
export async function getSecret(key, defaultValue = "") {
  const secrets = await getAppSecrets();
  return secrets?.[key] || process.env[key] || defaultValue;
}
