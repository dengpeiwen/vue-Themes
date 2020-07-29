import Path from './path'
import MulPath from './multiPath'
import PointCollection from './pointCollection'
import HeatMap from './heatMap'
import NearBy from './nearby'

function plugin(Vue) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.component(Path.name, Path);
    Vue.component(MulPath.name, MulPath);
    Vue.component(PointCollection.name, PointCollection);
    Vue.component(HeatMap.name, HeatMap);
    Vue.component(NearBy.name, NearBy);
}

export default plugin;

export {
    Path,
    MulPath,
    PointCollection,
    HeatMap,
    NearBy,
    plugin as install
}