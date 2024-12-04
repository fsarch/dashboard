'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableDto } from "@/services/datatable/datatable.type";
import { loadDataTableData, updateDataTableData } from "@/components/apps/datatable/datatable/DataTable.server-action";
import DataTableHeader from "@/components/apps/datatable/datatable/DataTableHeader";
import DataTableRow from "@/components/apps/datatable/datatable/DataTableRow";
import { DataTableValue } from "@/components/apps/datatable/datatable/DataTable.type";
import { DataTableUpdateContextProvider } from "@/components/apps/datatable/datatable/constants/DataTableUpdateContext";
import DataTableMenu from "@/components/apps/datatable/datatable/DataTableMenu";

type DataTableProps = {
  serviceId: string;
  dataTableId: string;
  definition: DataTableDto;
};

const DataTable: React.FunctionComponent<DataTableProps> = ({
  serviceId,
  dataTableId,
  definition,
}) => {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      const loadedData = await loadDataTableData({
        serviceId,
        dataTableId,
      });
      setData(loadedData);
    })();
  }, [setData, serviceId, dataTableId]);

  const [overrideData, setOverrideData] = useState<Record<string, { value: any; identification: Record<string, unknown> }>>({});

  const transformedData = useMemo((): Array<DataTableValue> => data.map((d) => {
    const identifierEntries = definition.mapping.filter((m) => m.isIdentifier).map((m) => [m.selector, d[m.selector]]);
    const identifiers = Object.fromEntries(identifierEntries);
    const identificationKey = identifierEntries.map((d) => d[1]).join(',');

    const mappedValue = Object.fromEntries(
      definition.mapping.map((m) => [m.name, d[m.selector]])
    );

    const rowOverrides = overrideData[identificationKey]?.value;

    const mappedRowValue = definition.mapping.map((m) => ({
      name: m.name,
      value: rowOverrides?.[m.selector] ?? d[m.selector],
      mapping: m,
      isUpdated: rowOverrides?.[m.selector],
    }))

    return ({
      key: identificationKey,
      identifiers,
      raw: d,
      mappedValue,
      rowBased: mappedRowValue,
      isUpdated: rowOverrides,
    })
  }), [data, definition, overrideData]);

  const handleUpdateCell = useCallback((identifiers: { key: string, object: Record<string, unknown> }, field: string, value: unknown) => {
    setOverrideData((d) => ({
      ...d,
      [identifiers.key]: {
        ...d[identifiers.key],
        identification: identifiers.object,
        value: {
          ...d[identifiers.key]?.value,
          [field]: value,
        },
      },
    }));
  }, [setOverrideData]);

  const handleApply = useCallback(async () => {
    console.log('overrideData', overrideData);

    const updateBody = Object.values(overrideData).map((value) => {
      return {
        identifiers: value.identification,
        patch: value.value,
      };
    });

    await updateDataTableData({
      serviceId,
      dataTableId,
      update: updateBody,
    });

    const loadedData = await loadDataTableData({
      serviceId,
      dataTableId,
    });
    setData(loadedData);

    setOverrideData({});
  }, [overrideData, setData, setOverrideData, serviceId, dataTableId]);

  const handleRevert = useCallback(() => {
    setOverrideData({});
  }, [setOverrideData]);

  return (
    <DataTableUpdateContextProvider onUpdate={handleUpdateCell}>
      <div>
        <DataTableMenu
          onApplyClick={handleApply}
          onRevertClick={handleRevert}
        />
        <table>
          <thead>
          <DataTableHeader
            definition={definition}
          />
          </thead>
          <tbody>
          {transformedData.map((d) => (
            <DataTableRow
              key={d.key}
              data={d}
              definition={definition}
            />
          ))}
          </tbody>
        </table>
      </div>
    </DataTableUpdateContextProvider>
  );
};

export default DataTable;
