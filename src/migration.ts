import { generateMigration, revertLastMigration, runMigrations } from '@vendure/core';
import path from 'path';
import { config } from './vendure-config';

const command = process.argv[2];
const name = process.argv[3];
// The Foundation writes to `foundation/`; a store sets MIGRATIONS_DIR=store.
const outputDir = path.join(__dirname, './migrations', process.env.MIGRATIONS_DIR ?? 'foundation');

async function main(): Promise<void> {
    switch (command) {
        case 'generate':
            if (!name) {
                throw new Error('Usage: migration:generate <name>');
            }
            // Apply what is pending before diffing entities against the database.
            // Without this, a pending Foundation migration ends up copied into the
            // store's own migration and then fails at deploy time.
            await runMigrations(config);
            await generateMigration(config, { name, outputDir });
            return;
        case 'run':
            await runMigrations(config);
            return;
        case 'revert':
            await revertLastMigration(config);
            return;
        default:
            throw new Error(`Unknown migration command: ${command ?? '(none)'}`);
    }
}

main().catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
