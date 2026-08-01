export type ProjectDto = {
  id: string;
  name: string;
  creationTime: string;
};

export type ProjectCreateDto = {
  name: string;
};

export type ProjectVersionDto = {
  id: string;
  projectId: string;
  name?: string;
  creationTime: string;
};

export type ProjectVersionCreateDto = {
  name?: string;
  file?: {
    name: string;
    type: string;
    base64: string;
  };
};
