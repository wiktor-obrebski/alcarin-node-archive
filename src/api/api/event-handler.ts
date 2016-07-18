export default function EventHandler(
    handler: Function,
    settings: IEventHandlerSettings = null
) {
    return {
        handler,
        settings
    };
}

interface IEventHandlerSettings {
    permissions?: Number[],
    schema?: any,
}

interface EventHandler {
    handler: Function,
    settings: IEventHandlerSettings,
}
