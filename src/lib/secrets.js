import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

let cachedSecrets = null;

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
 * Falls back to process.env if Secrets Manager is unavailable or in local development.
 */
export async function getAppSecrets() {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  const secretName = process.env.SECRETS_MANAGER_SECRET_NAME || "skillvista/app-secrets";

  try {
    const client = getSecretsManagerClient();
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName }),
    );

    if (response.SecretString) {
      cachedSecrets = JSON.parse(response.SecretString);
      return cachedSecrets;
    }
  } catch (error) {
    console.warn(
      `[SecretsManager] Could not load ${secretName}, falling back to process.env:`,
      error instanceof Error ? error.message : String(error),
    );
  }

  // Graceful fallback to existing process.env
  return {
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
  };
}

