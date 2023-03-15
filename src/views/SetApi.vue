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
          v-model="apiAddress"
          type="text"
          input-align="left"
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
          确认
        </nut-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import iconKey from '@/assets/icons/key-solid.svg?url';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const apiAddress = ref('');
  const inputDom = ref();

  onMounted(async () => {
    if (window.localStorage.getItem('api')) {
      apiAddress.value = window.localStorage.getItem('api');
    }
  });

  const confirm = () => {
    window.localStorage.setItem('api', apiAddress.value);
    router.push(`/subs`);
    // location.reload();
  };
</script>

<style lang="scss">
  @import '@/assets/custom_theme_variables.scss';
  .setapi-page-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    padding: $safe-area-side;
  }
  .config-card {
    margin-top: 20px;
    width: 100%;
    padding: 12px;
    border-radius: $item-card-radios;

    .dark-mode & {
      color: $dark-comment-text-color;
      background: $dark-card-color;
    }

    .light-mode & {
      color: $light-comment-text-color;
      background: $light-card-color;
    }

    h1 {
      font-size: 14px;
      padding: 8px 0;
      margin-bottom: 8px;
    }

    .config-input-wrapper {
      padding: 0 12px;

      .input.nut-input-disabled {
        :deep(input):disabled {
          .dark-mode & {
            -webkit-text-fill-color: $dark-lowest-text-color;
          }
          .light-mode & {
            -webkit-text-fill-color: $light-lowest-text-color;
          }
        }
      }

      .input {
        background: transparent;
        padding: 16px;

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
          color: $dark-second-text-color;
          border-color: $dark-lowest-text-color;
        }

        .light-mode & {
          color: $light-second-text-color;
          border-color: $light-divider-color;
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
