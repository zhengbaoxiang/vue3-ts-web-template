<template>
    <a-drawer v-model:visible="visible" :title="pageFormTitle" placement="right" :width="600" :mask-closable="true"
        unmountOnClose>
        <a-form :model="pageForm" :rules="rules" ref="formRef" layout="horizontal" auto-label-width>
            <a-form-item field="SendAccount" label="发送账号">
                <a-input v-model="pageForm.SendAccount" :readonly="true" />
            </a-form-item>
            <a-form-item field="TargetUser" label="目标对象">
                <a-input v-model="pageForm.TargetUser" :readonly="readonly" :max-length="40" show-word-limit />
            </a-form-item>
            <a-form-item field="SendReason" label="发送目的" feedback>
                <a-input v-model="pageForm.SendReason" :readonly="readonly" :max-length="40" show-word-limit />
            </a-form-item>
            <a-form-item field="FileId" label="上传名单">
                <a-upload :disabled="readonly" accept=".xls,.xlsx" action="/" :auto-upload="false" :limit="1"
                    ref="uploadRef" show-link download @before-upload="beforeUploadFile" @before-remove="beforeRemove"
                    @change="onFileChange" :default-file-list="pageForm.FileList" :show-remove-button="viewType !== 'view'">
                </a-upload>

                <template #extra>
                    <span>请按照附件格式上传。附件：
                        <a-link @click="downLoadTemp">上传名单示例</a-link></span>
                </template>
            </a-form-item>
            <a-form-item field="num" label="发放人数">
                <span>{{ pageForm.TargetUserCount || 0 }}</span>
                <!-- <a-input-number v-model="pageForm.TargetUserCount" :min="0" :max="999" /> -->
            </a-form-item>

            <a-form-item label="发放操作员" v-if="pageForm.SendOperatorName">
                <span>{{ pageForm.SendOperatorName }}</span>
            </a-form-item>
            <a-form-item label="发放时间" v-if="pageForm.SendDateTime">
                <span>{{ pageForm.SendDateTime }}</span>
            </a-form-item>

            <a-form-item field="ContentType" label="发送方式" :rules="[{ required: true, message: '请选择发送方式' }]">
                <a-radio-group v-model="pageForm.ContentType">
                    <a-radio :value="110">消息通知</a-radio>
                    <a-radio :value="111">活动卡片</a-radio>
                </a-radio-group>
            </a-form-item>

            <template v-if="pageForm.ContentType == 110">
                <a-form-item field="Text" label="发送内容" :rules="{ required: true, message: '请输入发送内容' }">
                    <a-textarea :readonly="readonly" v-model="pageForm.Text" :max-length="300" show-word-limit :auto-size="{
                        minRows: 5,
                        maxRows: 11,
                    }" />
                </a-form-item>
                <a-form-item field="imageList" label="发送图片">
                    <a-upload :disabled="readonly" accept=".jpg,.png,.jpeg,.bmp" action="/" :auto-upload="false" :limit="2"
                        list-type="picture-card" image-preview ref="uploadImgRef" @before-upload="beforeUploadImg"
                        @before-remove="beforeRemoveImg" v-model:file-list="pageForm.imageList"
                        :default-file-list="pageForm.imageList" :show-remove-button="viewType !== 'view'">
                    </a-upload>

                    <template #extra>
                        <span>请点击上传图片，最多两张，支持jpg、png、bmp格式。</span>
                    </template>
                </a-form-item>
            </template>

            <template v-if="pageForm.ContentType == 111">
                <a-form-item field="articleTitle" label="卡片标题" :rules="{ required: true, message: '请输入发送标题' }">
                    <a-input v-model="pageForm.articleTitle" :readonly="readonly" :max-length="40" show-word-limit />
                </a-form-item>
                <a-form-item field="articleDesc" label="卡片摘要">
                    <a-textarea :readonly="readonly" v-model="pageForm.articleDesc" :max-length="300" show-word-limit
                        :auto-size="{
                            minRows: 5,
                            maxRows: 11,
                        }" />
                </a-form-item>
                <a-form-item field="articleAndroidUrl" label="链接-安卓" :rules="{ required: true, message: '请输入链接' }">
                    <a-input v-model="pageForm.articleAndroidUrl" :readonly="readonly" :max-length="100" show-word-limit />
                </a-form-item>
                <a-form-item field="articleIosUrl" label="链接-IOS" :rules="{ required: true, message: '请输入链接' }" v>
                    <a-input v-model="pageForm.articleIosUrl" :readonly="readonly" :max-length="100" show-word-limit />
                </a-form-item>
            </template>
        </a-form>
        <template #footer>
            <a-button @click="toPreview" class="fl" type="primary">预览</a-button>
            <template v-if="viewType !== 'view'">
                <a-button @click="closePage">关闭</a-button>
                <a-button @click="confirmPage" type="primary" status="success" :loading="loading">{{ textObj.save
                }}</a-button>
                <a-button @click="sendMsg" v-if="showSendBtn" type="primary" :loading="loading">{{ textObj.send
                }}</a-button>
            </template>
            <template v-else>
                <a-button @click="visible = false">关闭</a-button>
            </template>
        </template>
    </a-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useAppStore, useUserStore, useComStore } from '@/store';
