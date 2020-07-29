import overlay from './overlay';

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.component(overlay.name, overlay);
}

export default plugin;

export {
    overlay,
    plugin as install
}