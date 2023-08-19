import { useSubsApi } from '@/api/subs';
import i18n from '@/locales';
import { useAppNotifyStore } from '@/store/appNotify';
import { getFlowsUrlList } from '@/utils/getFlowsUrlList';
import { defineStore } from 'pinia';

const { t } = i18n.global;
const subsApi = useSubsApi();

export const useSubsStore = defineStore('subsStore', {
  state: (): SubsStoreState => {
    return {
      subs: [],
      subsGroup: [
        {
          label: '其他',
          subs: [],
        },
      ],
      subsGroupActive: [],
      collections: [],
      flows: {},
    };
  },
  getters: {
    hasSubs: ({ subs }): boolean => subs.length > 0,
    hasCollections: ({ collections }): boolean => collections.length > 0,
    getOneSub:
      ({ subs }): GetOne<Sub> =>
      (name: string) =>
        subs.find(sub => sub.name === name),
    getOneCollection:
      ({ collections }): GetOne<Collection> =>
      (name: string): Collection =>
        collections.find(collection => collection.name === name),
  },
  actions: {
    async fetchSubsData() {
      Promise.all([subsApi.getSubs(), subsApi.getCollections()]).then(res => {
        if ('data' in res[0].data) {
          this.subs = res[0].data.data;
          for (let i = 0; i < this.subs.length; i++) {
            const element = this.subs[i];
            if (
              element.label &&
              this.subsGroup.find(e => e.label === element.label)
            ) {
              this.subsGroup
                .find(e => e.label === element.label)
                .subs.push(element);
            } else if (
              element.label &&
              !this.subsGroup.find(e => e.label === element.label)
            ) {
              this.subsGroup.push({
                label: element.label,
                subs: [element],
              });
            } else {
              this.subsGroup[0].subs.push(element);
            }
          }
          const other = this.subsGroup.filter(item => item.label === '其他');
          const rest = this.subsGroup.filter(item => item.label !== '其他');
          this.subsGroup = rest.concat(other);
          for (let i = 0; i < this.subsGroup.length; i++) {
            this.subsGroupActive.push(i);
          }
        }
        if ('data' in res[1].data) {
          this.collections = res[1].data.data;
        }
      });
    },
    async updateOneData(type: string, name: string) {
      let res;
      if (type === 'subs') {
        res = await subsApi.getOne('sub', name);
      } else if (type === 'collections') {
        res = await subsApi.getOne('collection', name);
      }
      if (res.data.status === 'success') {
        const index = this[type].findIndex(item => item.name === name);
        this[type][index] = res.data.data;
      }
    },
    async fetchFlows(sub?: Sub[]) {
      const asyncGetFlow = async ([url, name]) => {
        const response = await subsApi.getFlow(name);
        this.flows[url] = response?.data;
      };
      // const subs = sub || this.subs;
      // getFlowsUrlList(subs).forEach(asyncGetFlow);
      // 多次反复开启 容易爆内存 尝试分批请求 3/100ms
      const flowsUrlList = getFlowsUrlList(sub || this.subs);
      const batches = [];

      for (let i = 0; i < flowsUrlList.length; i += 8) {
        const batch = flowsUrlList.slice(i, i + 8);
        batches.push(batch);
      }

      for (const batch of batches) {
        const promises = batch.map(asyncGetFlow);
        await Promise.all(promises);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    },
    async fetchSingleFlow(url: string, name: string) {
      this.subs
        .filter(item => item.url == url)
        .map(item => (item.loading = true));
      const response = await subsApi.getFlow(name);
      // this.flows[url] = response?.data;
      this.subs
        .filter(item => item.url == url)
        .map(item => (item.loading = false));
      this.flows[url] = response?.data;
      // this.flows[url] = data;
    },
    async deleteSub(type: SubsType, name: string) {
      const { showNotify } = useAppNotifyStore();

      const { data } = await subsApi.deleteSub(type, name);
      if (data.status === 'success') {
        await this.fetchSubsData();
        showNotify({
          type: 'danger',
          title: t('subPage.deleteSub.succeedNotify'),
        });
      }
    },
  },
});
