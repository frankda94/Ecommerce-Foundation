import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import path from 'path';
import { env } from '../environment';

/**
 * Assets are stored in Cloudflare R2 (ADR-002). R2 is S3-compatible, so the
 * native Vendure S3 strategy is used instead of a custom one (ADR-003).
 * Without R2 configured the plugin falls back to local disk, for development only.
 */
export function assetServerPlugin() {
    const useR2 = env.r2.bucket !== '';

    return AssetServerPlugin.init({
        route: 'assets',
        assetUploadDir: path.join(__dirname, '../../static/assets'),
        assetUrlPrefix: useR2 && env.r2.publicUrl ? `${env.r2.publicUrl}/` : undefined,
        storageStrategyFactory: useR2
            ? configureS3AssetStorage({
                  bucket: env.r2.bucket,
                  credentials: {
                      accessKeyId: env.r2.accessKeyId,
                      secretAccessKey: env.r2.secretAccessKey,
                  },
                  nativeS3Configuration: {
                      endpoint: env.r2.endpoint,
                      region: 'auto',
                      forcePathStyle: true,
                      signatureVersion: 'v4',
                  },
              })
            : undefined,
    });
}
