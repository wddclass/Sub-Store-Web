interface SubsStoreState {
  subs: Sub[];
  subsGroup: subsGroup[];
  subsGroupActive: Array;
  collections: Collection[];
  collectionsGroup: CollectionGroup[];
  collectionsGroupActive: Array;
  flows: FlowsDict;
}

interface FlowsDict {
  [key: string]: Flow | ErrorResponse;
}

// 结构有点乱 太难定义
// type Process1 = {
//   key: string;
//   value: boolean;
// };
//
// type Process2 = {
//   [key: string]: string;
// };

type ProcessArg = any;

interface Process {
  type: string;
  id?: string;
  args?: ProcessArg;
}

interface Sub {
  name: string;
  content?: string;
  displayName?: string;
  url?: string;
  source: 'remote' | 'local';
  icon?: string;
  ua?: string;
  process: Process[];
  loading: boolean;
  label?: string;
}
interface subsGroup {
  label?: string;
  subs: Array;
}

interface Collection {
  name: string;
  displayName?: string;
  process: Process[];
  subscriptions: string[];
  icon?: string;
}
interface CollectionGroup {
  label?: string;
  collections: Array;
}

interface Flow {
  status: 'success';
  data: {
    expires: number;
    total: number;
    usage: {
      upload: number;
      download: number;
    };
  };
}

interface Artifacts {
  name: string;
  displayName?: string;
  type: string;
  source: string;
  platform: string;
  sync: boolean;
  updated: number;
  url: string;
}
type GetOne<T extends Sub | Collection> = (name: string) => T;
