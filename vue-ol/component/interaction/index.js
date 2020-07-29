import point from './point'
import shape from './shape'
import measure from './measure'
import plot from './plot'

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.component(point.name, point);
    Vue.component(shape.name, shape);
    Vue.component(measure.name, measure);
    Vue.component(plot.name, plot);
}

export default plugin;

export {
    point,
    shape,
    measure,
    plot,
    plugin as install
}