<template>
    <div class="app-container">
        <el-card shadow="hover">
            <authorization @authPass="authPass" />
        </el-card>
    </div>
</template>

<script>
import authorization from '@/components/authorization';

export default {
    name: 'Auth',
    components: {
        authorization
    },
    methods: {
        authPass(res) {
            this.$store.dispatch('SetAuthorizeKey', res);
            this.$router.push(this.$route.query.toPath);
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
    background-color: #f0f2f5;
    padding: 30px;
}
</style>
