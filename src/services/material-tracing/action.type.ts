export type TAction = {
  id: string;
  name: string;
  resources: Array<string>;
};

export type TActionResponse = {
  actions: Array<{
    $type: 'show-modal';
    value: {
      $type: 'binary';
      base64: string;
      mimeType: string;
    };
  }>;
};
