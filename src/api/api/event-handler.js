export default function EventHandler(
    handler,
    settings = {}
) {
    return {
        handler,
        settings
    };
}
