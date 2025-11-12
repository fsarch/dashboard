import { jsonataUtils } from './jsonata.utils';
import type { TJsonataExpression } from '@/components/universals/forms/generated/GeneratedForm.type';

describe('jsonataUtils', () => {
  it('returns string unchanged when evaluateStringValue receives a string', async () => {
    const input = 'plain string';
    const out = await jsonataUtils.evaluateStringValue(input);
    expect(out).toBe(input);
  });

  it('evaluates jsonata expression to string using context', async () => {
    const expr: TJsonataExpression = { $type: 'jsonata', value: "$string(name)" };
    const context = { name: 'Alice' };
    const out = await jsonataUtils.evaluateStringValue(expr, context as Record<string, unknown>);
    expect(out).toBe('Alice');
  });

  it('evaluateValue returns undefined for undefined input', async () => {
    const out = await jsonataUtils.evaluateValue(undefined);
    expect(out).toBeUndefined();
  });

  it('evaluateValue evaluates expressions to their value types', async () => {
    const expr: TJsonataExpression = { $type: 'jsonata', value: 'age + 1' };
    const context = { age: 41 };
    const out = await jsonataUtils.evaluateValue(expr, context as Record<string, unknown>);
    expect(out).toBe(42);
  });

  it('evaluateValue can return objects', async () => {
    const expr: TJsonataExpression = { $type: 'jsonata', value: '{ "fullName": name & " " & surname, "age": age }' };
    const context = { name: 'John', surname: 'Doe', age: 30 };
    const out = await jsonataUtils.evaluateValue(expr, context as Record<string, unknown>);
    expect(out).toEqual({ fullName: 'John Doe', age: 30 });
  });
});
