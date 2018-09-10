<template>
    <div>
        <div class="dashboard-container">
            <div class="dashboard-text">用户:{{ userName }}</div>
            <div class="dashboard-text">
                <p>管理权限范围:</p>
                <span v-for="role in scopeStations" :key="role.stationCode">{{ role.stationName }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Dashboard',
    computed: {
        ...mapGetters(['userName', 'scopeStations'])
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 16px;
        line-height: 200%;
        span {
            display: inline-block;
            width: 240px;
        }
    }
}
</style>
