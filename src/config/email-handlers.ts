import {
    emailAddressChangeHandler,
    emailVerificationHandler,
    orderConfirmationHandler,
    passwordResetHandler,
} from '@vendure/email-plugin';

/**
 * Subjects in Spanish. The bodies live in `static/email/templates`.
 * Subjects are defined in code, not in the templates, so they must be overridden here.
 */
export const foundationEmailHandlers = [
    orderConfirmationHandler.setSubject('Confirmación de tu pedido #{{ order.code }}'),
    emailVerificationHandler.setSubject('Verifica tu correo electrónico'),
    passwordResetHandler.setSubject('Restablece tu contraseña'),
    emailAddressChangeHandler.setSubject('Verifica tu nuevo correo electrónico'),
];
