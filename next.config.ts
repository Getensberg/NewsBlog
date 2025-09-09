
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "utfs.io",
      // на всякий случай S3-хост UploadThing (иногда ссылки оттуда):
      "uploadthing-prod.s3.us-west-2.amazonaws.com",
    ],
    // (опционально) formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
