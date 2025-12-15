declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      FROM_EMAIL: string;
      RESEND_API_KEY: string;
      AWS_BUCKET_NAME: string;
      AWS_BUCKET_REGION: string;
      AWS_ACCESS_KEY: string;
      AWS_SECRET_ACCESS_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}

export {};
