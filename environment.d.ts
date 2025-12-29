declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      AUTHOR_NAME: string;
      AUTHOR_URL: string;
      FROM_EMAIL: string;
      RESEND_API_KEY: string;
      AWS_BUCKET_NAME: string;
      AWS_BUCKET_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      NEXT_PUBLIC_ALLOW_EMAIL: "true" | "false";
      NEXT_PUBLIC_ALLOW_ATTACHMENTS: "true" | "false";
      NEXT_PUBLIC_ALLOW_STRIPE: "true" | "false";
      NEXT_PUBLIC_ALLOW_STRIPE_SUBSCRIPTION_MANAGEMENT: "true" | "false";
    }
  }
}

export {};
