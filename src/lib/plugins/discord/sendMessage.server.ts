import action from './sendMessage';
import {serverAction} from '$lib/core/plugins/action.server';

export default serverAction(action, {
    exec: function* () {
        return {out: 'out', results: {}};
    },
});
