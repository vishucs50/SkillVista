import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getConfig() {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!process.env.AWS_REGION || !bucket) {
    throw new Error("AWS_REGION and S3_BUCKET_NAME must be configured");
  }

  return {
    bucket,
    s3: new S3Client({
      region: process.env.AWS_REGION,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    }),
  };
}

export function createUploadUrl({ key, contentType }) {
  const { bucket, s3 } = getConfig();
  return getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 },
  );
}

export function createDownloadCommand(key) {
  const { bucket } = getConfig();
  return new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
}

export function getS3Object(key) {
  const { s3 } = getConfig();
  return s3.send(createDownloadCommand(key));
}
