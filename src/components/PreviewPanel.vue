<template>
  <ul class="preview-list">
    <li v-for="platform in platformList" :key="platform.name">
      <a :href="`${host}/download/${type === 'sub' ? '' : 'collection/'
        }${name}?target=${platform.path}`" target="_blank">
        <div>
          <img :src="platform.icon" alt="" class="auto-reverse" />
        </div>
        <p>{{ platform.name }}</p>
      </a>
      <div class="nut-button nut-button--primary nut-button--small nut-button--round" @click="copyLink(platform.path)">
        {{ copyText }}
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import surge from '@/assets/icons/surge.png';
import clash from '@/assets/icons/clash.png';
import quanx from '@/assets/icons/quanx.png';
import loon from '@/assets/icons/loon.png';
import stash from '@/assets/icons/stash.png';
import shadowrocket from '@/assets/icons/shadowrocket.png';
import { useClipboard } from '@vueuse/core';
import useV3Clipboard from 'vue-clipboard3';
import { useAppNotifyStore } from '@/store/appNotify';

const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();
const { name, type, copyText, notify } = defineProps<{
  name: string;
  type: 'sub' | 'collection';
  copyText: string;
  notify: string;
}>();
const host = localStorage.getItem('hostApi') || import.meta.env.VITE_API_URL || 'https://sub.store';
const platformList = [
  {
    name: 'Clash',
    path: 'Clash',
    icon: clash,
  },
  {
    name: 'Quantumult X',
    path: 'QX',
    icon: quanx,
  },
  {
    name: 'Surge',
    path: 'Surge',
    icon: surge,
  },
  {
    name: 'Loon',
    path: 'Loon',
    icon: loon,
  },
  {
    name: 'Stash',
    path: 'Stash',
    icon: stash,
  },
  {
    name: 'ShadowRocket',
    path: 'ShadowRocket',
    icon: shadowrocket,
  },
];
const copyLink = async path => {
  console.log(notify)
  const url = `${host}/download/${type === 'sub' ? '' : 'collection/'
    }${name}?target=${path}`;
  if (isSupported) {
    await copy(encodeURI(url));
  } else {
    await copyFallback(encodeURI(url));
  }
  showNotify({ title: notify, type: 'success' });
};
</script>

<style lang="scss" scoped>
.preview-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  >li {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      border-bottom: 1px solid var(--divider-color);
    }

    a {
      width: 100%;
      padding: 12px 0;
      display: flex;
      align-items: center;

      div {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }

      p {
        font-size: 16px;
        color: var(--comment-text-color);
      }
    }
  }
}
</style>
