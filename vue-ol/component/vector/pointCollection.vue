<template>
    <div class="vueol-collection" style="display: none;">
        <slot :selectPoint="selectPoint"></slot>
    </div>
</template>
<script>
    import {Vector as VectorLayer} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';
    import Feature from 'ol/Feature.js';
    import Point from 'ol/geom/Point';
    import {bbox} from 'ol/loadingstrategy';

    import {
        createStyle,
        isDefined,
        coordinateTransform,
        removeOverlay,
        setLabelEvent,
        deepClone
    } from '../../util/helpers'
    import Bus from '../../util/bus'

    export default {
        name: 'ol-point-collection',
        inject: ['getMap'],
        props: {
            points: {
                type: Array,
                default() {
                    return [{
                        id: 'default',
                        coords: [120, 30],
                        style: {
                            fill: {
                                color: "rgba(255,0,0,0.2)"
                            },
                            stroke: {
                                color: 'blue',
                                width: 4
                            }
                        }
                    }]
                }
            },
            layerStyle: {
                type: Object
            },
            selectPointId: [String, Number],
            blankClear: {    //点击空白处是否设置selectPoint=null
                type: Boolean,
                default: true
            },
            /*
            ** Render mode for vector layers:
            **   1, 'image': Vector layers are rendered as images. Great performance,
            **         but point symbols and texts are always rotated with the view and pixels are scaled during zoom animations.
            **   2, 'vector': Vector layers are rendered as vectors. Most accurate rendering even during animations,
            **        but slower performance.
            */
            renderMode: {
                type: String,
                default: 'vector'
            },
            zIndex: {
                type: Number,
                default: 0
            },
            projection: {
                type: String,
                default: 'EPSG:4326'
            }
        },
        data() {
            return {
                layer: null,
                source: null,
                feature: null,
                moveLabel: null,
                selectPoint: null,
                storeObject: {}
            }
        },
        watch: {
            points: {
                handler() {
                    const vm = this;
                    vm.getMap().then(map => {
                        vm.update(map);
                    })
                },
                deep: true
            },
            selectPointId: {
                handler(nval) {
                    const vm = this;
                    if (!nval) {
                        vm.selectPoint = null;
                        return false;
                    }
                    let point = vm.storeObject[nval];
                    if (point) {
                        vm.selectPoint = deepClone(point);
                    } else {
                        vm.selectPoint = null;
                    }
                }
            },
            selectPoint(nval) {
                //双向数据绑定
                // 应用场景：点击列表，地图相应点位点击弹框显示；反之，点击点位，列表对应数据选中
                if (!nval) {
                    this.$emit('update:selectPointId', "");
                } else {
                    this.$emit('update:selectPointId', nval.id);
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getMap().then((map) => {
                    this.map = map;
                    this.createLayer(map);

                    this.storeObject = {};   //以id为键值，存储数据
                    this.update(map);

                    this.listenEvent(map);

                    if (this.selectPointId) {
                        let point = this.storeObject[this.selectPointId];
                        if (point) {
                            this.selectPoint = deepClone(point);
                        } else {
                            this.selectPoint = null;
                        }
                    }
                })
            },
            getStyle(style) {
                let result = null;
                if (isDefined(style)) {
                    if (style instanceof Array) {
                        let len = style.length;
                        result = [];
                        for (let i = 0; i < len; i++) {
                            result[i] = createStyle(style[i]);
                        }
                    } else {
                        result = createStyle(style);
                    }
                }

                return result;
            },
            createLayer(map) {
                this.source = new VectorSource({
                    strategy: bbox
                });
                this.layer = new VectorLayer({
                    source: this.source,
                    renderMode: this.renderMode,
                    zIndex: this.zIndex
                });
                this.layer.set("collectionLayer", true);
                map.addLayer(this.layer);

                const style = this.getStyle(this.layerStyle);
                this.layer.setStyle(style);
            },
            isRepeatId(points) {
                let arr = [];
                for (let value of points) {
                    if (!value.id) {
                        console.log("id缺失：" + JSON.stringify(value));
                        return true;
                    }
                    if (arr.indexOf(value.id) != -1) {
                        let result = points.filter(item => item.id == value.id);
                        console.log("id重复：" + JSON.stringify(result));
                        return true;
                    }
                    arr.push(value.id);
                }
                return false;
            },
            addFeature(point, viewProjection) {
                let geometry = new Point(point.coords);
                geometry = geometry.transform(this.projection, viewProjection);
                const feature = new Feature({
                    id: point.id,
                    geometry: geometry
                })
                if (point.style) {
                    feature.setStyle(this.getStyle(point.style));
                }
                feature.set("collectionInfo", point);

                this.storeObject[point.id] = point;
                return feature;
            },
            updateFeature(point, viewProjection) {
                let fs = this.source.getFeatures(),
                    total = fs.length;
                for (let i = 0; i < total; i++) {
                    let f = fs[i];
                    if (f.get("id") === point.id) {
                        f.getGeometry().setCoordinates(
                            coordinateTransform(point.coords, this.projection, viewProjection));
                        if (point.style) {
                            f.setStyle(this.getStyle(point.style));
                        }else{
                            f.setStyle(null);
                        }
                        this.storeObject[point.id] = point;
                        break;
                    }
                }
            },
            deleteFeature(id) {
                let fs = this.source.getFeatures(),
                    total = fs.length;
                for (let i = 0; i < total; i++) {
                    let f = fs[i];
                    if (f.get("id") === id) {
                        this.source.removeFeature(f);
                        delete this.storeObject[id];
                        break;
                    }
                }
            },
            update(map) {
                const vm = this;
                const viewProjection = map.getView().getProjection().getCode();

                //每个point必须有唯一的id
                if (vm.isRepeatId(vm.points)) {
                    console.error("海量点位必须有唯一的id值");
                    return false;
                }

                const features = new Array();
                const idSet = new Array();
                vm.points.forEach(function (p, no) {
                    if(vm.storeObject[p.id]){
                        vm.updateFeature(p, viewProjection);
                    }else{
                        let feature = vm.addFeature(p, viewProjection);
                        features.push(feature);
                    }
                    idSet.push(p.id);
                })
                vm.source.addFeatures(features);

                for(let key in vm.storeObject){
                    if(idSet.indexOf(key)==-1){
                        vm.deleteFeature(key);
                    }
                }
            },
            showNameOverlay(map, feature, resultData) {
                const vm = this;
                //悬浮时，先移除其它的弹出框
                removeOverlay(map, null, "overLabel");

                let data = {
                    lat: resultData.lat,
                    lon: resultData.lon,
                    projection: resultData.projection,
                    label: {
                        classNm: "featureOver",
                        message: resultData.name,
                        stopEvent: false
                    }
                }
                let label = setLabelEvent(feature, map, data);
                if (label) {
                    label.set("overLabel", "true"); //与其他的弹出框区分
                }
                return label;
            },
            listenerMove(data) {
                const vm = this;
                let point = data.feature.get("collectionInfo");
                let name = point.name, coords = point.coords;
                if (name) {
                    vm.moveLabel = vm.showNameOverlay(vm.map, data.feature, {
                        lat: coords[1],
                        lon: coords[0],
                        projection: "EPSG:4326",
                        name
                    });
                }

                vm.$emit("pointermove", point);
            },
            listenerMove_blank() {
                const vm = this;
                if (vm.moveLabel) {   //默认name悬浮弹框
                    vm.map.removeOverlay(vm.moveLabel);
                }
            },
            listenerClick(data) {
                const vm = this;
                //获取选中图标的信息
                let point = data.feature.get("collectionInfo");
                vm.selectPoint = deepClone(point);

                vm.$emit("singleclick", vm.selectPoint);
            },
            listenerClick_blank() {
                const vm = this;
                if (vm.blankClear) {
                    vm.selectPoint = null;   //选中图标为空
                }
            },
            listenEvent(mapObject) {
                const vm = this;
                const mapId = mapObject.getTarget().id || "default";
                Bus.$on(mapId + ".collection.pointermove", vm.listenerMove);

                //地图空白处悬浮
                Bus.$on(mapId + ".pointermove.blank", vm.listenerMove_blank);

                Bus.$on(mapId + ".collection.singleclick", vm.listenerClick);

                //地图空白处 点击
                Bus.$on(mapId + ".singleclick.blank", vm.listenerClick_blank);
            }
        },
        beforeDestroy() {
            const vm = this;
            vm.getMap().then((map) => {
                let source = vm.source;
                source.getFeatures().forEach(function (f) {
                    let s = f.getStyle();
                    s = null;
                    f = null;
                })
                source.clear();
                source = null;
                map.removeLayer(vm.layer);

                const mapId = map.getTarget().id || "default";
                Bus.$off(mapId + ".collection.pointermove", vm.listenerMove);
                Bus.$off(mapId + ".pointermove.blank", vm.listenerMove_blank);
                Bus.$off(mapId + ".collection.singleclick", vm.listenerClick);
                Bus.$off(mapId + ".singleclick.blank", vm.listenerClick_blank);
            })
        }
    }
</script>
