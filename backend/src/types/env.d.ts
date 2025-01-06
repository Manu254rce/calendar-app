declare namespace NodeJS {
    interface ProcessEnv {
        MONGODB_URI: string;
        PORT: string;
        JWT_SECRET: string;
        MAILJET_API_KEY: string;
        MAILJET_API_SECRET: string;
    }
}