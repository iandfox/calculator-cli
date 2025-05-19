import { CalculatorError } from "./CalculatorError.class.js";
import { log, debugLog } from "../helpers/log.js";

export class Calculator {
  /** @var {number} currentValue */
  currentValue = 0;

  /** @var {string|null} */
  lastOperation = null;

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
    this.lastOperation = null;
    debugLog("- Memory cleared -");
  }


  /**
   * Collapse a string of numbers and operators according to MDAS order (note: not sure if intention is to handle
   * operations as a queue, as the frontend app would, or if MDAS is preferred. I went with MDAS since probably the
   * first improvement I'd otherwise want to make is convert from 'dumb' calculator to MDAS-aware calculator)
   *
   * I realized after a bit that I needed to parse things 'inside-out,' so that the calculations would be performed
   * correctly.
   *
   *
   * TODO 2025-05-18 at the end: I'm not convinced that I've thought through all the cases for parsing a
   *                             negative/minus sign. That's definitely something that will take
   *                             careful, considered testing, to start.
   *                             edit, 10 minutes later: Yeah okay, we just do not like negative numbers
   *                             for currentValue
   *
   *
   *
   * @param {string} input A clean input that has already been run through handleInput
   *
   * @returns {number}
   */
  _calculate(input, debugLogIndent = '') {
    let transformedInput = input; // TODO 2025-05-18: I don't think we actually need this

    if (transformedInput.includes('-')) {
      debugLog(debugLogIndent + 'subtract: ' + input);
      return input.split('-').map((s) => { // TODO 2025-05-18: keep it DRY
        if (Calculator.isStringANumber(s)) {
          debugLog(debugLogIndent + '  num:' + s);
          return Calculator.toNumber(s);
        } else {
          debugLog(debugLogIndent + '  s:' + s);
          // Recursively calculate the substrings
          return this._calculate(s, debugLogIndent + '  ');
        }
      }).reduce((acc, curr) => {
        if (acc === null) {
          // initialize acc as curr
          return curr;
        } else {
          this.lastOperation = `-${curr}`; // TODO 2025-05-18: potential bug here if `curr` is negative
          return (acc - curr);
        }
      }, null);
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
      }).reduce((acc, curr) => {
        this.lastOperation = `+${curr}`; // TODO 2025-05-18: potential bug here if `curr` is negative
        return acc + curr;
      }, 0);
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
      }).reduce((acc, curr) => {
        if (acc === null) {
          return curr;
        } else {
          this.lastOperation = `/${curr}`;
          return acc / curr;
        }
      }, null);
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
      }).reduce((acc, curr) => {
        this.lastOperation = `*${curr}`;
        return acc * curr
      }, 1);
    }


    // TODO 2025-05-18: exponentiation goes here


    // If we're here, then we either have a number on our hands or invalid input
    if (Calculator.isStringANumber(input)) {
      debugLog(debugLogIndent + 'raw num:' + input); // TODO delete
      return Calculator.toNumber(input);
    } else {
      throw new CalculatorError(`Invalid input: ${input}`);
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
    try {

      input = input.toString().trim(); // just in case

      // Strip everything out so we have a clean/predicatably-written string
      input = this.cleanInput(input);

      let newCurrentValue = this.currentValue;

      if (input === '') {
        // Nothing. Just show the current value (later on)
      } else if (input === 'c') {
        // Acts like the 'AC' button and clears out the current value and any pending operations (if this were a physical calculator, anyway)
        this.reset();
        // this.currentValue gets set in reset(), but let's be consistent so later error checking works
        newCurrentValue = this.currentValue;
      } else if (input === '!') {
        // Negate the current value
        newCurrentValue = -1 * this.currentValue;
        this.lastOperation = '!';
      } else if (input === '=') {
        if (this.lastOperation !== null) {
          this.handleInput(this.lastOperation);

          // exit early. we don't want the rest of the function to run
          return;
        }
        // note: intentionally not setting a new lastOperation
      } else if (input.match(/^[0-9\.]+$/)) { // note that this intentionally does not allow for "-1" to be considered `negative one`; rather it'll be `current value - 1`
        // regex is 'from start to finish, only numbers'. TODO 2025-05-17: this would allow for multiple decimal points
        // Replace current value
        newCurrentValue = parseFloat(input);
        // note: intentionally not setting a new lastOperation
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
        throw new CalculatorError(`Invalid input: ${input} (it's probably from operating on a negative number)`);
      }

      // TODO 2025-05-17: show a message about the operations that were done, maybe. could do some color coding

      // TODO 2025-05-17: do some basic error checking for newCurrentValue (e.g., isNaN) and throw an error if something went wrong

      // Store and show the new current value
      this.currentValue = newCurrentValue;
      log(this.currentValue); // <-- note: all sorts of edge cases here which would make things look bad (long decimals, `E` notation, so on)
      debugLog(`  (last op: ${this.lastOperation})`);
    } catch (error) {
      if (error instanceof CalculatorError) {
        log(`ERROR: ${error.message}. Resetting state`);
        this.reset();
      } else {
        throw error;
      }
    }
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
