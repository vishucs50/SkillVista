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
          ["invocations", "Invocations", "Sum"],
          ["errors", "Errors", "Sum"],
          ["throttles", "Throttles", "Sum"],
          ["durationAverage", "Duration", "Average"],
          ["durationMaximum", "Duration", "Maximum"],
          ["concurrency", "ConcurrentExecutions", "Maximum"],
        ].map(([id, metricName, stat]) => ({
          Id: id,
          MetricStat: {
            Metric: {
              Namespace: "AWS/Lambda",
              MetricName: metricName,
              Dimensions: [],
            },
            Period: 3600,
            Stat: stat,
          },
          ReturnData: true,
        })),
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
    const latest = (metric) => (metric?.values || [])[0] || 0;
    const invocations = sum(byId.invocations);
    const errors = sum(byId.errors);

    return {
      configured: true,
      metrics,
      summary: {
        invocations,
        errors,
        throttles: sum(byId.throttles),
        errorRate: invocations ? (errors / invocations) * 100 : 0,
        averageDuration: byId.durationAverage?.values?.length
          ? sum(byId.durationAverage) / byId.durationAverage.values.length
          : 0,
        maximumDuration: Math.max(...(byId.durationMaximum?.values || [0])),
        peakConcurrency: Math.max(...(byId.concurrency?.values || [0])),
        latestTimestamp:
          byId.invocations?.timestamps?.[0] ||
          byId.errors?.timestamps?.[0] ||
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
