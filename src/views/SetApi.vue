<template>
  <!--顶部通知 组件式暂时有bug，先使用函数调用式-->
  <!--<nut-notify-->
  <!--  pop-class="pop-notify"-->
  <!--  v-model:visible="notifySettings.notifyIsVisible"-->
  <!--  :type="notifySettings.notifyType"-->
  <!--&gt;-->
  <!--  <span>{{ notifySettings.notifyMsg }}</span>-->
  <!--</nut-notify>-->
  <div class="setapi-page-wrapper">
    <div class="config-card">
      <div class="config-input-wrapper">
        <nut-textarea
          class="input"
          v-model="apiUrl"
          type="text"
          input-align="left"
          rows="4"
          :left-icon="iconKey"
          ref="inputDom"
        />
      </div>
      <div class="config-btn-wrapper">
        <nut-button
          class="save-btn"
          type="primary"
          size="mini"
          @click="confirm"
        >
          <font-awesome-icon icon="fa-solid fa-floppy-disk" />
          {{ $t(`themeSettingPage.themePicker.confirm`) }}
        </nut-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import iconKey from '@/assets/icons/key-solid.svg?url';
  import { useRouter } from 'vue-router';
  import service from '@/api';
  import { initStores } from '@/utils/initApp';

  const router = useRouter();
  const apiUrl = ref('');
  const inputDom = ref();

  onMounted(async () => {
    if (window.localStorage.getItem('api')) {
      apiUrl.value = window.localStorage.getItem('api');
    }
  });

  const confirm = () => {
    window.localStorage.setItem('api', apiUrl.value);
    service.defaults.baseURL = apiUrl.value;
    router.push(`/`);
    // 初始化应用数据（顶部通知）
    initStores(true, true, false);
  };
</script>

<style lang="scss">
  .setapi-page-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    padding: var(--safe-area-side);
  }
  .config-card {
    margin-top: 20px;
    width: 100%;
    padding: 12px;
    border-radius: var(--item-card-radios);
    color: var(--comment-text-color);
    background-color: var(--compare-item-background-color);

    h1 {
      font-size: 14px;
      padding: 8px 0;
      margin-bottom: 8px;
    }

    .config-input-wrapper {
      padding: 0;

      .input.nut-input-disabled {
        :deep(input):disabled {
          .dark-mode & {
            -webkit-text-fill-color: var(--dark-lowest-text-color);
          }
          .light-mode & {
            -webkit-text-fill-color: var(--light-lowest-text-color);
          }
        }
      }

      .input {
        background: transparent;
        padding: 0 16px;

        :deep(img) {
          width: 16px;
          height: 16px;
          margin-right: 6px;
          opacity: 0.2;

          .dark-mode & {
            filter: brightness(1000%);
          }

          .light-mode & {
            filter: brightness(0);
          }
        }

        &:not(:first-child) {
          margin-top: 8px;
        }

        .dark-mode & {
          color: var(--dark-second-text-color);
          border-color: var(--dark-lowest-text-color);
          .nut-textarea__textarea {
            color: white;
          }
        }

        .light-mode & {
          color: var(--light-second-text-color);
          border-color: var(--light-divider-color);
        }
      }
    }

    .config-btn-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;

      .cancel-btn {
        background: transparent;
      }

      .save-btn {
        margin-left: 8px;
      }
    }
  }
</style>
