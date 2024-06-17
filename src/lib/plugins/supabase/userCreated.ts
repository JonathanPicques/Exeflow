import icon from './icon.svg';
import {trigger} from '$lib/core/plugins/trigger';

export default trigger({
    icon,
    color: '#3ecf8e',
    description: 'triggered when a new user is created',
    //
    form(args) {
        throw new Error('not implemented');
    },
    data(args) {
        throw new Error('not implemented');
    },
});
