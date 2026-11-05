import type { Core } from "@strapi/strapi";

export default ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    enabled: true,
    config: {
      provider: "aws-s3",
      providerOptions: {
        baseUrl: env("S3_BASE_URL"),
        rootPath: "uploads",
        s3Options: {
          credentials: {
            accessKeyId: env("S3_ACCESS_KEY"),
            secretAccessKey: env("S3_SECRET_KEY"),
          },
          region: "us-east-1",
          endpoint: env("S3_ENDPOINT"),
          forcePathStyle: true,
          params: {
            Bucket: env("S3_BUCKET_NAME"),
          },
        },
        providerConfig: {
          checksumAlgorithm: "CRC64NVME",
        },
      }
    },
  },
});
