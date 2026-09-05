import { bootstrap, ChannelService, LanguageCode, RequestContext } from '@vendure/core';
import { populateInitialData } from '@vendure/core/cli';
import { config } from './vendure-config';
import { foundationCurrency, initialData } from './initial-data';

/**
 * Initial population of a new store. Runs once, on an empty database that has already
 * been migrated. It is only idempotent in practice while the default channel is untouched.
 */
async function main(): Promise<void> {
    const app = await bootstrap({
        ...config,
        // Ephemeral port: populating exposes no API and must not clash with a running server.
        apiOptions: { ...config.apiOptions, port: 0 },
    });

    await populateInitialData(app, initialData);

    const channelService = app.get(ChannelService);
    const ctx = RequestContext.empty();
    const defaultChannel = await channelService.getDefaultChannel(ctx);

    await channelService.update(ctx, {
        id: defaultChannel.id,
        defaultLanguageCode: LanguageCode.es,
        availableLanguageCodes: [LanguageCode.es],
        defaultCurrencyCode: foundationCurrency,
        availableCurrencyCodes: [foundationCurrency],
    });

    // eslint-disable-next-line no-console
    console.log(`Poblado completo. Canal por defecto en ${LanguageCode.es} / ${foundationCurrency}.`);
    await app.close();
    process.exit(0);
}

main().catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