import Form, { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal, Drawer } from '@arco-design/web-vue';
import { Pagination, Options, AnyObject, AccountInfo } from '@/types/global';
import { BatchMessageApi, BatchTargetUserApi } from '@/api/batch-msg';
import useLoading from '@/hooks/loading';
import { fileObjToStr, handleBLob } from '@/utils/tools';
import config from '@/config';
import { IMAPI } from '@/api/IMAPI';
const { loading, setLoading } = useLoading(false);

const userStore = useUserStore();
const comStore = useComStore();

// const props = defineProps(['foo'])
// console.log('->',props.foo)
const emit = defineEmits(['refresh', 'toPreview']);
// emit('refresh')

// public enum EnumBatchMessageState {
//  新增还没保存草稿的  0
//  //已保存
//   Saved = 1,
//   //已发送
//   Send = 2,
//   //已审核通过
//   Audit = 3,
//   //审核不通过
//   AuditNotPassed = 4,
//   //已推送
//   Pushed = 5,

//   //已撤回
//   Withdrawed = 6

//   //部分成功推送
//   PartialPushed = 7,

//   //撤回中
//    = 8

const formRef = ref<FormInstance>();
const visible = ref(false);
const pageForm = ref<AnyObject>({});
// 整个表单的校验规则
const rules = {
    SendAccount: {
        required: true,
        message: '请输入',
    },
    TargetUser: {
        required: true,
        message: '请输入',
    },
    SendReason: {
        required: true,
        message: '请输入',
    },

    FileId: {
        required: true,
        message: '请上传文件',
        trigger: 'blur',
    },
};

// 生命周期
onMounted(() => { });

const viewType = ref(''); // 'add' | 'edit' | 'view'
const readonly = computed(() => {
    return viewType.value === 'view';
});
const pageFormTitle = computed(() => {
    return { add: '新增消息', edit: '编辑消息', view: '查看详情' }[
        viewType.value
    ];
});
// 当前账户是本人在线，才能发送
const showSendBtn = computed(() => {
    let id = pageForm.value.SendAccount;
    let State = 0;
    comStore.accountList.forEach((item: AccountInfo) => {
        if (item.PassportId === id) {
            State = item.State;
        }
    });
    console.log('-State>', State);
    return State === 1;
});

const textObj: AnyObject = computed(() => {
    let State = pageForm.value.State;
    switch (State) {
        case 4:
            return { send: '重新发送', save: '保存为草稿' };
            break;
        default:
            return { send: '发送', save: '保存' };
    }
});

// 文件上传逻辑
const beforeUploadFile = async (file: Blob) => {
    console.log('-before-upload-file>', file);
    const formData = new FormData();
    formData.append('user', file);
    formData.append('FileName', file['name']);
    const { data } = await BatchTargetUserApi.AddBatchTargetUser(formData);
    Message.success('上传成功');
    console.log('->', data);
    // 异步处理，file上传接口成功后返回，拿到返回id,加到表单上，一起提交
    pageForm.value.FileId = data;
    pageForm.value.FileName = file['name'];
    return true;
};
const beforeRemove = (fileItem: any) => {
    console.log('-beforeRemove>', fileItem);
    pageForm.value.FileId = null;
    return Promise.resolve(true);
};

const onFileChange = (_: any, currentFile: AnyObject) => {
    console.info(currentFile);
    currentFile.status = 'done';
};
// 下载文件逻辑
const downLoadTemp = async () => {
    const res = await BatchTargetUserApi.GetSampleFile();
    handleBLob(res);
};

// 文件上传逻辑
const beforeUploadImg = async (file: Blob) => {
    console.log('-before-upload-file>', file);

    fileObjToStr(file, async (imgStr: string) => {
        const params = {
            base64Content: imgStr.split(";base64,")[1],  //  base64
            imageName: file['name'],
        }
        // const data = {
        //     "ThumbUrl": "https://imcpftestv2.eastmoney.com/IMAPI/img/akgvtwcllx/thumb_a7f7e8540db242afac8910e077af1442back.jpg",
        //     "Url": "https://imcpftestv2.eastmoney.com/IMAPI/img/akgvtwcllx/a7f7e8540db242afac8910e077af1442back.jpg",
        //     "FileName": "back.jpg",
        //     "MD5": "1B9B6A442240A56A96FC68CC8732048E"
        // }
        const { data } = await IMAPI.ImageUpLoad(params)
        Message.success('上传成功');

        const temp = {
            uid: data.MD5,
            name: data.FileName,
            url: data.Url
        }
        pageForm.value.imageList.push(temp)
        console.log('imageList', pageForm.value.imageList)
        return true;
    })
}
const beforeRemoveImg = (fileItem: any) => {
    console.log('-beforeRemove>', fileItem);
    return Promise.resolve(true);
};


