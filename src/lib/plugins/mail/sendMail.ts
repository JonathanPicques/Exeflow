import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';
import type {JsonSchema} from '$lib/schema/schema';

const configSchema = {
    type: 'object',
    properties: {
        tls: {type: 'boolean'},
        host: {type: 'string'},
        port: {type: 'string'},
        user: {type: 'string'},
        password: {type: 'string'},
        //
        to: {type: 'string'},
        from: {type: 'string'},
        subject: {type: 'string'},
        bodyHtml: {type: 'string', title: 'mail in html', format: 'text'},
        bodyText: {type: 'string', title: 'mail in plain text', format: 'text'},
    },
} satisfies JsonSchema;

export default action<typeof configSchema>({
    icon,
    color: '#f3ce39',
    description: 'send a mail',
    //
    form({config}) {
        return {
            type: 'object',
            properties: {
                tls: {type: 'boolean', default: config.tls},
                host: {type: 'string', default: config.host, suggestions: ['${env:SMTP_HOST}']},
                port: {type: 'string', default: config.port, suggestions: ['${env:SMTP_PORT}', '587', '465', '2525']},
                user: {type: 'string', default: config.user, suggestions: ['${env:SMTP_USER}']},
                password: {type: 'string', default: config.password, suggestions: ['${env:SMTP_PASSWORD}']},
                //
                to: {type: 'string', default: config.to},
                from: {type: 'string', default: config.from},
                subject: {type: 'string', default: config.subject},
                bodyHtml: {type: 'string', title: 'mail in html', format: 'text', default: config.bodyHtml},
                bodyText: {type: 'string', title: 'mail in plain text', format: 'text', default: config.bodyText},
            },
        };
    },
    data({form, config}) {
        return {
            valid: true,
            title: 'send mail',
            config: {
                value: {
                    tls: form?.tls ?? config?.tls ?? true,
                    host: form?.host ?? config?.host ?? '',
                    port: form?.port ?? config?.port ?? '587',
                    user: form?.user ?? config?.user ?? '',
                    password: form?.password ?? config?.password ?? '',
                    //
                    to: form?.to ?? config?.to ?? '',
                    from: form?.from ?? config?.from ?? '',
                    subject: form?.subject ?? config?.subject ?? '',
                    bodyText: form?.bodyText ?? config?.bodyText ?? '',
                    bodyHtml: form?.bodyHtml ?? config?.bodyHtml ?? '',
                },
                schema: configSchema,
            },
            inputs: ['in'],
            outputs: ['out'],
            results: {},
        };
    },
});
