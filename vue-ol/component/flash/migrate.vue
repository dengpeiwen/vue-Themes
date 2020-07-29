<template>
    <div class="vueol-migrate" style="display: none;"></div>
</template>
<script>
    import {Vector as VectorLayer} from 'ol/layer';
    import {Vector as VectorSource} from 'ol/source';
    import Feature from "ol/Feature";
    import Point from "ol/geom/Point";
    import {unByKey} from "ol/Observable";
    import {Style, Fill, Text} from "ol/style";

    import {createStyle} from "../../util/helpers";
    import Arc from "../../plugins/plot/gispace/plot/Arc";
    import PlotUtils from "../../plugins/plot/gispace/PlotUtils";

    export default {
        name: 'ol-migrate',
        inject: ['getMap'],
        props: {
            data: {
                type: Array,
                required: true,
                validator: function (value) {
                    let result = value.filter(item => {
                        if (item.from && !item.from.lnglat) {
                            return true;
                        }
                        if (item.to && !item.to.lnglat) {
                            return true;
                        }
                        return !item.from || !item.to;
                    });
                    return !result.length;
                }
            },
            lineStyle: {
                type: Object,
                default: function () {
                    return {
                        stroke: {
                            color: '#12b5d0',
                            width: 2
                        }
                    }
                }
            },
            textColor: String,   //地点文字颜色
            moveRadius: {
                type: Number,
                default: 3
            },
            moveColor: {
                type: String,
                default: "white"
            },
            speed: {
                type: String,
                default: 'normal',
                validator(value){
                    return ["slow", "normal"].indexOf(value)!=-1;
                }
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
            return {}
        },
        methods: {
            init() {
                this.initData();

                this.getMap().then((map) => {
                    this.map = map;
                    this.layer = this.createLayer(map);
                    this.source = this.layer.getSource();
                    this.loadLines(map);
                    this.createText();
                    this.listenRender();
                })
            },
            initData() {
                this.map = null;
                this.layer = null;
                this.source = null;

                this.style = createStyle(this.lineStyle);
                this.renderEventKey = null;   //地图渲染事件监听
                this.lines = [];   //线坐标数组
                this.linesIndex = [];  //各个线移动点当前位置
                this.linesNumber = [];  //各个线划分的段数
                this.linesPnts = [];   //各个线切分后的点位
                this.normalizedData = this.handleData(this.data);
            },
            handleData(data) {
                return data.map(item => {
                    let lnglat = item.from.lnglat,
                        lnglat2 = item.to.lnglat;
                    item.from.lnglat = [parseFloat(lnglat[0]), parseFloat(lnglat[1])];
                    item.to.lnglat = [parseFloat(lnglat2[0]), parseFloat(lnglat2[1])];

                    this.linesIndex.push(0);
                    this.linesNumber.push(0);
                    this.linesPnts.push(0);
                    return item;
                })
            },
            createLayer(map) {
                let layer = new VectorLayer({
                    source: new VectorSource(),
                    zIndex: this.zIndex
                });
                layer.set("migrate", true);
                map.addLayer(layer);
                return layer;
            },

            /**
             *  @description: 绘制两点之间的迁徙弧线
             *  @param {Object} options
             *  @return {Arc}
             *  @author xrx
             *  @date 2019/5/17 16:35
            */
            createLine(options) {
                let startX = options.startX,
                    startY = options.startY,
                    endX = options.endX,
                    endY = options.endY;

                let m = (startX + endX) / 2; // 横轴中点
                let n = (startY + endY) / 2; // 纵轴中点
                const factor = 0.1;

                let centerX = (endY - startY) * factor + m;
                let centerY = (startX - endX) * factor + n;
                return new Arc([[startX, startY], [endX, endY], [centerX, centerY]]);
            },
            loadLines(map) {
                const vm = this;
                this.normalizedData.forEach(item => {
                    const lnglat = item.from.lnglat,
                        lnglat2 = item.to.lnglat;
                    let options = {
                        startX: lnglat[0],
                        startY: lnglat[1],
                        endX: lnglat2[0],
                        endY: lnglat2[1]
                    }
                    let geo = vm.createLine(options);
                    geo = geo.transform(vm.projection, map.getView().getProjection());
                    let f = new Feature(geo);
                    let style;
                    if (item.lineStyle) {
                        style = createStyle(item.lineStyle);
                    } else {
                        style = vm.style;
                    }

                    //单独设置线条颜色
                    f.setStyle(style);

                    this.lines.push(geo.getCoordinates());   //坐标串
                    this.source.addFeature(f);
                })
                this.map.getView().fit(this.source.getExtent());
            },

            /**
             *  @description: 添加地点名称
             *  @author xrx
             *  @date 2019/5/17 16:38
            */
            createText() {
                const vm = this;
                let arr = [], markerArr = [];
                vm.normalizedData.forEach(item => {
                    const lnglat = item.from.lnglat,
                        lnglat2 = item.to.lnglat;
                    if (arr.indexOf(item.from.city) == -1) {
                        markerArr.push({
                            lnglat,
                            city: item.from.city
                        })
                    }
                    if (arr.indexOf(item.to.city) == -1) {
                        markerArr.push({
                            lnglat: lnglat2,
                            city: item.to.city
                        })
                    }
                })

                markerArr.forEach(m => {
                    let geometry = new Point(m.lnglat);
                    geometry = geometry.transform(vm.projection, vm.map.getView().getProjection());
                    let f = new Feature(geometry);
                    f.setStyle(new Style({
                        text: new Text({
                            text: m.city,
                            font: '14px Calibri,sans-serif',
                            offsetX: 20,
                            offsetY: 20,
                            fill: new Fill({
                                color: this.lineStyle.stroke.color
                            })
                        })
                    }))
                    vm.source.addFeature(f);
                })
            },

            /**
             *  @description: 两个地理坐标之间的像素距离
             *  @author xrx
             *  @date 2019/5/17 16:39
            */
            getPixelDis(p1, p2) {
                let pixel = this.map.getPixelFromCoordinate(p1);
                let pixel2 = this.map.getPixelFromCoordinate(p2);
                return PlotUtils.distance(pixel, pixel2);
            },
            /**
             *  @description: 线段按移动点半径分段
             *  @param {Array} p1 - 地理坐标
             *  @param {Array} p2 - 地理坐标
             *  @return Array
             *  @author xrx
             *  @date 2019/5/17 16:39
            */
            getPointSeg(p1, p2) {
                let dis = this.getPixelDis(p1, p2);
                let total = Math.ceil(dis / this.moveRadius);
                let yDiff = p2[1] - p1[1],
                    xDiff = p2[0] - p1[0];
                let x, y, pnts = [];
                for (let i = 1; i < total; i++) {
                    x = p1[0] + this.moveRadius * i / dis * xDiff;
                    y = p1[1] + this.moveRadius * i / dis * yDiff;
                    pnts.push([x, y]);
                }
                pnts.push(p2);
                return pnts;
            },
            getPointList() {
                let total = this.lines.length;
                for (let no = 0; no < total; no++) {
                    let line = this.lines[no];
                    const len = line.length;
                    let pnts = [];
                    for (let i = 0; i < len - 1; i++) {
                        pnts = pnts.concat(this.getPointSeg(line[i], line[i + 1]));
                    }
                    pnts.push(line[0]);
                    if (this.linesPnts[no] != 0) {
                        this.linesIndex[no] = pnts.length * this.linesIndex[no] / this.linesNumber[no];
                    }

                    this.linesPnts[no] = pnts;
                    this.linesNumber[no] = pnts.length;
                }
            },

            /**
             *  @description: 生成目前的移动点，并设置透明度依次降低
             *  @param {Number} no 最大位置序号
             *  @param {Object} vectorContext Context for drawing geometries.
             *         A vector context is available on render events and does not need to be constructed directly.
             *  @return void
             *  @author xrx
             *  @date 2019/5/17 16:50
            */
            createMoveCircle(no, vectorContext) {
                let style = createStyle({
                    image: {
                        circle: {
                            radius: this.moveRadius,
                            fill: {
                                color: this.moveColor
                            }
                        }
                    }
                })

                const max = parseInt(this.linesIndex[no]);
                for (let i = 0; i <= max; i++) {
                    let center = this.linesPnts[no][i];
                    let pointGeo = new Point(center);
                    let featurePoint = new Feature(pointGeo);
                    style.getImage().setOpacity(Math.pow(0.95, max - i + 1));
                    vectorContext.drawFeature(featurePoint, style);
                }

                this.linesIndex[no] += this.speed=="normal"?1:0.5;
                if (this.linesIndex[no] > this.linesNumber[no] - 1) {
                    this.linesIndex[no] = 0;
                }
            },
            moveFeature(event) {
                const vm = this;
                let vectorContext = event.vectorContext;

                if (this.linesPnts[0] == 0) {
                    this.getPointList();
                }

                const len = this.lines.length;
                for (let i = 0; i < len; i++) {
                    vm.createMoveCircle(i, vectorContext);
                }

                // tell OpenLayers to continue the postcompose animation
                this.map.render();
            },
            listenRender() {
                this.renderEventKey = this.map.on('postcompose', this.moveFeature);
                this.map.render();
                this.listenMove(this.map);
            },
            listenMove(map) {
                const vm = this;
                map.getView().on('change:resolution', function () {
                    vm.getPointList();
                });
            }
        },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            const vm = this;
            vm.getMap().then((map) => {
                vm.source.clear();
                map.removeLayer(vm.layer);
            });

            unByKey(this.renderEventKey);
        }
    }

</script>