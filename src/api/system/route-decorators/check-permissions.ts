import {Permissions, default as permissions} from '../permissions'
import {PermissionDenied} from '../errors'

export default function checkPermissionDecorator(settings, eventHandler) {
    return (ev) => {
        if (settings && settings.permissions) {
            var playerPerm = ev.auth.permissions || Permissions.PUBLIC;
            for (let currPermission of settings.permissions) {
                if (!permissions.has(playerPerm, currPermission)) {
                    const err = new PermissionDenied(
                        'You have not permissions to use this api.'
                    );
                    return ev.answerError(err);
                }
            }
        }
        return eventHandler(ev);
    };
}
