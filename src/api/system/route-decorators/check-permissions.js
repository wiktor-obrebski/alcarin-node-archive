'use strict';

const permissions = absRequire('api/system/permissions');
const errors      = absRequire('api/system/errors');

module.exports = checkPermissionDecorator;

function checkPermissionDecorator(eventHandler, settings) {
    return (data, ev) => {
        if (settings && settings.permissions) {
            var playerPerm = ev.client.permissions || permissions.Permissions.PUBLIC;
            for (let currPermission of settings.permissions) {
                if (!permissions.has(playerPerm, currPermission)) {
                    const err = new errors.PermissionDenied(
                        'You have not permissions to use this api.'
                    );
                    return ev.answerError(err);
                }
            }
        }
        return eventHandler(data, ev);
    };
}
