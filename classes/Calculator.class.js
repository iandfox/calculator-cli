import { CalculatorError } from "./CalculatorError.class.js";
import { log, debugLog } from "../helpers/log.js";

export class Calculator {
  /** @var {number} currentValue */
  currentValue = 0;

  /** @var {{ operator: string, value: number }} */
  lastOperation = { operator: null, value: null };

  /**
   * Is somethin' a number?
   *
   * @param {*} input
   *
   * @returns boolean
   */
  static isNumber(input) {
    // Pick your poison:
    // return typeof input === 'number' && ! isNaN(input);
    // return isFinite(input); // we would want it coerced to a number
    // return input.toString().match(/^\-?[0-9\.]+$/); // // TODO 2025-05-17: if this regex method is used, note that it allows for multiple decimal points
    return (typeof input === 'number' && ! isNaN(input));
    // It feels as though every few years I look up the best way to check if something is a number, and no one has a good answer in JS
  }


  /**
   * Is this string a number?
   *
   * @param {string} input
   *
   * @returns boolean
   */
  static isStringANumber(input) {
    if (typeof input !== 'string') {
      return false;
    }

    return (input.match(/^\-?[0-9]+(?:\.[0-9]+)?$/) !== null);
  }

  /**
   * Convert a string to a number, put in a static method just for refactor-proofing
   *
   * @param {string} x
   * @returns {number}
   */
  static toNumber = (x) => {
    if (typeof x === 'string') {
      return parseFloat(x);
    } else if (typeof x === 'number') {
      return x;
    }

    return NaN;
  }


  constructor() {
    this.reset();
  }


  /**
   * Resets.
   */
  reset() {
    this.currentValue = 0;
    this.lastOperation = { operator: null, value: null };
    debugLog("- Memory cleared -");
  }


  /**
   * Collapse a string of numbers and operators according to MDAS order (note: not sure if intention is to handle
   * operations as a queue, as the frontend app would, or if MDAS is preferred. I went with MDAS since probably the
   * first improvement I'd otherwise want to make is convert from 'dumb' calculator to MDAS-aware calculator)
   *
   * @param {string} input A clean input that has already been run through handleInput
   *
   * @returns {number}
   */
  _calculate(input, debugLogIndent = '') {
    let transformedInput = input;

    if (transformedInput.includes('-')) {
      debugLog(debugLogIndent + 'subtract: ' + input);
      return input.split('-').map((s) => {
        if (Calculator.isStringANumber(s)) {
          debugLog(debugLogIndent + '  num:' + s);
          return Calculator.toNumber(s);
        } else {
          debugLog(debugLogIndent + '  s:' + s);
          // Recursively calculate the substrings
          return this._calculate(s, debugLogIndent + '  ');
        }
      }).reduce((acc, curr) => (acc === null ? curr : acc - curr), null);
    }
    if (transformedInput.includes('+')) {
      debugLog(debugLogIndent + 'add: ' + input);
      return input.split('+').map((s) => {
        if (Calculator.isStringANumber(s)) {
          debugLog(debugLogIndent + '  num:' + s);
          return Calculator.toNumber(s);
        } else {
          debugLog(debugLogIndent + '  s:' + s);
          // Recursively calculate the substrings
          return this._calculate(s, debugLogIndent + '  ');
        }
      }).reduce((acc, curr) => acc + curr, 0);
    }
    if (transformedInput.includes('/')) {
      debugLog(debugLogIndent + 'divide: ' + input);
      return input.split('/').map((s) => {
        if (Calculator.isStringANumber(s)) {
          debugLog(debugLogIndent + '  num:' + s);
          return Calculator.toNumber(s);
        } else {
          debugLog(debugLogIndent + '  s:' + s);
          // Recursively calculate the substrings
          return this._calculate(s, debugLogIndent + '  ');
        }
      }).reduce((acc, curr) => (acc === null ? curr : acc / curr), null);
    }
    if (transformedInput.includes('*')) {
      debugLog(debugLogIndent + 'multiply: ' + input);
      return input.split('*').map((s) => {
        if (Calculator.isStringANumber(s)) {
          debugLog(debugLogIndent + '  num:' + s);
          return Calculator.toNumber(s);
        } else {
          debugLog(debugLogIndent + '  s:' + s);

          // Recursively calculate the substrings
          return this._calculate(s);
        }
      }).reduce((acc, curr) => acc * curr, 1);
    }




    // If we're here, then we either have a number on our hands or invalid input
    if (Calculator.isStringANumber(input)) {
      debugLog(debugLogIndent + 'raw num:' + input); // TODO delete
      return Calculator.toNumber(input);
    } else {
      throw new Error(`Invalid input: ${input}`);
    }
  }


