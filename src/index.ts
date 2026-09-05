import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

// Migrations run before the application starts, on every deployment. See ADR-007.
runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        process.exit(1);
    });
