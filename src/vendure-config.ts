import { createFoundationConfig } from './config/foundation-config';

/**
 * Default configuration used by the Foundation itself, for development and as the
 * reference implementation. A store overrides this file in its own image (ADR-004).
 */
export const config = createFoundationConfig();