// 预览
const toPreview = async () => {
    const errors = await formRef.value?.validate();
    if (!errors) {
        const params = {
            ...pageForm.value,
        };
        emit('toPreview', params);
    }
};

//  表单常用增加编辑逻辑
const toAdd = (row: AnyObject) => {
    viewType.value = 'add';
    pageForm.value = {
        id: null,
        ...row,
        State: 0,
        ContentType: 110,
        Content: '',
        Text: '',
        imageList: [],
        articleTitle: '',
        articleDesc: '',
        articleIosUrl: '',
        articleAndroidUrl: '',
        FileList: [],
    };
    formRef.value?.resetFields();
    visible.value = true;
};

const toEdit = (row: AnyObject) => {
    viewType.value = 'edit';

    const url =
        config.serviceHost +
        config.baseURL +
        `/BatchTargetUser/GetUsers?batchMessageId=${row.BatchMessageId}`;

    pageForm.value = {
        id: row.BatchMessageId,
        ...row,
        ContentType: row.ContentType || 110,
        Text: row.Text || row.Content,
        FileList: [
            {
                uid: row.FileId,
                name: row.FileName,
                url: url,
            },
        ],
        imageList: row.imageList || [
            {
                uid: 'jkhjkhjkhj2',
                name: '20200717-103937.png',
                url: "https://imcpftestv2.eastmoney.com/IMAPI/img/akgvtwcllx/a7f7e8540db242afac8910e077af1442back.jpg",
            },
        ]
    };
    // this.$refs.pageForm.resetFields();
    formRef.value?.resetFields();
    visible.value = true;
};
// 查看详情
const toView = (row: AnyObject) => {
    viewType.value = 'view';

    const url =
        config.serviceHost +
        config.baseURL +
        `/BatchTargetUser/GetUsers?batchMessageId=${row.BatchMessageId}`;

    pageForm.value = {
        id: row.BatchMessageId,
        ...row,
        ContentType: row.ContentType || 110,
        Text: row.Text || row.Content,
        FileList: [
            {
                uid: row.FileId,
                name: row.FileName,
                url: url,
            },
        ],
        imageList: row.imageList || []
    };
    // this.$refs.pageForm.resetFields();
    formRef.value?.resetFields();
    visible.value = true;
};

const closePage = () => {
    Modal.confirm({
        title: '提示',
        titleAlign: 'start',
        content: '关闭界面后，未保存的数据将会丢失，确认关闭吗？',
        onOk: async () => {
            visible.value = false;
        },
    });
};

function getContent(p) {
    let obj = {}
    if (p.ContentType === 111) {
        obj = {
            articleTitle: p.Text,
            articleDesc: p.Text,
            articleIosUrl: p.Text,
            articleAndroidUrl: p.Text,
        }
    } else {
        obj = {
            Text: p.Text,
            imageList: p.imageList || []
        }
    }
    return JSON.stringify(obj)
}
// 确认
const confirmPage = async () => {
    console.log('-pageForm>', pageForm.value)
    const errors = await formRef.value?.validate();
    if (!errors) {
        const params = {
            ...pageForm.value,
            Content: getContent(pageForm.value)
        };
        console.log('-参数>', params);

        // 把图文类型，以及卡片类型对象拼接，转为json字符串content
        if (pageForm.value.id) {
            edit(params);
        } else {
            add(params);
        }
    }
};
// 发送
const sendMsg = async () => {
    const errors = await formRef.value?.validate();
    if (!errors) {
        const params = {
            ...pageForm.value,
            Content: getContent(pageForm.value)
        };
        console.log('-参数>', params);
        setLoading(true);
        try {
            // 区别于直接草稿发送 sendBatch ，还是审批拒绝后重新发送 editAndSend
            const apiName = pageForm.value.State === 4 ? 'editAndSend' : 'sendBatch';

            await BatchMessageApi[apiName](params);
            Message.success('发送成功');
            visible.value = false;
            emit('refresh');
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }
};
const add = async (params: AnyObject) => {
    setLoading(true);
    try {
        const { data } = await BatchMessageApi.add(params);
        Message.success('保存成功');
        emit('refresh');

        visible.value = false;
        // 可多次返回时，不能关闭，需要将响应data返回的id,绑定，下次提交保存时，调更新接口
        // console.log('-data>', data);
        // pageForm.value.id = data
        // pageForm.value.BatchMessageId = data
    } catch (error) {
    } finally {
        setLoading(false);
    }
};
const edit = async (params: AnyObject) => {
    setLoading(true);
    try {
        // 区别于直接草稿发送 edit  ，还是审批拒绝后重新发送 auditEdit
        const apiName = pageForm.value.State === 4 ? 'auditEdit' : 'edit';
        await BatchMessageApi[apiName](params);
        Message.success('操作成功');
        emit('refresh');
        visible.value = false;
    } catch (error) {
    } finally {
        setLoading(false);
    }
};

defineExpose({
    toAdd,
    toEdit,
    toView,
});
</script>
