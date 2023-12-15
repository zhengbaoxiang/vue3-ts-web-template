<!--
 * @Date: 2023-07-18 17:48:30
 * @LastEditors: zbx
 * @LastEditTime: 2023-12-15 17:43:21
 * @descript: 文件描述
-->
<template>
    <a-modal v-model:visible="visible" :title="batchObj.AccountName || '预览'" titleAlign="center" :width="380"
        :mask-closable="true" draggable :footer="false" modal-class="previewModal">
        <div class="timeTitle">{{ batchObj.UpdateTime }}</div>
        <div class="previewCon">
            <a-avatar :size="34" :image-url="logoUrl" class="headImg"></a-avatar>
            <div v-if="batchObj.ContentType === 111" class="cardCon">
                <div class="articleTitle">{{ batchObj.articleTitle }}</div>
                <div class="articleDesc">{{ batchObj.articleDesc }}</div>
                <div class="source">
                    <a-avatar :size="18" :image-url="logoUrl" class="logoIcon"></a-avatar>
                    <span class="footTitle">东方财富</span>
                </div>
            </div>
            <div v-else class="richCon">
                <div class="textContent">
                    {{ batchObj.Text }}
                </div>
                <ul class="imgList">
                    <li v-for="item in batchObj.imageList" :key="item.uid" class="imgCon">
                        <img :src="item.url" :alt="item.name">
                    </li>
                </ul>
            </div>
        </div>
        <div class="note">

            东方财富不会找您索要任何敏感信息，如验证码，密码</div>
        <template #footer>
            <a-button @click="visible = false">关闭</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message, Modal } from '@arco-design/web-vue';
import { AnyObject } from '@/types/global';
import useLoading from '@/hooks/loading';

import logoUrl from "@/assets/images/logo.png"
import { formatTime } from '@/utils/tools';
const { loading, setLoading } = useLoading(false);

const formRef = ref<FormInstance>();
const visible = ref(false);

const batchObj = ref<AnyObject>({})

const showAppPreview = (data: AnyObject) => {
    console.log('预览', data)
    batchObj.value = {
        ...data,
        UpdateTime: data.UpdateTime || formatTime(new Date().getTime()),
        ContentType: data.ContentType || 110,
        Text: data.Text || data.Content,
        articleDesc: data.articleDesc.length > 50 ? data.articleDesc.slice(0, 50) + '...' : data.articleDesc,
        imageList: data.imageList || [

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

    }
    visible.value = true;
};

defineExpose({
    showAppPreview,
});
</script>

<style lang="less" >
.arco-modal.previewModal {
    .arco-modal-header {
        background-color: #eb5508;
    }

    .arco-modal-body {
        background-color: #f7f7f7;
        height: 600px;
    }

    .timeTitle {
        margin: 0px 0 15px;
        font-size: 12px;
        font-family: "Helvetica Neue";
        color: #817d7d;
        text-align: center;
    }

    .note {
        margin: 15px auto 0px;
        width: 240px;
        font-size: 14px;
        font-family: "Helvetica Neue";
        color: #817d7d;
        text-align: center;
    }

    .previewCon {
        overflow: auto;
        position: relative;

        // background-color: #0f0f0f;
        .headImg.arco-avatar {
            position: absolute;
            left: 0px;
            top: 0px;
        }

        .richCon,
        .cardCon {
            margin-left: 45px;
            background-color: #fff;
            padding: 10px 10px 5px;
            border-radius: 5px;
            width: 250px;

        }

        .richCon .textContent {
            word-break: break-all;
        }

        .richCon .imgList {
            margin-top: 16px;
            display: flex;

            .imgCon {
                flex: 1;
                text-align: center;
                height: 150px;
            }

            .imgCon img {
                max-height: 100%;
                max-width: 99%;
            }
        }

        .cardCon .articleTitle {
            font-weight: bold;
            font-size: 16px;
        }

        .cardCon .articleDesc {
            font-size: 12px;
            color: grey;
            margin-bottom: 15px;
            max-height: 100px;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .cardCon .source {
            border-top: 1px solid #f7f7f7;
            font-size: 12px;
            color: grey;

            .footTitle {
                display: inline-block;
                margin: 3px 10px 0;
                vertical-align: bottom;
            }

        }



    }

}
</style>
