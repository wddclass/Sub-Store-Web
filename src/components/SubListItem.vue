
<template >
  <!-- 滚动内容 -->
  <!-- <nut-swipe class="sub-item-swipe" ref="swipe"> -->
  <div class="sub-item-wrapper" :style="{ padding: isSimpleMode ? '.6875rem' : '1rem' }"
    @click="showRightButton = !showRightButton">
    <!-- compareSub -->
    <div class="sub-item-top-wrapper">
      <div class="sub-img-wrapper" :style="{ 'line-height': isSimpleMode ? 1 : '' }">
        <nut-avatar v-if="props[props.type].icon" :size="isSimpleMode ? '36' : '48'" :url="props[props.type].icon"
          bg-color=""></nut-avatar>
        <nut-avatar v-else class="sub-item-customer-icon" :size="isSimpleMode ? '36' : '48'" :url="icon"
          bg-color=""></nut-avatar>
      </div>
      <div class="sub-item-content">
        <div class="sub-item-title-wrapper">

          <h3 v-if="!isSimpleMode" class="sub-item-title">
            {{ displayName || name }}
          </h3>
          <h3 v-else style="color: var(--primary-text-color); font-size: .875rem;">
            {{ displayName || name }}
          </h3>

          <div>
            <button class="refresh-sub-flow" @click.stop="onClickUpdateSub">
              <font-awesome-icon icon="fa-solid fa-arrow-rotate-right" />
            </button>
            <!-- 编辑 -->
            <button class="copy-sub-link" @click.stop="onClickEdit">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon>
            </button>


            <button class="copy-sub-link" @click.stop="showRightButton = !showRightButton">
              <font-awesome-icon icon="fa-solid fa-angles-right" />
            </button>

          </div>
        </div>
        <template v-if="!isSimpleMode">
          <p v-if="type === 'sub'" class="sub-item-detail">
            <template v-if="typeof flow === 'string'">
              <span>
                {{ flow }}
              </span>
            </template>
            <template v-else>
              <span>
                {{ flow.firstLine }}
              </span>
              <span> {{ flow.secondLine }} </span>
            </template>
          </p>
          <p v-else-if="type === 'collection'" class="sub-item-detail">
            {{ collectionDetail }}
          </p>
        </template>
        <template v-else>
          <p v-if="type === 'sub'" class="sub-item-detail-isSimple">

            <template v-if="typeof flow === 'string'">
              <span style="font-weight: normal;">
                {{ flow }}
              </span>
            </template>
            <template v-else>
              <span style="font-weight: normal;">
                {{ flow.firstLine }} &nbsp;
              </span>
              <span style="font-weight: normal;"> {{ flow.secondLine }} </span>
            </template>
          </p>
          <p v-else-if="type === 'collection'" class="sub-item-detail-isSimple">
            {{ collectionDetail }}
          </p>
        </template>

      </div>
    </div>
    <transition name="el-fade-in">
      <div class="sub-item-right-wrapper" :class="{ 'simple-mode-right-wrapper': isSimpleMode }" v-show="showRightButton">
        <button class="custom-button" @click.stop="onClickCopyConfig">
          <font-awesome-icon icon="fa-solid fa-paste" />
        </button>
        <button class="custom-button" @click="onClickPreview">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </button>
        <button class="custom-button" @click="compareSub">
          <font-awesome-icon icon="fa-solid fa-circle-half-stroke" />
        </button>
        <button class="custom-button" @click="onClickDelete">
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </button>
        <button class="custom-button" @click.stop="showRightButton = false">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>
    </transition>
  </div>
  <!-- <template v-if="isLeftRight" #left>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="primary" class="sub-item-swipe-btn" @click="onClickCopyConfig">
          <font-awesome-icon icon="fa-solid fa-paste" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="success" class="sub-item-swipe-btn" @click="onClickPreview">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="danger" class="sub-item-swipe-btn" @click="onClickDelete">
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>
    </template>

    <template v-else #right>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="primary" class="sub-item-swipe-btn" @click="onClickCopyConfig">
          <font-awesome-icon icon="fa-solid fa-paste" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="success" class="sub-item-swipe-btn" @click="onClickPreview">
          <font-awesome-icon icon="fa-solid fa-eye" />
        </nut-button>
      </div>
      <div class="sub-item-swipe-btn-wrapper">
        <nut-button shape="square" type="danger" class="sub-item-swipe-btn" @click="onClickDelete">
          <font-awesome-icon icon="fa-solid fa-trash-can" />
        </nut-button>
      </div>

    </template> -->
  <!-- </nut-swipe> -->

  <CompareTable v-if="compareTableIsVisible" :name="name" :compareData="compareData" @closeCompare="closeCompare" />
