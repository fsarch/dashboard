import React from 'react';
import {
  TestFunctionResultType
} from "@/app/(with-header)/function/[serviceId]/function/[functionId]/_components/dialog/TestFunction.type";
import Section from "@/components/universals/section/Section";
import styles from './TestFunctionResult.module.scss';
import { colors } from "@/app/_styles/colors";

type TestFunctionResultProps = {
  result: TestFunctionResultType;
};

const TestFunctionResult: React.FunctionComponent<TestFunctionResultProps> = ({
  result,
}) => {
  return (
    <div>
      {!result.isError ? (
        <Section
          name="Result"
        >
          <div
            className={styles.resultData}
          >
          <pre>
            {JSON.stringify(result.result, null, 2)}
          </pre>
          </div>
        </Section>
      ) : (
        <Section
          name="Fehler"
          color={colors.error}
        >
          <div
            className={styles.errorData}
          >
            <pre>
              {result.error.message}{'\n'}
              {result.error.stack}
            </pre>
          </div>
        </Section>
      )}
    </div>
  );
};

export default TestFunctionResult;
