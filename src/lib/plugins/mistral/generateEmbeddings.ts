import icon from './icon.svg';
import {action} from '$lib/core/plugins/action';

export default action({
    icon,
    color: '#ff7000',
    description: 'generate embeddings',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});
