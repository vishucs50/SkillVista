import {
  CloudWatchClient,
  GetMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

function getClient() {
  if (
    !process.env.S3_REGION ||
    !process.env.S3_ACCESS_KEY_ID ||
    !process.env.S3_SECRET_ACCESS_KEY
  ) {
    return null;
  }

  return new CloudWatchClient({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
}

export async function getCloudWatchSummary({ startTime, endTime }) {
  const client = getClient();
  if (!client) {
    return { configured: false, metrics: [] };
  }

  try {
    const response = await client.send(
      new GetMetricDataCommand({
        StartTime: startTime,
        EndTime: endTime,
        ScanBy: "TimestampDescending",
        MetricDataQueries: [
          {
            Id: "invocations",
            MetricStat: {
              Metric: {
                Namespace: "AWS/Lambda",
                MetricName: "Invocations",
                Dimensions: [],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
          {
            Id: "errors",
            MetricStat: {
              Metric: {
                Namespace: "AWS/Lambda",
                MetricName: "Errors",
                Dimensions: [],
              },
              Period: 3600,
              Stat: "Sum",
            },
            ReturnData: true,
          },
          {
            Id: "duration",
            MetricStat: {
              Metric: {
                Namespace: "AWS/Lambda",
                MetricName: "Duration",
                Dimensions: [],
              },
              Period: 3600,
              Stat: "Average",
            },
            ReturnData: true,
          },
        ],
      }),
    );

    return {
      configured: true,
      metrics: (response.MetricDataResults || []).map((metric) => ({
        id: metric.Id,
        values: metric.Values || [],
        timestamps: metric.Timestamps || [],
      })),
    };
  } catch (error) {
    console.error("[admin/cloudwatch] Metrics query failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return { configured: true, metrics: [], error: "CloudWatch metrics unavailable" };
  }
}