</template>

<script lang="ts" setup>
import { useSubsApi } from '@/api/subs';
import icon from '@/assets/icons/logo.svg';
import PreviewPanel from '@/components/PreviewPanel.vue';
import { usePopupRoute } from '@/hooks/usePopupRoute';
import { useAppNotifyStore } from '@/store/appNotify';
import { useGlobalStore } from '@/store/global';
import { useSubsStore } from '@/store/subs';
import { getString } from '@/utils/flowTransfer';
import { isMobile } from '@/utils/isMobile';
import CompareTable from '@/views/CompareTable.vue';
import { Dialog, Toast } from '@nutui/nutui';
import { useClipboard } from '@vueuse/core';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed, createVNode, ref, toRaw } from 'vue';
import useV3Clipboard from 'vue-clipboard3';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
// import { defineProps } from 'vue';


const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { t } = useI18n();

const props = defineProps<{
  type: 'sub' | 'collection';
  sub?: Sub;
  collection?: Collection;
}>();
const compareTableIsVisible = ref(false);
usePopupRoute(compareTableIsVisible);

const moreAction = ref();
const swipe = ref();
const swipeIsOpen = ref(false);
const compareData = ref();
const router = useRouter();
const globalStore = useGlobalStore();
const subsStore = useSubsStore();
const subsApi = useSubsApi();
const displayName =
  props[props.type].displayName || props[props.type]['display-name'];

const name = props[props.type].name;
const { flows } = storeToRefs(subsStore);
const collectionDetail = computed(() => {
  const nameList = props?.collection.subscriptions || [];
  if (nameList.length === 0) {
    return t('subPage.collectionItem.noSub');
  } else {
    const displayNameList = nameList.map(name => {
      const sub = subsStore.getOneSub(name);
      return sub?.displayName || sub?.['display-name'] || sub.name;
    });
    return `${t('subPage.collectionItem.contain')}：${displayNameList.join(
      '、'
    )}`;
  }
});
const { isFlowFetching, isSimpleMode, isLeftRight } = storeToRefs(globalStore);
const showRightButton = ref(false)

const flow = computed(() => {
  if (props.type === 'sub') {
    const urlList = Object.keys(flows.value);
    if (props.sub.source === 'local') return t('subPage.subItem.local');
    if (props.sub.loading) return t('subPage.subItem.loading');
    if (isFlowFetching.value && !urlList.includes(props.sub.url))
      return t('subPage.subItem.loading');

    const target = toRaw(flows.value[props.sub.url]);
    if (!target) {
      return {
        firstLine: t('subPage.subItem.noRecord'),
        secondLine: ``,
      };
    }

    if (target.status === 'success') {
      const {
        expires,
        total,
        usage: { upload, download },
      } = target.data;

      let secondLine: string;
      if (isSimpleMode.value) {
        secondLine = !expires
          ? ''
          : `${dayjs
            .unix(expires)
            .format('YYYY-MM-DD')}`;
        return {
          firstLine: `${getString(
            upload + download,
            total,
            'B'
          )}`,
          secondLine,
        };
      } else {
        secondLine = !expires
          ? t('subPage.subItem.noExpiresInfo')
          : `${t('subPage.subItem.expires')}：${dayjs
            .unix(expires)
            .format('YYYY-MM-DD')}`;
        return {
          firstLine: `${t('subPage.subItem.flow')}：${getString(
            upload + download,
            total,
            'B'
          )}`,
          secondLine,
        };
      }
    } else if (target?.status === 'failed') {
      if (target.error.code === 'NO_FLOW_INFO') {
        return {
          firstLine: t('subPage.subItem.noFlowInfo'),
          secondLine: ``,
        };
      } else {
        return {
          firstLine: `${target.error?.type}`,
          secondLine: `${target.error?.message}`,
        };
      }
    }
  }
});

