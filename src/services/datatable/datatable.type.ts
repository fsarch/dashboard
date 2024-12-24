export type DataTableAuthDto = {
  type: 'basic';

  username: string;

  password: string;
}

export type DataTableFetchBaseQueryDto = {
  type: 'fetch';

  url: string;

  auth: DataTableAuthDto;
}

export type DataTableConstantValueDataSourceDto = {
  value: string | number;

  label: string;
}

export type DataTableConstantDataSourceDto = {
  type: 'constant';

  values: Array<DataTableConstantValueDataSourceDto>;
}

export type DataTableBaseMappingDto = {
  name: string;

  selector: string;

  isIdentifier: boolean;

  isEditable: boolean;
}

export type DataTableUuidMappingDto = DataTableBaseMappingDto & {
  type: 'uuid';
};

export type DataTableSelectMappingDto = DataTableBaseMappingDto & {
  type: 'select';

  dataSource: DataTableConstantDataSourceDto;
}

export type DataTableStringMappingDto = DataTableBaseMappingDto & {
  type: 'string';
}

export type DataTableIntegerMappingDto = DataTableBaseMappingDto & {
  type: 'integer';
}

export type DataTableDateTimeMappingDto = DataTableBaseMappingDto & {
  type: 'date-time';
}

export type DataTableDecimalInputDto = {
  type: 'input';
}

export type DataTableDecimalPercentageColoredStepDto = {
  color: string;

  value: number;
}

export type DataTableDecimalPercentageColoredDto = {
  type: 'percentage-colored';

  maxValue: number;

  steps: Array<DataTableDecimalPercentageColoredStepDto>;
}

export type DataTableDecimalMappingDto = DataTableBaseMappingDto & {
  type: 'decimal';

  display?: DataTableDecimalInputDto | DataTableDecimalPercentageColoredDto;
}

export type DataTableMappingDtoType = DataTableUuidMappingDto
  | DataTableSelectMappingDto
  | DataTableStringMappingDto
  | DataTableIntegerMappingDto
  | DataTableDateTimeMappingDto
  | DataTableDecimalMappingDto;

export type DataTableDto = {
  id: string;

  name: string;

  mapping: Array<DataTableMappingDtoType>;
}
