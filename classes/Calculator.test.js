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
    expect(Calculator.isStringANumber({})).toBe(false);
    expect(Calculator.isStringANumber([])).toBe(false);
    expect(Calculator.isStringANumber({a: 1})).toBe(false);
    expect(Calculator.isStringANumber(['b', 2])).toBe(false);
  });
});

describe('Calculator Calculating Calculations', () => {
  const c = new Calculator();

  it('~-~ TODO: Implement float/decimal tests ~-~', () => { // TODO 2025-05-18: Implement float tests. There are so many little edge cases that right now I'm going to focus on the core stuff
    expect(true).toBe(true); // TODO 2025-05-18: delete when done
  })

  it('does nothing with empty command', () => {
    c.reset(); // TODO 2025-05-18: put this in a beforeEach. I can't remember if that works with each individual `it` command, though, so I'm just doing it manually for the purposes of this assignment
    c.currentValue = 10;
    c.handleInput('  '); // <-- throw in whitespace to try and trip things up
    expect(c.currentValue).toBe(10);
  })

  it('clears the calculator with the command `c`', () => {
    c.reset();
    c.currentValue = 10;
    c.handleInput(' c '); // <-- throw in whitespace to try and trip things up
    // TODO 2025-05-18: expect(c.reset).toHaveBeenRun I just don't want to look up spy right now
    expect(c.currentValue).toBe(0);
  });

  it('negates the current value with the command `!`', () => {
    c.reset();
    c.currentValue = 10;
    c.handleInput(' ! '); // <-- throw in whitespace to try and trip things up
    expect(c.currentValue).toBe(-10);


    c.currentValue = -21;
    c.handleInput(' ! '); // <-- throw in whitespace to try and trip things up
    expect(c.currentValue).toBe(10);
  });

  it('repeats the last operation with the command `=`', () => {
    c.reset();
    /* for the record, I think the prompt has a typo, and I'm going to assume that the intent is
      * "the last operation was `+45`", and I'm also going to have the last operation be determined from
      * MDAS ordering
      * 0
      * > 2+45
      * 45
      * > =
      * 47
    */
    c.handleInput(' 2 + 45 ');
    c.handleInput(' = ');
    expect(c.currentValue).toBe(47);
  });

  it('~-~ TODO needs more cases for the "=" command\'s test ~-~', () => { // TODO 2025-05-18: There's a bunch more cases to try, but I'll come back to this, as it's my last priority during this assignment.
    expect(true).toBe(true); // TODO 2025-05-18: delete when the todo is to-done
  });

  it('sets the current value when command is just a number', () => {
    c.reset();
    c.handleInput(' 10 ');
    expect(c.currentValue).toBe(10);
  });

  it('does not set the current value when command is a number with a minus sign in front', () => {
    c.reset();
    c.currentValue = 19;
    c.handleInput(' -10 ');
    expect(c.currentValue).toBe(9);
  });

  it('handles solo strings with one operator, overwriting currentValue', () => {
    c.reset();
    // TODO 2025-05-18: implement a bunch of these
    c.handleInput(' 2 + 3');
    expect(c.currentValue).toBe(5);
    c.handleInput('8-5');
    expect(c.currentValue).toBe(3);
    c.handleInput(' 5 - 8');
    expect(c.currentValue).toBe(-3);
    c.handleInput('13 *21');
    expect(c.currentValue).toBe(273);
    c.handleInput('-10*5'); // occurs organically during parsing
    expect(c.currentValue).toBe(273);
    c.handleInput('273 / 21');
    expect(c.currentValue).toBe(34);
  });

  it('handles solo strings with multiple operator, overwriting currentValue', () => {
    c.reset();
    // TODO 2025-05-18: implement a bunch of these, emphasis on checking order of operations
  });

  it('handles multiple commands with single operations each', () => {
    c.reset();
    c.handleInput(' 7 ');
    expect(c.currentValue).toBe(7);
    c.handleInput(' + 11 ');
    expect(c.currentValue).toBe(18);
    c.handleInput(' - 5 ');
    expect(c.currentValue).toBe(13);
    c.handleInput(' *2 ');
    expect(c.currentValue).toBe(26);
    c.handleInput(' / 2');
    expect(c.currentValue).toBe(13);
    c.handleInput('- 100 ');
    expect(c.currentValue).toBe(-87);
    c.handleInput(' +13 ');
    expect(c.currentValue).toBe(-74);
    c.handleInput('!'); // Yeah yeah, this is kinda out of place, since we cover it else where. Just feels like we should throw it in while we're on a roll
    expect(c.currentValue).toBe(74);
    c.handleInput('-10');
    expect(c.currentValue).toBe(64);
    c.handleInput('!');
    expect(c.currentValue).toBe(-64);
  });

  it('handles multiple commands with single and multiple operations', () => {
    c.reset();
    // TODO 2025-05-18: implement
  });

  it('throws on invalid input', () => {
    c.reset();
    expect(() => c.handleInput(' 10 + ')).toThrow();

    // TODO 2025-05-18: add more.
  });
});
