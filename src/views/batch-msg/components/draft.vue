<template>
    <a-card class="general-card pt15" title="">
        <a-form :model="queryInfo" class="form mb10" layout="inline" style="width: 100%">
            <a-form-item>
                <a-range-picker v-model="queryInfo.dataRange" show-time format="YYYY-MM-DD HH:mm"
                    :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }" style="width: 320px" />
            </a-form-item>
            <a-form-item v-if="role === 'Admin'">
                <a-select v-model="queryInfo.sendAccount" style="width: 200px" placeholder="请选择账号" allow-clear>
                    <a-option :value="item.value" v-for="(item, index) in accountList" :key="index">{{ item.label
                    }}</a-option>
                </a-select>
            </a-form-item>
            <a-button type="primary" @click="search" class="mr10">
                <template #icon>
                    <icon-search />
                </template>
                查询
            </a-button>
        </a-form>
        <a-list :max-height="590" :data="dataList" hoverable size="medium" class="list-demo-action-layout" :bordered="true">
            <a-list-item v-for="(item, idx) in dataList" :key="idx" class="list-demo-item" action-layout="horizontal">
                <a-row class="grid-demo">
                    <a-col :span="12">
                        <span>更新时间：{{ item.UpdateTime }}</span>
                    </a-col>
                </a-row>

                <a-row class="grid-demo">
                    <a-col :span="12">
                        <span>名单信息：
                            <a-link @click="downLoadFile(item)">{{
                                item.FileName
                            }}</a-link></span>
                    </a-col>
                    <a-col :span="12">
                        <span>发放人数：{{ item.TargetUserCount }}</span>
                    </a-col>
                </a-row>
                <a-row class="grid-demo">
                    <a-col :span="12">
                        <p>目标对象：{{ item.TargetUser }}</p>
                    </a-col>
                    <a-col :span="12">
                        <p>发送目的：{{ item.SendReason }}</p>
                    </a-col>
                </a-row>
                <template v-if="item.ContentType === 111">
                    <a-row class="grid-demo">
                        <a-col :span="12">
                            <p>卡片标题：{{ item.articleTitle }}</p>
                        </a-col>
                        <a-col :span="12">
                            <p style="display: flex">
                                <span style="width: 70px;flex: none;">卡片摘要： </span>
                                <span> {{ item.articleDesc }}</span>
                            </p>
                        </a-col>
                    </a-row>
                    <a-row class="grid-demo">
                        <a-col :span="12">
                            <p style="display: flex">
                                <span style="width:70px;flex: none;">安卓链接：</span>
                                <span>{{ item.articleAndroidUrl }}</span>
                            </p>
                        </a-col>
                        <a-col :span="12">
                            <p style="display: flex">
                                <span style="width:70px;flex: none;">IOS链接：</span>
                                <span>{{ item.articleIosUrl }}</span>
                            </p>
                        </a-col>
                    </a-row>
                </template>
                <template v-else>
                    <div class="sendContent">
                        <span class="spanTitle">发送内容：</span>
                        <span class="content">
                            <a-typography-text :ellipsis="{
                                rows: 2,
                                expandable: true,
                                // showTooltip: true,
                                showTooltip: {
                                    type: 'popover',
                                    props: {
                                        style: { maxWidth: `600px` },
                                    },
                                },
                            }">
                                {{ item.Content }}
                            </a-typography-text>
                        </span>
                    </div>
                    <div class="sengImg">
                        <span class="spanTitle">发送图片：</span>
                        <ul class="imgList">
                            <li v-for="imgItem in item.imageList" :key="imgItem.uid" class="imgCon">
                                <img :src="imgItem.url" :alt="imgItem.name">
                            </li>
                        </ul>
                    </div>
                </template>

                <template #actions>
                    <div class="actionCon">
                        <div class="top">
                            <a-popconfirm content="确认要删除该数据吗?" @ok="toDel(item)">
                                <a-button class="mr10"> 删除</a-button>
                            </a-popconfirm>
                            <a-button @click="toEdit(item)" status="warning">
                                继续编辑
                            </a-button>
                        </div>
                        <div class="bot">
                            <a-button @click="toPreview(item)" type="primary">
                                预览
                            </a-button>
                        </div>
                    </div>
                </template>
            </a-list-item>
        </a-list>
        <div class="pt10">
            <a-pagination size="small" :total="pagination.total" :current="pagination.pageIndex" show-total show-page-size
                :default-page-size="pagination.pageSize" :page-size-options="[10, 20, 50, 100]" @change="onPageChange"
                @page-size-change="onPageSizeChange" style="justify-content: flex-end" />
        </div>
        <FormDarwer ref="modalRef" @refresh="refresh" @toPreview="toPreview"></FormDarwer>
    </a-card>
