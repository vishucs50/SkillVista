import {
  CloudWatchClient,
  GetMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

function getClient() {
  const region =
    process.env.S3_REGION ||
    process.env.SES_REGION ||
    process.env.AWS_REGION ||
    "ap-south-1";

  const accessKeyId =
    process.env.S3_ACCESS_KEY_ID || process.env.SES_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.S3_SECRET_ACCESS_KEY || process.env.SES_SECRET_ACCESS_KEY;

  if (accessKeyId && secretAccessKey) {
    return new CloudWatchClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  // Fallback to default AWS SDK credential chain (Lambda / Amplify IAM execution role)
  return new CloudWatchClient({ region });
}

export async function getCloudWatchSummary({ startTime, endTime }) {
  const client = getClient();
  if (!client) {
    return { configured: false, metrics: [] };
  }

  const appId = process.env.AMPLIFY_APP_ID || "durajg8e4lg0n";

  try {
    const response = await client.send(
      new GetMetricDataCommand({
        StartTime: startTime,
        EndTime: endTime,
        ScanBy: "TimestampDescending",
        MetricDataQueries: [
          {
            Id: "requests",
            MetricStat: {
              Metric: {
                Namespace: "AWS/AmplifyHosting",
                MetricName: "Requests",
                Dimensions: [{ Name: "App", Value: appId }],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
          {
            Id: "latency",
            MetricStat: {
              Metric: {
                Namespace: "AWS/AmplifyHosting",
                MetricName: "Latency",
                Dimensions: [{ Name: "App", Value: appId }],
              },
              Period: 3600,
              Stat: "Average",
            },
            ReturnData: true,
          },
          {
            Id: "errors5xx",
            MetricStat: {
              Metric: {
                Namespace: "AWS/AmplifyHosting",
                MetricName: "5xxErrors",
                Dimensions: [{ Name: "App", Value: appId }],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
          {
            Id: "errors4xx",
            MetricStat: {
              Metric: {
                Namespace: "AWS/AmplifyHosting",
                MetricName: "4xxErrors",
                Dimensions: [{ Name: "App", Value: appId }],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
          {
            Id: "bytesDownloaded",
            MetricStat: {
              Metric: {
                Namespace: "AWS/AmplifyHosting",
                MetricName: "BytesDownloaded",
                Dimensions: [{ Name: "App", Value: appId }],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
          {
            Id: "bytesUploaded",
            MetricStat: {
              Metric: {
                Namespace: "AWS/AmplifyHosting",
                MetricName: "BytesUploaded",
                Dimensions: [{ Name: "App", Value: appId }],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
        ],
      }),
    );

    const metrics = (response.MetricDataResults || []).map((metric) => ({
      id: metric.Id,
      label: metric.Label || metric.Id,
      values: metric.Values || [],
      timestamps: metric.Timestamps || [],
    }));

    const byId = Object.fromEntries(metrics.map((metric) => [metric.id, metric]));
    const sum = (metric) =>
      (metric?.values || []).reduce((total, value) => total + value, 0);

    const requests = sum(byId.requests);
    const errors5xx = sum(byId.errors5xx);
    const errors4xx = sum(byId.errors4xx);
    const latencyValues = byId.latency?.values || [];
    const avgLatency = latencyValues.length
      ? sum(byId.latency) / latencyValues.length
      : 0;

    return {
      configured: true,
      service: "AWS/AmplifyHosting",
      appId,
      metrics,
      summary: {
        // Amplify metrics
        requests,
        errors5xx,
        errors4xx,
        averageLatency: avgLatency,
        bytesDownloaded: sum(byId.bytesDownloaded),
        bytesUploaded: sum(byId.bytesUploaded),

        // Backward compatibility mappings for UI
        invocations: requests,
        errors: errors5xx,
        errorRate: requests ? ((errors5xx + errors4xx) / requests) * 100 : 0,
        averageDuration: avgLatency,
        peakConcurrency: requests > 0 ? Math.ceil(requests / 100) : 0,
        throttles: errors4xx,
        latestTimestamp:
          byId.requests?.timestamps?.[0] ||
          byId.errors5xx?.timestamps?.[0] ||
          null,
      },
    };
  } catch (error) {
    console.error("[admin/cloudwatch] Metrics query failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return { configured: true, metrics: [], error: "CloudWatch metrics unavailable" };
  }
}
