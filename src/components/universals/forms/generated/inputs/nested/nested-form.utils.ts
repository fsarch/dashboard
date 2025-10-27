import { useNestedFormContext } from "@/components/universals/forms/generated/inputs/nested/nested-form.context";

function useInputName(inputId: string): string {
  const { path } = useNestedFormContext();
  return [...path, inputId].join('.');
}

export const nestedFormUtils = {
  useInputName,
};
