import 'dotenv/config';

/**
 * Environment access. Every value is read once, at startup.
 * A missing required variable stops the process instead of failing later
 * in a request or in a background job.
 */

function required(name: string): string {
    const value = process.env[name];
    if (value === undefined || value === '') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function optional(name: string, fallback = ''): string {
    return process.env[name] ?? fallback;
}

function numeric(name: string, fallback: number): number {
    const raw = process.env[name];
    if (raw === undefined || raw === '') {
        return fallback;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Environment variable ${name} must be a number, received: ${raw}`);
    }
    return parsed;
}

export const env = {
    isDev: optional('APP_ENV', 'dev') === 'dev',
    port: numeric('PORT', 3000),
    // Internal port. Never published; it is what the worker's Docker healthcheck
    // reads. See ADR-009.
    workerHealthPort: numeric('WORKER_HEALTH_PORT', 3020),
    cookieSecret: required('COOKIE_SECRET'),

    superadmin: {
        username: optional('SUPERADMIN_USERNAME', 'superadmin'),
        password: required('SUPERADMIN_PASSWORD'),
    },

    db: {
        host: required('DB_HOST'),
        port: numeric('DB_PORT', 5432),
        name: optional('DB_NAME', 'vendure'),
        username: optional('DB_USERNAME', 'vendure'),
        password: required('DB_PASSWORD'),
    },

    redis: {
        host: required('REDIS_HOST'),
        port: numeric('REDIS_PORT', 6379),
        password: optional('REDIS_PASSWORD') || undefined,
    },

    r2: {
        bucket: optional('R2_BUCKET'),
        accessKeyId: optional('R2_ACCESS_KEY_ID'),
        secretAccessKey: optional('R2_SECRET_ACCESS_KEY'),
        endpoint: optional('R2_ENDPOINT'),
        publicUrl: optional('R2_PUBLIC_URL'),
    },

    email: {
        resendApiKey: optional('RESEND_API_KEY'),
        from: optional('EMAIL_FROM', 'Store <noreply@example.com>'),
    },

    storefrontUrl: optional('STOREFRONT_URL', 'http://localhost:4200'),
};