const closeCompare = () => {
  compareTableIsVisible.value = false;
  router.back();
};

const compareSub = async () => {
  Toast.loading('生成节点对比中...', { id: 'compare', cover: true });
  const res = await useSubsApi().compareSub(
    props.type,
    props.sub ?? props.collection
  );
  if (res.data.status === 'success') {
    compareData.value = res.data.data;
    compareTableIsVisible.value = true;
    Toast.hide('compare');
  }
};
const swipeClose = () => {
  swipe.value.close();
};
const swipeController = () => {
  if (swipeIsOpen.value) {
    swipe.value.close();
    swipeIsOpen.value = false;
    moreAction.value.style.transform = 'rotate(0deg)';
  } else {
    if (isLeftRight.value) {
      swipe.value.open('right');
    } else {
      swipe.value.open('left');
      swipeIsOpen.value = true;
      moreAction.value.style.transform = 'rotate(180deg)';
    }

  }
};

const onDeleteConfirm = async () => {
  await subsStore.deleteSub(props.type, name);
  // Notify.danger(t('subPage.deleteSub.succeedNotify'), { duration: 1500 });
};

const onClickPreview = () => {
  Dialog({
    title: t('subPage.previewTitle'),
    content: createVNode(PreviewPanel, { name, type: props.type, copyText: t('editorPage.subConfig.basic.copy'), notify: t('syncPage.copyNotify.copySucceed') }),
    // onOpened: () => swipe.value.close(),
    popClass: 'auto-dialog',
    // @ts-ignore-next-line  组件库bug，类型错误但功能正常
    closeOnClickOverlay: true,
    noOkBtn: true,
    noCancelBtn: true,
    closeOnPopstate: true,
    lockScroll: true,
  });
};

const onClickCopyConfig = async () => {
  let data;
  switch (props.type) {
    case 'sub':
      data = JSON.parse(JSON.stringify(toRaw(props.sub)));
      break;
    case 'collection':
      data = JSON.parse(JSON.stringify(toRaw(props.collection)));
      break;
  }
  data.name += `-copy${~~(Math.random() * 10000)}`;

  Toast.loading(t('subPage.copyConfigNotify.loading'), { id: 'copyConfig' });
  await subsApi.createSub(props.type + 's', data);
  await subsStore.fetchSubsData();
  Toast.hide('copyConfig');
  showNotify({ title: t('subPage.copyConfigNotify.succeed') });
  // swipe.value.close();
};

const onClickEdit = () => {
  router.push(`/edit/${props.type}s/${name}`);
};

const onClickDelete = () => {
  Dialog({
    title: t('subPage.deleteSub.title'),
    content: createVNode(
      'span',
      {},
      t('subPage.deleteSub.desc', { displayName })
    ),
    onCancel: () => { },
    onOk: onDeleteConfirm,
    // onOpened: () => swipe.value.close(),
    popClass: 'auto-dialog',
    cancelText: t('subPage.deleteSub.btn.cancel'),
    okText: t('subPage.deleteSub.btn.confirm'),
    closeOnPopstate: true,
    lockScroll: true,
  });
};

// (() => {
//   let api = new URLSearchParams(window.location.search).get('api');
//   if (api) {
//     localStorage.setItem('api', api);
//   }
//   return api || localStorage.getItem('api') || import.meta.env.VITE_API_URL || 'https://sub.store';
// })();
const { showNotify } = useAppNotifyStore();

const onClickUpdateSub = async () => {
  // console.log(props.sub.url);
  await subsStore.fetchSingleFlow(props.sub.url, props.sub.name);
};
const onClickCopyLink = async () => {
  const host = localStorage.getItem('hostApi') || import.meta.env.VITE_API_URL || 'https://sub.store';
  const url = `${host}/download/${props.type === 'collection' ? 'collection/' : ''
    }${name}`;

  if (isSupported) {
    await copy(encodeURI(url));
  } else {
    await copyFallback(encodeURI(url));
  }
  showNotify({ title: t('subPage.copyNotify.succeed'), type: 'success' });
};

