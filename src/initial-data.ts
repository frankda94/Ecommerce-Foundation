import { CurrencyCode, InitialData, LanguageCode } from '@vendure/core';

/**
 * Foundation seed data. Applied once, on an empty database.
 * Language, currency and country are data, not configuration: they live in the database.
 */
export const foundationCurrency = CurrencyCode.COP;

export const initialData: InitialData = {
    defaultLanguage: LanguageCode.es,
    defaultZone: 'Colombia',
    countries: [{ name: 'Colombia', code: 'CO', zone: 'Colombia' }],
    taxRates: [
        { name: 'IVA', percentage: 19 },
        { name: 'Excluido de IVA', percentage: 0 },
    ],
    shippingMethods: [{ name: 'Envío estándar', price: 1500000 }],
    paymentMethods: [],
    collections: [],
};