  /**
   * Take input from a user and operate on it as needed
   *
   * A few cases to handle here:
   *   - Nothing
   *   - A number on its own
   *   - A valid operator and a number
   *   - Several valid operators and numbers
   *   - Special operations (c for AC, ! for +/-)
   *   -
   *   - An equals sign on its own (harder than you'd think)
   *   - Invalid input
   *
   * Strategy: do simple checks for special cases (everything but operator and numbers), then fancy stuff for the
   * operations.
   *
   * NOTE: Does not handle `E` notation
   *
   * @param {*} input
   */
  handleInput(input) {

    // TODO 2025-05-18: keep track of the most recent operation (perhaps this would go in `calculate()` instead?) to facilitate the `"="` command


    input = input.toString().trim(); // just in case

    // Strip everything out so we have a clean/predicatably-written string
    input = this.cleanInput(input);

    let newCurrentValue = this.currentValue;

    if (input === "") {
      // Nothing. Just show the current value (later on)
    } else if (input === "c") {
      // Acts like the 'AC' button and clears out the current value and any pending operations (if this were a physical calculator, anyway)
      this.reset();
      // this.currentValue gets set in reset(), but let's be consistent so future error checking works
      newCurrentValue = this.currentValue;
    } else if (input === "!") {
      // Negate the current value
      newCurrentValue = -1 * this.currentValue;
    } else if (input === "=") {
      // TODO 2025-05-17: Redo the most recent operation.
    } else if (input.match(/^[0-9\.]+$/)) { // note that this intentionally does not allow for "-1" to be considered `negative one`; rather it'll be `current value - 1`
      // regex is 'from start to finish, only numbers'. TODO 2025-05-17: this would allow for multiple decimal points
      // Replace current value
      newCurrentValue = parseFloat(input);
    } else if (input.match(/^(?:[0-9+\-\*\/c\./]+)?[0-9]+(?:\.[0-9]+)?$/)) { // TODO 2025-05-18: add more refined handling to ensure that, say, `"10 +"` is an error
      // regex is 'numbers and ops all the way through, ending with a number'
      // If input starts with an operator, we assume the user wants to apply that operator to the current value
      if (input.match(/^[+\-\*\/]/)) {
        // Prepend current value to the string, and handle it the same as we handle a solo string
        input = `${newCurrentValue.toString()}${input}`;
        // note that this, too, intentionally does not allow for `"-1"` to be considered `negative one`; rather it'll be `current value - 1`
      }
      newCurrentValue = this._calculate(input);
    } else {
      // If we're here, then something has gone horribly horribly wrong
      throw new CalculatorError(`Invalid input: ${input}`);
    }

    // TODO 2025-05-17: show a message about the operations that were done, maybe. could do some color coding

    // TODO 2025-05-17: do some basic error checking for newCurrentValue (e.g., isNaN) and throw an error if something went wrong

    // Store and show the new current value
    this.currentValue = newCurrentValue;
    log(this.currentValue); // <-- note: all sorts of edge cases here which would make things look bad (long decimals, `E` notation, so on)
  }


  /**
   * Remove everything from a string except:
   *   - 0-9
   *   - operators: + - * /
   *   - equals sign: =
   *   - specials: c, !
   *
   * @param {string} input
   * @returns
   */
  cleanInput(input) {
    // (definitely more escape characters than needed)
    return input.replace(/[^0-9+\-\*\/c\=\!\.]/g, "");
  }
}
