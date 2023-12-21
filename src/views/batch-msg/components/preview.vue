<!--
 * @Date: 2023-07-18 17:48:30
 * @LastEditors: zbx
 * @LastEditTime: 2023-12-21 13:41:08
 * @descript: 文件描述
-->
<template>
    <a-modal v-model:visible="visible" :title="batchObj.AccountName || '预览'" titleAlign="center" :width="380"
        :mask-closable="true" draggable :footer="false" modal-class="previewModal">
        <div class="timeTitle">{{ batchObj.UpdateTime }}</div>
        <div class="previewCon">
            <a-avatar :size="34" :image-url="logoUrl" class="headImg"></a-avatar>
            <div v-if="batchObj.BatchMessageType === 111" class="cardCon">
                <div class="ArticleTitle">{{ batchObj.ArticleTitle }}</div>
                <div class="articleCenter">
                    <div class="ArticleDesc">{{ batchObj.ArticleDesc }}</div>
                    <div class="imgCon">
                        <a-avatar :size="40" :image-url="batchObj.ArticleLogo || articleImg" shape="square"
                            class=" logoIcon"></a-avatar>
                    </div>
                </div>
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
                    <li v-for="imgItem in batchObj.ImageList" :key="imgItem.uid" class="imgCon">
                        <img :src="imgItem.url" :alt="imgItem.name">
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
import articleImg from "@/assets/images/articleImg.png"
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
        BatchMessageType: data.BatchMessageType || 110,
        Text: data.Text || data.Content,
        ImageList: data.ImageList || []

    }
    visible.value = true;
};

defineExpose({
    showAppPreview,
});
</script>

<style lang="less" ></style>
