import { Calculator } from './Calculator.class.js';

describe('Calculator', () => {
  it('can tell when a string is a number', () => {
    expect(Calculator.isStringANumber('0')).toBe(true);
    expect(Calculator.isStringANumber('1')).toBe(true);
    expect(Calculator.isStringANumber('123')).toBe(true);
    expect(Calculator.isStringANumber('123.4')).toBe(true);
    expect(Calculator.isStringANumber('0.123')).toBe(true);
    expect(Calculator.isStringANumber('0.0')).toBe(true);
    expect(Calculator.isStringANumber('-1')).toBe(true);
    expect(Calculator.isStringANumber('-123')).toBe(true);
    expect(Calculator.isStringANumber('-123.4')).toBe(true);
    expect(Calculator.isStringANumber('-0.123')).toBe(true);
  });

  it('can tell when a string is not a number', () => {
    expect(Calculator.isStringANumber(5)).toBe(false); // controversial, I know. But `5` is not a string (maybe it should throw an error instead)
    expect(Calculator.isStringANumber('a')).toBe(false);
    expect(Calculator.isStringANumber('5a')).toBe(false);
    expect(Calculator.isStringANumber('a5')).toBe(false);
    expect(Calculator.isStringANumber(' 5')).toBe(false); // The string is not (purely) a number
    expect(Calculator.isStringANumber('5 ')).toBe(false);
  });
});
