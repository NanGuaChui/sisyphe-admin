<template>
    <div>
        <el-row>
            <el-col :xs="24" :sm="size.sm" :lg="size.lg">
                <el-form :model="authFrom" :rules="demoRules">
                    <el-form-item prop="userCode">
                        <md-input v-model="authFrom.userCode" icon="search" name="userCode" placeholder="授权账号">授权账号</md-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <md-input v-model="authFrom.password" icon="search" name="password" placeholder="授权密码">授权密码</md-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="text-center">
            <el-button type="primary" @click="authorize">提供授权</el-button>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import utils from '@/utils';
import MdInput from '@/components/MDinput';
import axios from '@/axios';

export default {
    components: {
        MdInput
    },
    props: {
        type: String
    },
    data() {
        const validate = (rule, value, callback) => {
            if (value.length !== 3) {
                callback(new Error('请输入六个字符'));
            } else {
                callback();
            }
        };
        return {
            size: { sm: { span: 12, offset: 6 }, lg: { span: 8, offset: 8 } },
            authFrom: { userCode: 'CKGAA178', password: 'A178' },
            demoRules: {
                authAcount: [{ required: true, trigger: 'change', validator: () => validate }],
                authPassword: [{ required: true, trigger: 'change', validator: () => validate }]
            }
        };
    },
    created() {
        if (this.$props.type === 'pop') {
            this.size = {
                lg: { span: 16, offset: 4 }
            };
        }
    },
    methods: {
        authorize() {
            const params = {
                userCode: this.authFrom.userCode,
                password: this.authFrom.password,
                jurisdictionCode: this.$route.query.jurisdictionCode,
                jurisdictionType: 3
            };
            axios.axios.post('/sys/authorizeLogin', utils.param(params), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(
                res => {
                    // 跳转到需要进入的页面
                    this.$emit('authPass', res);
                    this.$store.dispatch('HideModal');
                },
                err => {
                    Message.error(err.message);
                }
            );
        }
    }
};
</script>
