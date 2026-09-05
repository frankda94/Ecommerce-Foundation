import { bootstrapWorker } from '@vendure/core';
import { env } from './environment';
import { config } from './vendure-config';

// The worker runs as a process separate from the server. See ADR-005.
bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    // Liveness endpoint for the container healthcheck. Without it the worker has no
    // health at all: Docker only knows the process has not exited. See ADR-009.
    .then(worker => worker.startHealthCheckServer({ port: env.workerHealthPort }))
    .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        process.exit(1);
    });
