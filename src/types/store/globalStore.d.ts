interface GlobalStoreState {
  isLoading: boolean;
  fetchResult: boolean;
  bottomSafeArea: number;
  isDarkMode: boolean;
  env: ENV;
}

interface ENV {
  version?: string;
  backend?:
    | 'Stash'
    | 'QX'
    | 'Loon'
    | 'Surge'
    | 'ShadowRocket'
    | 'Clash'
    | 'Node';
}
