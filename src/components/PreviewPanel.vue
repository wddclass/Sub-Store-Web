<template>
  <ul class="preview-list">
    <li v-for="platform in platformList" :key="platform.name">
      <a
        :href="`${host}/download/${
          type === 'sub' ? '' : 'collection/'
        }${name}?target=${platform.path}`"
        target="_blank"
      >
        <div>
          <img :src="platform.icon" alt="" class="auto-reverse" />
        </div>
        <p>{{ platform.name }}</p>
      </a>
      <div
        class="nut-button nut-button--primary nut-button--small nut-button--round"
        @click="copyLink(platform.path)"
      >
        复制
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
  import { Notify } from '@nutui/nutui';
  import useClipboard from 'vue-clipboard3';

  const { toClipboard } = useClipboard();
  const { name, type } = defineProps<{
    name: string;
    type: 'sub' | 'collection';
  }>();
  const host = localStorage.getItem('api').endsWith('/')
    ? localStorage.getItem('api').slice(0, -1)
    : localStorage.getItem('api');
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
    const url = `${host}/download/${
      type === 'sub' ? '' : 'collection/'
    }${name}?target=${path}`;
    await toClipboard(url);
    Notify.success('复制成功', {
      duration: 1500,
    });
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

    > li {
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
          font-size: 14px;
          color: var(--comment-text-color);
        }
      }
    }
  }
</style>
