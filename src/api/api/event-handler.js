export default function EventHandler(
    handler,
    settings = null
) {
    return {
        handler,
        settings
    };
}
