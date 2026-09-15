// Mirrors the DTOs/types exposed by the image-editor-server backend
// (see its src/models/*.model.ts and src/rendering/*.ts).

export type ProjectDto = {
  id: string;
  name: string;
  description: string | null;
  externalId: string | null;
  creationTime: string;
  deletionTime: string | null;
};

export type ProjectVersionDto = {
  id: string;
  projectId: string;
  externalId: string | null;
  isActive: boolean;
  width: number;
  height: number;
  creationTime: string;
  deletionTime: string | null;
};

export type ParameterType = 'text' | 'image' | 'number' | 'object';

export type ParameterDto = {
  id: string;
  projectVersionId: string;
  parentId: string | null;
  name: string;
  type: ParameterType;
  required: boolean;
  defaultValue: unknown;
  order: number;
  creationTime: string;
  deletionTime: string | null;
};

export type LayerType = 'text' | 'image' | 'shape' | 'html';

// Every leaf value in a Layer's transformationMatrix/options is one of
// these two shapes - see the backend's src/rendering/bindable-value.ts.
export type ConstantBindableValue<T> = { type: 'constant'; value: T };
export type VariableBindableValue = { type: 'variable'; value: string };
export type BindableValue<T> = ConstantBindableValue<T> | VariableBindableValue;

export type Base64Image = { type: 'base64'; value: string };

export type BindableAffineMatrix = {
  a: BindableValue<number>;
  b: BindableValue<number>;
  c: BindableValue<number>;
  d: BindableValue<number>;
  e: BindableValue<number>;
  f: BindableValue<number>;
};

export type TextLayerOptions = {
  content: BindableValue<string>;
  fontFamily: BindableValue<string>;
  fontSize: BindableValue<number>;
  color: BindableValue<string>;
  textAlign?: BindableValue<'left' | 'center' | 'right'>;
};

export type ImageLayerOptions = {
  image: BindableValue<Base64Image>;
  width: BindableValue<number>;
  height: BindableValue<number>;
};

export type ShapeLayerOptions = {
  shape: BindableValue<'rectangle' | 'ellipse'>;
  width: BindableValue<number>;
  height: BindableValue<number>;
  fillColor?: BindableValue<string>;
  strokeColor?: BindableValue<string>;
  strokeWidth?: BindableValue<number>;
};

export type HtmlLayerOptions = {
  html: BindableValue<string>;
  width: BindableValue<number>;
  height: BindableValue<number>;
};

export type LayerOptions = TextLayerOptions | ImageLayerOptions | ShapeLayerOptions | HtmlLayerOptions;

export type LayerDto = {
  id: string;
  projectVersionId: string;
  externalId: string | null;
  name: string;
  order: number;
  type: LayerType;
  transformationMatrix: BindableAffineMatrix;
  options: LayerOptions;
  creationTime: string;
  deletionTime: string | null;
};

export type PaginationResultDto<T> = {
  data: Array<T>;
  metadata: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
