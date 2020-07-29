import flash from './ripples';
import twinkle from './twinkle';
import track from './track';
import migrate from './migrate';
import radar from './radar';

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.component(flash.name, flash);
    Vue.component(twinkle.name, twinkle);
    Vue.component(track.name, track);
    Vue.component(migrate.name, migrate);
    Vue.component(radar.name, radar);
}

export default plugin;

export {
    flash,
    twinkle,
    track,
    migrate,
    radar,
    plugin as install
}