</template>
<script lang="ts" setup>
import {
    defineComponent,
    ref,
    computed,
    reactive,
    onBeforeMount,
    onMounted,
} from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import { Message, Modal } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject } from '@/types/global';

import { getToken, setToken, formatDate, handleBLob } from '@/utils/tools';
import { BatchMessageApi, BatchTargetUserApi } from '@/api/batch-msg';
import FormDarwer from './formDarwer.vue';

const emit = defineEmits(['refresh', 'toPreview']);
const props = defineProps(['accountList']);

const userStore = useUserStore();
const comStore = useComStore();
const role = userStore.role;

const basePagination: Pagination = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
};
const pagination = reactive({
    ...basePagination,
});

const queryInfo = reactive({
    sendAccount: '',
    dataRange: [],
    state: 0,
});

onMounted(() => {
    setTimeout(() => {
        queryInfo.sendAccount = comStore.currentAccount.PassportId; //  初始值
        search();
    }, 100);
});

// 分页列表
const dataList = ref<any[]>([]);
const getDataList = async () => {
    if (role !== 'Admin') {
        queryInfo.sendAccount = comStore.currentAccount.PassportId; // 更新
    }
    const params = {
        ...queryInfo,
        sendDateTimeStart: (queryInfo.dataRange && queryInfo.dataRange[0]) || '',
        sendDateTimeEnd: (queryInfo.dataRange && queryInfo.dataRange[1]) || '',
        ...pagination,
    };
    try {
        const { data, count } = await BatchMessageApi.getList(params);
        const list = data || [];
        list.forEach((item: any, index: number) => {
            if (index % 2 === 0) {
                item.ContentType = 110
                item.imageList = [

                    {
                        uid: 'jkhjkhjkhj2',
                        name: '20200717-103937.png',
                        url: "https://imcpftestv2.eastmoney.com/IMAPI/img/akgvtwcllx/a7f7e8540db242afac8910e077af1442back.jpg",
                    },
                    {
                        uid: 'assdasdas',
                        name: '20200717-dd.png',
                        url: "https://imcpftestv2.eastmoney.com/IMAPI/img/akgvtwcllx/068bed0795ca4308bbc58eef426b70b2%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231215165505.png",
                    },
                ]
            } else {
                item.ContentType = 111
                item.articleTitle = '发射点发射点发顺丰发撒旦萨芬十大发射点发'
                item.articleDesc = '阿斯蒂芬撒旦发射点发射点发射点发射点发士大夫发发生发撒打发是访问阿斯顿的v啊士大'
                item.articleAndroidUrl = 'sadfasdfasdfasdfsadfasfsadfsd'
                item.articleIosUrl = 'asdfdfasfdfasdfasdfsdafa'
            }
        });
        dataList.value = list;
        pagination.total = count;
    } catch (error) {
        console.log('-error>', error);
        dataList.value = [];
        pagination.total = 0;
    }
};
const refresh = () => {
    getDataList();
};
const search = () => {
    pagination.pageIndex = 1;
    getDataList();
};
const onPageChange = (pageIndex: number) => {
    pagination.pageIndex = pageIndex || 1;
    getDataList();
};
const onPageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    getDataList();
};

// 下载文件逻辑
const downLoadFile = async (item: AnyObject) => {
    const params = {
        // fileId: item.FileId,
        batchMessageId: item.BatchMessageId,
    };
    const res = await BatchTargetUserApi.GetUsers(params);
    handleBLob(res);
};

// 弹窗逻辑
const modalRef = ref<InstanceType<typeof FormDarwer> | null>(null);
// 打开编辑窗口
const toEdit = (row: AnyObject) => {
    modalRef.value?.toEdit(row);
};
// 删除提示
const toDel = async (row: AnyObject) => {
    const params = {
        BatchMessageId: row.BatchMessageId,
    };
    await BatchMessageApi.del(params);
    Message.success('删除成功');
    getDataList();
};

// 打开预览窗口
const toPreview = (row: AnyObject) => {
    emit('toPreview', row);

};

defineExpose({
    refresh,
});
</script>
<style lang="less" scoped>
</style>
