<template>
    <div class="vueol-interaction-point" style="display: none;"></div>
</template>
<script>
    import {Vector as VectorLayer} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';
    import {Draw, Modify, Snap} from 'ol/interaction';
    import {transform as transformProjection} from 'ol/proj';
    import {toContext} from 'ol/render.js';
    import LineString from 'ol/geom/LineString';
    import {Fill, Icon, Stroke, Style} from 'ol/style.js';
    import {DEVICE_PIXEL_RATIO} from 'ol/has.js';
    import {createStyle, createFeature, isDefined, validCoords} from "../../util/helpers";

    export default {
        name: 'ol-draw-point',
        inject: ['getMap'],
        props: {
            hasPoints: {
                type: Array
            },
            isModify: {
                type: Boolean,
                default: true
            },
            zIndex: {
                type: Number,
                default: 0
            },
            projection: {
                type: String,
                default: 'EPSG:4326'
            },
            pixelTolerance: {   //图标热点区域半径，应该为图标最大宽度的一半
                type: Number,
                default: 20
            },
            icon: {   //图标样式
                type: Object,
                default: function () {
                    return {
                        image: {
                            circle: {
                                radius: 6,
                                fill: {
                                    color: "#0099ff"
                                },
                                stroke: {
                                    color: "#fff",
                                    width: 1
                                }
                            }
                        }
                    }
                }
            },
            newId: [String, Number]   //新增触发器，用作新增feature的id
        },
        data() {
            return {
                layer: null,
                source: null,
                draw: null,
                snap: null,
                modify: null,
                style: null
            }
        },
        watch: {
            hasPoints() {
                this.source.clear();
                this.getMap().then((map) => {
                    this.loadPoints(map);
                })
            },
            isModify(nval) {
                this.modify.setActive(nval);
            },
            newId() {
                this.getMap().then((map) => {
                    this.addPoint(map);
                })
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.style = createStyle(this.icon);

                this.getMap().then((map) => {
                    this.createLayer(map);

                    //加载已有的点位
                    this.loadPoints(map);
                })
            },
            createCornerLine(radius) {
                let pixelRatio = DEVICE_PIXEL_RATIO;
                let canvas = document.createElement('canvas');
                let vectorContext = toContext(canvas.getContext('2d'),
                    {size: [2 * radius / pixelRatio, 2 * radius / pixelRatio], pixelRatio: pixelRatio});
                vectorContext.setStyle(new Style({
                    fill: new Fill({color: 'blue'}),
                    stroke: new Stroke({width: 4 / pixelRatio, color: '#333'})
                }));
                const LENGTH = 5 / pixelRatio;
                let w = 2 * radius / pixelRatio;
                let cornerLines = [[[0, 0], [LENGTH, 0]],
                    [[w - LENGTH, 0], [w, 0]],
                    [[w, 0], [w, LENGTH]],
                    [[w, w - LENGTH], [w, w]],
                    [[w, w], [w - LENGTH, w]],
                    [[LENGTH, w], [0, w]],
                    [[0, w], [0, w - LENGTH]],
                    [[0, LENGTH], [0, 0]]
                ];

                cornerLines.forEach(pixel => {
                    let line = new LineString(pixel);
                    vectorContext.drawGeometry(line);
                })
                return canvas;
            },
            createLayer(map) {
                const vm = this;
                vm.source = new VectorSource();
                vm.layer = new VectorLayer({
                    source: vm.source,
                    zIndex: vm.zIndex
                });
                vm.layer.set("drawLayer", true);
                map.addLayer(this.layer);

                this.modify = new Modify({
                    source: vm.source,
                    style: function (f) {
                        let r = vm.pixelTolerance;
                        /*if(!r){
                            const size = vm.style.getImage().getSize();
                            r = Math.max(size[0], size[1])/2;
                        }*/
                        let canvas = vm.createCornerLine(r);
                        return new Style({
                            image: new Icon({
                                anchor:[0.5, 0.5],
                                img: canvas,
                                imgSize: [canvas.width, canvas.height]
                            })
                        });
                    },
                    pixelTolerance: this.pixelTolerance
                });
                map.addInteraction(this.modify);
                this.modify.setActive(vm.isModify);

                this.modify.on('modifyend', evt => {
                    let fs = vm.source.getFeatures();
                    let results = fs.map(f => {
                        const coord = f.getGeometry().getCoordinates();
                        let requestedPosition;
                        if (vm.projection === 'pixel') {
                            requestedPosition = coord;
                        } else {
                            requestedPosition = transformProjection(coord,
                                map.getView().getProjection(), vm.projection);
                        }

                        return {
                            coord: requestedPosition,
                            fId: f.get("id")
                        }
                    })
                    vm.$emit("drawend", results);
                })
            },
            addInteractions(map) {
                this.draw = new Draw({
                    source: this.source,
                    type: 'Point',
                    style: this.style
                });
                map.addInteraction(this.draw);
                this.snap = new Snap({source: this.source});
                map.addInteraction(this.snap);

                this.draw.on('drawend', evt => {
                    let feature = evt.feature;
                    feature.setStyle(this.style);
                    feature.set("id", this.newId);
                    map.removeInteraction(this.draw);

                    let requestedPosition;
                    if (this.projection === 'pixel') {
                        requestedPosition = feature.getGeometry().getCoordinates();
                    } else {
                        requestedPosition = transformProjection(feature.getGeometry().getCoordinates(),
                            map.getView().getProjection(), this.projection);
                    }
                    this.$emit("drawend", [{
                        coord: requestedPosition,
                        fId: feature.get("id")
                    }])
                })
            },
            addPoint(map) {
                if (this.draw) {
                    map.removeInteraction(this.draw);
                }

                map.removeInteraction(this.snap);

                this.style = createStyle(this.icon);
                this.addInteractions(map);
            },
            loadPoints(map) {
                const viewProjection = map.getView().getProjection().getCode();
                let features = new Array();
                const count = this.hasPoints.length;
                for (let i = 0; i < count; i++) {
                    let point = this.hasPoints[i];
                    if (point.lon && point.lat) {
                        point.lon = parseFloat(point.lon);
                        point.lat = parseFloat(point.lat);
                        if (this.projection == "EPSG:4326") {
                            if (!validCoords(point.lon, point.lat)) {
                                console.error("经纬度不规范！");
                                continue;
                            }
                        }

                        let feature = createFeature({
                            projection: this.projection,
                            lat: parseFloat(point.lat),
                            lon: parseFloat(point.lon),
                            id: point.id,
                            name: point.name
                        }, viewProjection);
                        if (isDefined(point.style)) {
                            if (!point.style.zIndex || point.style.zIndex < 2) {
                                point.style.zIndex = 2;
                            }

                            let style = createStyle(point.style);
                            feature.setStyle(style);
                        }else{
                            feature.setStyle(this.style);
                        }

                        features.push(feature);
                    }
                }

                this.layer.getSource().addFeatures(features);
            }
        },
        beforeDestroy() {
            const vm = this;
            vm.getMap().then((map) => {
                this.source.clear();
                map.removeLayer(vm.layer);

                if (this.draw) {
                    map.removeInteraction(this.draw);
                }
                map.removeInteraction(this.snap);
                map.removeInteraction(this.modify);
            })
        }
    }
</script>