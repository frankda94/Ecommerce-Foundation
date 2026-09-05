import {
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    LanguageCode,
    RedisCachePlugin,
    VendureConfig,
} from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';
import path from 'path';
import { env } from '../environment';
import { assetServerPlugin } from './asset-storage';
import { emailPlugin } from './email';
import { CopMoneyStrategy } from './money';

export interface FoundationConfigOptions {
    /** Plugins specific to the store consuming the Foundation. */
    plugins?: VendureConfig['plugins'];
}

/**
 * Base Vendure configuration shared by every store.
 * Stores consume it from the base image (ADR-004) and pass their own plugins.
 */
export function createFoundationConfig(options: FoundationConfigOptions = {}): VendureConfig {
    return {
        // Foundation stores serve a Latin American audience. Removing this leaves the
        // default channel in English: `populate` cannot change it afterwards, because
        // global settings only allow `en` at that point.
        defaultLanguageCode: LanguageCode.es,
        apiOptions: {
            port: env.port,
            adminApiPath: 'admin-api',
            shopApiPath: 'shop-api',
            adminApiPlayground: env.isDev,
            adminApiDebug: env.isDev,
            shopApiPlayground: env.isDev,
            shopApiDebug: env.isDev,
        },
        authOptions: {
            tokenMethod: ['bearer', 'cookie'],
            superadminCredentials: {
                identifier: env.superadmin.username,
                password: env.superadmin.password,
            },
            cookieOptions: {
                secret: env.cookieSecret,
            },
        },
        dbConnectionOptions: {
            type: 'postgres',
            host: env.db.host,
            port: env.db.port,
            database: env.db.name,
            username: env.db.username,
            password: env.db.password,
            // The schema changes only through migrations. See ADR-007.
            synchronize: false,
            migrations: [path.join(__dirname, '../migrations/**/*.+(js|ts)')],
            logging: false,
        },
        entityOptions: {
            // COP totals must be payable by Wompi. See ADR-010.
            moneyStrategy: new CopMoneyStrategy(),
        },
        paymentOptions: {
            // Wompi is added as a payment handler when the integration is implemented.
            paymentMethodHandlers: [],
        },
        plugins: [
            // Jobs live in Redis. See ADR-008.
            BullMQJobQueuePlugin.init({
                connection: {
                    host: env.redis.host,
                    port: env.redis.port,
                    password: env.redis.password,
                    // BullMQ requires this: it uses blocking commands, which ioredis
                    // refuses to retry a bounded number of times.
                    maxRetriesPerRequest: null,
                },
            }),
            // Server and worker are separate processes (ADR-005). The in-memory default
            // would give each its own cache with no cross-invalidation.
            RedisCachePlugin.init({
                redisOptions: {
                    host: env.redis.host,
                    port: env.redis.port,
                    password: env.redis.password,
                },
            }),
            assetServerPlugin(),
            emailPlugin(),
            DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
            // Without this, scheduled tasks never run.
            DefaultSchedulerPlugin.init({}),
            AdminUiPlugin.init({
                route: 'admin',
                // Internal port. The plugin proxies it to the Vendure server port.
                port: env.port + 2,
                // Admin panel UI language. Distinct from the content language, which
                // is seeded into the database by `initial-data.ts`.
                adminUiConfig: {
                    defaultLanguage: LanguageCode.es,
                    availableLanguages: [LanguageCode.es, LanguageCode.en],
                    // Region code, not a full locale: 'es-CO' breaks the selector.
                    defaultLocale: 'CO',
                    availableLocales: ['CO'],
                },
            }),
            ...(options.plugins ?? []),
        ],
    };
}
