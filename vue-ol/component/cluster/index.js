import cluster from './cluster'

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.component(cluster.name, cluster);
}

export default plugin;

export {
    cluster,
    plugin as install
}