const onClickRefresh = async () => {
  Toast.loading(t('globalNotify.refresh.loading'), {
    cover: true,
    id: 'refresh',
  });
  await subsStore.fetchFlows(ref([props.sub]).value);
  Toast.hide('refresh');
  showNotify({ title: t('globalNotify.refresh.succeed') });
};


</script>

<style lang="scss" scoped>
.sub-item-customer-icon {
  :deep(img) {
    & {
      opacity: 0.80;
      filter: brightness(var(--img-brightness));
    }
  }
}

.sub-item-wrapper {
  width: calc(100% - 1.5rem);
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--item-card-radios);
  // padding: var(--safe-area-side);
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  position: relative;

  :deep(.nut-avatar) {
    flex-shrink: 0;
    width: 3.5rem;
    height: 3.5rem;
    margin-right: 1.25rem;
    border-radius: .75rem;

    img {
      object-fit: contain;
      border-radius: .625rem;
      filter: brightness(var(--img-brightness));
    }
  }

  .sub-item-top-wrapper {
    display: flex;
    .sub-img-wrapper {
      display: flex;
      align-items: center;
    }
    .sub-item-content {
      flex: 1;
      line-height: 1.3;

      .sub-item-title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .sub-item-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          font-size: 1rem;
          color: var(--primary-text-color);
        }

        .copy-sub-link,
        .refresh-sub-flow,
        .copy-sub-config {
          background-color: transparent;
          border: none;
          padding: 0 .5rem;
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;

          svg {
            width: 1rem;
            height: 1rem;
            color: var(--lowest-text-color);
          }
        }

        button {
          white-space: nowrap;
        }

        div {
          display: flex;
          align-items: center;
        }
      }

      .sub-item-detail {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        margin-top: .25rem;
        font-size: .75rem;
        color: var(--comment-text-color);

        span {
          display: block;
          line-height: 1.8;
        }
      }

      .sub-item-detail-isSimple {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: .75rem;
        margin-top: .1563rem;
        max-width: 80%;
        color: var(--comment-text-color);
      }
    }
  }

  .sub-item-right-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(250, 250, 250, 0.5);
    left: unset;
    right: .75rem;
    width: 75%;
    height: 100%;
    top: 0;
    -webkit-backdrop-filter: blur(.1875rem);
    backdrop-filter: blur(.1875rem);
    padding: 0 1.25rem;

    .custom-button {
      background-color: transparent;
      border: none;
      padding: 0 .5rem;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 1.375rem;
        height: 1.375rem;
        color: var(--second-text-color);
      }
    }
  }

  .simple-mode-right-wrapper {
    width: 80%;

    .custom-button {
      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}

.sub-item-swipe {
  :deep(.nut-swipe__left) {
    .sub-item-swipe-btn-wrapper {
      padding-left: 1.5rem;
    }
  }

  :deep(.nut-swipe__right),
  :deep(.nut-swipe__left) {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .sub-item-swipe-btn-wrapper {
      padding-left: .875rem;

      &:last-child {
        padding-right: .625rem;
      }

      .sub-item-swipe-btn {
        border-radius: 50%;
        height: 2.875rem;
        width: 2.75rem;
      }
    }
  }
}

.desc-about {
  display: block;
  padding: 6.25rem 1.875rem 21.875rem;
  color: var(--comment-text-color);
  font-size: .75rem;
  line-height: 1.25rem;
  margin-top: .5rem;
  margin-bottom: 1.25rem;
  text-align: left;

}

.desc-about span {
  display: inline-block;
  padding: .375rem 0 0 0;
}

.desc-title a,
.desc-about a {
  color: var(--primary-color);

}

.el-fade-in-enter-active,
.el-fade-in-leave-active {
  transition: all .3s cubic-bezier(.55, 0, .1, 1)
}

.el-fade-in-enter-from,
.el-fade-in-leave-active {
  opacity: 0
}
</style>
