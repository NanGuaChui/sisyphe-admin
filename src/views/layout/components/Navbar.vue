<template>
    <div>
        <el-menu class="navbar" mode="horizontal">
            <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
            <breadcrumb/>
            <div class="right-menu">
                <div class="station-wrapper" @click="showSwitchDialog">
                    当前站点：{{ currentStation.stationName }}
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown trigger="click">
                    <div class="avatar-wrapper">
                        {{ userName }}
                        <i class="el-icon-caret-bottom" />
                    </div>
                    <el-dropdown-menu slot="dropdown" class="text-center">
                        <router-link to="/">
                            <el-dropdown-item>主页</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item divided @click.native="logout">退出登陆</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-menu>
        <el-dialog :visible.sync="switchVis" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" title="选择站点" append-to-body width="420px" class="switch-dialog">
            <div v-if="switchVis">
                <el-select v-model="selectStation" value-key="stationCode" filterable placeholder="请选择" class="station-select">
                    <el-option v-for="item in scopeStations" :key="item.stationCode" :label="item.stationName" :value="item" />
                </el-select>
                <el-button class="margin-top-10" type="primary" @click="switchStation">确&emsp;定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import utils from '@/utils';
import Cookie from 'js-cookie';
import axios from '@/axios';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';

export default {
    components: {
        Breadcrumb,
        Hamburger
    },
    data() {
        return {
            // 是否显示站点
            switchVis: false,
            // 选择的站点
            selectStation: {},
            // 是否有总部
            isHadquarters: false
        };
    },
    computed: {
        ...mapGetters(['sidebar', 'userName', 'scopeStations', 'currentStation'])
    },
    mounted() {
        // hadquarters为总部站点或者单个站点
        let hadquarters = null;
        if (this.scopeStations.length === 1) {
            hadquarters = this.scopeStations[0];
        } else {
            hadquarters = this.scopeStations.find(item => {
                return item.stationCode === utils.station.hadquarters.code;
            });
        }
        if (hadquarters) {
            this.isHadquarters = true;
        }
        // 如果store没有站点 需要更新站点
        if (!this.currentStation || !this.currentStation.stationCode) {
            if (hadquarters) {
                Cookie.set('currentStationCode', hadquarters.stationCode);
                Cookie.set('currentStationName', hadquarters.stationName);
                this.setCurrentStation({ stationName: hadquarters.stationName, stationCode: hadquarters.stationCode });
            } else {
                this.switchVis = true;
            }
        }
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar');
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
        },
        showSwitchDialog() {
            if (!this.isHadquarters) {
                this.switchVis = true;
            }
        },
        switchStation() {
            const selectStation = this.selectStation;
            if (selectStation.stationCode && !this.isHadquarters) {
                axios
                    .post('/sys/switchCurrentStationCode', utils.param({ currentStationCode: selectStation.stationCode, currentStationName: selectStation.stationName }), {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .then(res => {
                        Cookie.set('currentStationCode', selectStation.stationCode);
                        Cookie.set('currentStationName', selectStation.stationName);
                        this.setCurrentStation({ stationName: selectStation.stationName, stationCode: selectStation.stationCode });
                        this.switchVis = false;
                    })
                    .catch(err => {
                        this.$tips.error(err.message);
                    });
            }
        },
        setCurrentStation(currentStation) {
            this.$store.dispatch('SetCurrentStation', currentStation);
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }
    .right-menu {
        float: right;
        height: 100%;
        &:focus {
            outline: none;
        }

        .avatar-wrapper {
            cursor: pointer;
            padding: 0 10px;
        }

        .station-wrapper {
            position: relative;
            display: inline-block;
            padding: 0 10px;
            font-size: 14px;
            cursor: pointer;
            &::after {
                content: '';
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                height: 22px;
                border-right: 1px solid #ccc;
            }
        }
    }
}
.switch-dialog {
    text-align: center;
    .station-select {
        width: 360px;
    }
}
</style>
