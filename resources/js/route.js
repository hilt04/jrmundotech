export default function route(name, params = {}, absolute = true, config = Ziggy) {
    if (!config) {
        if (typeof window !== 'undefined' && window.Ziggy) {
            config = window.Ziggy;
        } else {
            throw new Error('Ziggy routes not found.');
        }
    }
    if (!config.routes[name]) {
        throw new Error(`Route [${name}] is not defined in Ziggy routes.`);
    }
    let uri = config.routes[name].uri;
    Object.keys(params).forEach(key => {
        uri = uri.replace(`{${key}}`, params[key]);
    });
    let url = config.url.replace(/\/$/, '') + '/' + uri.replace(/^\//, '');
    return absolute ? url : '/' + uri.replace(/^\//, '');
}
