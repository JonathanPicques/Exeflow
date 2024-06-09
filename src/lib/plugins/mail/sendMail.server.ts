import sendMail from './sendMail';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(sendMail, {
    exec: async function* ({config}) {
        console.log(config);
        return {out: 'out', results: {}};
    },
});
