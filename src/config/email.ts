import { EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { foundationEmailHandlers } from './email-handlers';
import path from 'path';
import { env } from '../environment';

/**
 * Transactional email through Resend (ADR-002), over its SMTP endpoint so that
 * Vendure's native EmailPlugin is used unchanged (ADR-003).
 * In development emails are written to disk instead of being sent.
 */
export function emailPlugin() {
    const templateLoader = new FileBasedTemplateLoader(
        path.join(__dirname, '../../static/email/templates'),
    );
    const globalTemplateVars = {
        fromAddress: env.email.from,
        verifyEmailAddressUrl: `${env.storefrontUrl}/account/verify`,
        passwordResetUrl: `${env.storefrontUrl}/account/reset-password`,
        changeEmailAddressUrl: `${env.storefrontUrl}/account/change-email-address`,
    };

    if (env.isDev) {
        return EmailPlugin.init({
            devMode: true,
            handlers: foundationEmailHandlers,
            templateLoader,
            outputPath: path.join(__dirname, '../../static/email/output'),
            route: 'mailbox',
            globalTemplateVars,
        });
    }

    return EmailPlugin.init({
        handlers: foundationEmailHandlers,
        templateLoader,
        globalTemplateVars,
        transport: {
            type: 'smtp',
            host: 'smtp.resend.com',
            port: 587,
            auth: {
                user: 'resend',
                pass: env.email.resendApiKey,
            },
            pool: true,
        },
    });
}
