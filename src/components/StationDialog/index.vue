<template>
    <div>
        <div :class="{'is-disabled':disabled}" class="station-view el-input el-input--small">
            <span :title="chooseName" class="el-input__inner" @click="showDialog">{{ chooseName }}</span>
        </div>
        <el-dialog :visible.sync="dialogVisible" :show-close="false" title="提示" width="620px" class="station-dialog" append-to-body @open="initSelected" @close="clearFilterParams">
            <div slot="title" class="station-head">
                选择站点
                <span class="fr">
                    <el-button type="primary" size="small" @click="submit">保存</el-button>
                    <el-button size="small" @click=" dialogVisible = false ">取消</el-button>
                </span>
            </div>
            <template class="station-body">
                <el-form :inline="true" :model="filterParams" size="small" label-width="75px">
                    <el-form-item label="站点名称">
                        <el-input v-model="filterParams.stationName" placeholder="站点名称" />
                    </el-form-item>
                    <el-form-item label="站点编码">
                        <el-input v-model="filterParams.stationCode" placeholder="站点编码" />
                    </el-form-item>
                </el-form>
                <el-tree v-if="dialogVisible" ref="stationTree" :filter-node-method="filterNode" :show-radio="!multiple" :show-checkbox="multiple" :data="treeData" accordion node-key="value">
                    <div slot-scope="{ node, data }">
                        <div v-if="!multiple">
                            <el-radio v-if=" data.type==='station' " v-model="radioVal" :name="data.siteType" :label="data.value">{{ data.label }}</el-radio>
                            <span v-else>{{ data.label }}</span>
                        </div>
                        <span v-else>{{ data.label }}</span>
                    </div>
                </el-tree>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import utils from '@/utils';

export default {
    name: 'StationDialog',
    props: {
        multiple: { type: Boolean, default: true },
        disabled: { type: Boolean, default: false },
        station: { type: Array, default: () => [] },
        defaultKey: Array
    },
    data() {
        return {
            radioVal: '',
            dialogVisible: false,
            chooseName: '请选择站点',
            treeData: [],
            filterParams: { stationName: '', stationCode: '' }
        };
    },
    watch: {
        filterParams: {
            handler(val) {
                this.$refs.stationTree.filter(val);
            },
            deep: true
        }
    },
    mounted() {
        this.treeData = this.formatStationTree(this.station);
    },
    methods: {
        setTagName(name) {
            this.chooseName = name;
        },
        showDialog() {
            if (!this.disabled) {
                this.dialogVisible = true;
            }
        },
        initSelected() {
            console.log(this.defaultKey);
            if (this.multiple && this.defaultKey) {
                // 设置默认值
                this.$nextTick(() => {
                    this.$refs.stationTree.setCheckedKeys(this.defaultKey);
                });
            }
        },
        filterNode(filter, data) {
            // 有siteType代表是站点
            if (data.siteType && data.label.indexOf(filter.stationName) !== -1 && data.value.indexOf(filter.stationCode) !== -1) {
                return true;
            }
        },
        clearFilterParams() {
            this.filterParams.stationName = '';
            this.filterParams.stationCode = '';
        },
        submit() {
            let result = null;
            if (this.multiple) {
                // 过滤结果  没有value代表不是站点
                result = this.$refs.stationTree.getCheckedNodes().filter(item => {
                    return !!item.siteType;
                });
                // 设置显示框的名字
                this.chooseName =
                    result
                        .map(item => {
                            return item.label;
                        })
                        .join() || '请选择站点';
            } else {
                result = this.radioVal;
            }
            // 提交
            this.$emit('submit', result);
            // 关闭弹窗
            this.dialogVisible = false;
        },
        formatStationTree(station) {
            if (!station) {
                return [];
            }

            const result = [{ label: '书店', children: [], value: 'bookStore' }, { label: '咖啡', children: [], value: 'Cafe' }, { label: '物流', children: [], value: 'Logistics' }];
            // 书店和咖啡馆  后面会加入result
            const bookStoreSet = [];
            const cafeStoreSet = [];
            let hq = null;
            let ol = null;
            // 先将站点分组
            station.forEach(stationItem => {
                if (stationItem.stationCode === utils.station.hadquarters.code) {
                    hq = { label: stationItem.stationName, value: stationItem.stationCode };
                } else if (stationItem.stationCode === utils.station.online.code) {
                    ol = { label: stationItem.stationName, value: stationItem.stationCode };
                } else if (stationItem.siteType === 'Logistics') {
                    // 物流不需要树结果
                    result[2].children.push({
                        label: stationItem.stationName,
                        value: stationItem.stationCode,
                        siteType: stationItem.siteType
                    });
                } else if (stationItem.siteType === 'BookStore') {
                    bookStoreSet.push(stationItem);
                } else if (stationItem.siteType === 'Cafe') {
                    cafeStoreSet.push(stationItem);
                }
            });
            // 分别把书店和咖啡馆和成Tree
            result[0].children = this.buildTree(bookStoreSet);
            result[1].children = this.buildTree(cafeStoreSet);
            // 向最前面添加在线和总部
            if (ol) {
                result.splice(0, 0, ol);
            }
            if (hq) {
                result.splice(0, 0, hq);
            }
            return result;
        },
        buildTree(data) {
            const root = [];
            const areaPos = {};
            const cityPos = {};
            data.forEach(item => {
                // 区域
                const areaCode = item.largeArea.largeAreaCode;
                if (!areaPos[areaCode] && areaPos[areaCode] !== 0) {
                    areaPos[areaCode] = {
                        label: item.largeArea.largeAreaName,
                        value: item.largeArea.largeAreaCode,
                        type: 'area',
                        children: []
                    };
                    root.push(areaPos[areaCode]);
                }
                // 城市
                const areaItem = areaPos[areaCode];
                const cityCode = item.city.cityCode;
                if (!cityPos[cityCode] && cityPos[cityCode] !== 0) {
                    cityPos[cityCode] = {
                        label: item.city.cityName,
                        value: item.city.cityCode,
                        type: 'city',
                        children: []
                    };
                    areaItem.children.push(cityPos[cityCode]);
                }
                // 站点
                const cityItem = cityPos[cityCode];
                cityItem.children.push({
                    label: item.stationName,
                    value: item.stationCode,
                    siteType: item.siteType,
                    type: 'station'
                });
            });
            return root;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
// 加上会控制不到input
.station-view {
    cursor: pointer;
    span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
    }
}
.station-dialog {
    .station-head {
        line-height: 50px;
        font-size: 18px;
        color: #303133;
        border-bottom: 1px solid #efefef;
    }
}
</style>
