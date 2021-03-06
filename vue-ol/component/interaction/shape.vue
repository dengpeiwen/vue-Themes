<template>
    <div class="vueol-interaction-shape" style="display: none;"></div>
</template>
<script>
    import {Vector as VectorLayer} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';
    import {Draw, Modify, Snap} from 'ol/interaction';
    import {createRegularPolygon, createBox} from 'ol/interaction/Draw.js';
    import {transform as transformProjection} from 'ol/proj';
    import {toContext} from 'ol/render.js';
    import { LineString, Polygon } from 'ol/geom';
    import {createStyle, createFeature, isDefined, getGeodesicDistance} from "../../util/helpers";

    export default {
        name: 'ol-draw-shape',
        inject: ['getMap'],
        props: {
            type: {
                type: String,
                required: true,
                default: "Point"
            },
            hasFeatures: {
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
            olStyle: {   //图标样式
                type: Object,
                default: function () {
                    return {
                        fill: {
                            color: [32, 88, 165, 0.4]
                        },
                        stroke: {
                            color: '#2058A5',
                            width: 2
                        },
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
            newId: [String, Number],   //新增触发器，用作新增feature的id
            isSingle: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        },
        watch: {
            hasFeatures() {
                this.source.clear();
                this.getMap().then((map) => {
                    this.loadFeatures(map);
                })
            },
            isModify(nval) {
                this.modify.setActive(nval);
            },
            newId() {
                this.getMap().then((map) => {
                    this.addFeature(map);
                })
            }
        },
        created() {
            this.init();
        },
        methods: {
            initData(){
                this.layer = null;
                this.source = null;
                this.draw = null;
                this.snap = null;
                this.modify = null;
                this.style = null;
            },
            init() {
                this.style = createStyle(this.olStyle);

                this.getMap().then((map) => {
                    this.createLayer(map);

                    //加载已有的点位
                    this.loadFeatures(map);
                })
            },
            createLayer(map) {
                const vm = this;
                vm.source = new VectorSource();
                vm.layer = new VectorLayer({
                    source: vm.source,
                    zIndex: vm.zIndex
                });
                vm.layer.set("shapeLayer", true);
                map.addLayer(this.layer);

                this.modify = new Modify({
                    source: vm.source
                });
                map.addInteraction(this.modify);
                this.modify.setActive(vm.isModify);

                this.modify.on('modifyend', evt => {
                    const coord = evt.mapBrowserEvent.coordinate;

                    let fs = vm.source.getFeatures();
                    let results = fs.map(f => {
                        let geo = f.getGeometry();
                        if(vm.projection != 'pixel'){
                            geo = geo.clone().transform(map.getView().getProjection(), vm.projection);
                        }
                        let requestedPosition, centerPoint;
                        if(vm.type != "Circle") {
                            requestedPosition = geo.getCoordinates();
                        }else{
                            requestedPosition = geo.getRadius();   //Circle  半径
                        }
                        if(vm.type == "Point") {
                            centerPoint = requestedPosition;
                        }else if(vm.type == "LineString") {
                            centerPoint = geo.getCoordinateAt(0.5);
                        }else if(vm.type == "Circle") {
                            centerPoint = geo.getCenter();
                        }else if(vm.type == "Polygon") {
                            let coord = geo.getInteriorPoint().getCoordinates();
                            centerPoint = [coord[0],coord[1]];
                        }else {
                            if(geo.getCenter){
                                centerPoint = geo.getCenter();
                            }else{
                                let coord = geo.getInteriorPoint().getCoordinates();
                                centerPoint = [coord[0],coord[1]];
                            }
                        }

                        return {
                            coord: requestedPosition,
                            center: centerPoint,
                            fId: f.get("id")
                        }
                    })
                    vm.$emit("drawend", results);
                })
            },
            starGeo(coordinates, geometry){
                let center = coordinates[0];
                let last = coordinates[1];
                let dx = center[0] - last[0];
                let dy = center[1] - last[1];
                let radius = Math.sqrt(dx * dx + dy * dy);
                let rotation = Math.atan2(dy, dx);
                let newCoordinates = [];
                let numPoints = 12;
                for (let i = 0; i < numPoints; ++i) {
                    let angle = rotation + i * 2 * Math.PI / numPoints;
                    let fraction = i % 2 === 0 ? 1 : 0.5;
                    let offsetX = radius * fraction * Math.cos(angle);
                    let offsetY = radius * fraction * Math.sin(angle);
                    newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                }
                newCoordinates.push(newCoordinates[0].slice());
                if (!geometry) {
                    geometry = new Polygon([newCoordinates]);
                } else {
                    geometry.setCoordinates([newCoordinates]);
                }
                return geometry;
            },
            addInteractions(map) {
                const vm = this;
                let type = vm.type;
                let geometryFunction = null;
                if(type=="Box"){
                    type = 'Circle';
                    geometryFunction = createBox();
                }else if(type=="Square"){
                    type = 'Circle';
                    geometryFunction = createRegularPolygon(4);
                }else if (type === 'Star') {
                    type = 'Circle';
                    geometryFunction = vm.starGeo;
                }
                vm.draw = new Draw({
                    source: vm.source,
                    type,
                    style: vm.style,
                    geometryFunction
                });
                map.addInteraction(vm.draw);
                this.snap = new Snap({source: vm.source});
                map.addInteraction(vm.snap);

                this.draw.on('drawend', evt => {
                    let feature = evt.feature;
                    feature.setStyle(vm.style);
                    feature.set("id", vm.newId);
                    map.removeInteraction(vm.draw);

                    let geo = feature.getGeometry();
                    if(vm.projection != 'pixel'){
                        geo = geo.clone().transform(map.getView().getProjection(), vm.projection);
                    }
                    let requestedPosition, centerPoint;
                    if(vm.type != "Circle") {
                        requestedPosition = geo.getCoordinates();
                    }else{
                        requestedPosition = geo.getRadius();   //Circle  半径
                    }
                    if(vm.type == "Point") {
                        centerPoint = requestedPosition;
                    }else if(vm.type == "LineString") {
                        centerPoint = geo.getCoordinateAt(0.5);
                    }else if(vm.type == "Circle") {
                        centerPoint = geo.getCenter();
                    }else if(vm.type == "Polygon") {
                        let coord = geo.getInteriorPoint().getCoordinates();
                        centerPoint = [coord[0],coord[1]];
                    }else {
                        if(geo.getCenter){
                            centerPoint = geo.getCenter();
                        }else{
                            let coord = geo.getInteriorPoint().getCoordinates();
                            centerPoint = [coord[0],coord[1]];
                        }
                    }

                    this.$emit("drawend", [{
                        coord: requestedPosition,
                        center: centerPoint,
                        fId: feature.get("id")
                    }])
                })
            },
            addFeature(map) {
                if (this.draw) {
                    map.removeInteraction(this.draw);
                }
                map.removeInteraction(this.snap);

                if(this.isSingle){
                    //清除其他feature
                    this.source.clear();
                }

                this.style = createStyle(this.olStyle);
                this.addInteractions(map);
            },
            calcRadius(r, coords){
                if (r) {
                    if(this.projection!="pixel") {
                        const perDegree = getGeodesicDistance(this.projection, coords, [coords[0] + 1, coords[1]]);
                        const radius = r / perDegree;
                        return radius;
                    }

                    return r;
                }

                return 0;
            },
            loadFeatures(map) {
                const vm = this;
                const viewProjection = map.getView().getProjection().getCode();
                let features = new Array();
                const count = vm.hasFeatures.length;
                for (let i = 0; i < count; i++) {
                    let featureData = vm.hasFeatures[i];
                    if (featureData.coords) {
                        let type = featureData.type;
                        if(type=="Box"||type=="Square"||type=="Star"){
                            type = "Polygon";
                        }
                        let data = {
                            type,
                            projection: vm.projection,
                            coords: featureData.coords,
                            id: featureData.id,
                            name: featureData.name
                        };
                        if (type=="Circle") {
                            data.radius = featureData.radius;
                        }
                        let feature = createFeature(data, viewProjection);
                        if (isDefined(featureData.style)) {
                            let style = createStyle(featureData.style);
                            feature.setStyle(style);
                        }else{
                            feature.setStyle(vm.style);
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