<template>
    <div v-loading="listLoading">
        <el-table :data="dataSource" border fit highlight-current-row style="width: 100%">
            <el-table-column v-for="(item,index) in columns" :fixed="item.fixed" :label="item.title" :key="index" :width="item.width" align="center">
                <template slot-scope="scope">
                    <template v-if="item.command">
                        <el-button v-for="(btns,i) in item.command" v-if="columnVisible(btns,scope.row)" :key="i" size="small" @click="columnClick(btns,scope.row)">{{ btns.text }}</el-button>
                    </template>
                    <template v-else>
                        <span v-if="!item.template">{{ scope.row[item.field] }}</span>
                        <span v-else>{{ item.template(scope.row) }}</span>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :current-page="pageOptions.page" :page-sizes="[10, 50, 100]" :page-size="10" :total="pageOptions.total" layout="total,sizes,prev,pager,next,jumper" class="pagination" @size-change="sizeChange" @current-change="currentChange" />
    </div>
</template>

<script>
import axios from '@/axios';
import _ from 'underscore';

export default {
    name: 'MyTable',
    props: {
        url: String,
        params: Object,
        columns: Array,
        autoBind: Boolean
    },
    data() {
        return {
            listLoading: false,
            dataSource: [],
            pageOptions: { page: 1, pageSize: 10 }
        };
    },
    created() {
        if (this.autoBind) {
            this.read();
        }
    },
    methods: {
        read() {
            if (!this.listLoading) {
                this.listLoading = true;
                const params = Object.assign(this.params, this.pageOptions);
                const request = axios.post(this.url, params);
                request
                    .then(
                        res => {
                            for (const key in res) {
                                const content = res[key];
                                if (_.isArray(content)) {
                                    this.dataSource = content;
                                    this.pageOptions.total = content.length;
                                    break;
                                } else if (content.hasOwnProperty('content')) {
                                    this.dataSource = content.content;
                                    this.pageOptions.total = content.totalElements;
                                    break;
                                } else if (content.hasOwnProperty('results')) {
                                    this.dataSource = content.results;
                                    this.pageOptions.total = content.totalElements;
                                    break;
                                }
                            }
                        },
                        err => {
                            this.$message.error(err.message);
                        }
                    )
                    .finally(() => {
                        this.listLoading = false;
                    });
                return request;
            }
        },
        sizeChange(val) {
            this.pageOptions.pageSize = val;
            this.read();
        },
        currentChange(val) {
            this.pageOptions.page = val;
            this.read();
        },
        columnClick(column, row) {
            if (column.click) {
                column.click(row);
            }
        },
        columnVisible(column, row) {
            if (column.visible) {
                return column.visible(row);
            }
            return true;
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pagination {
    margin-top: 10px;
    text-align: center;
}
</style>
