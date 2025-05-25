export type LoadingProviderContextType = {
  showLoading: (text?: string) => { close: () => void };
}
