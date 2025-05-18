import { CalculatorError } from "./CalculatorError.class.js";

export class Calculator {
  currentValue = 0;
  queue = [];

  reset() {
    this.currentValue = 0;
    this.queue = [];
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
    input = input.toString(); // just in case

    // Strip everything out so we have a clean/predicatably-written string
    input = this.cleanInput(input);

    if (input === "") {
      // Nothing. Just show the current value
      // TODO 2025-05-17: Show current value -- not just here, but probably everywhere
    } else if (input === "c") {
      // Acts like the 'AC' button and clears out the current value and any pending operations (if this were a physical calculator, anyway)
      this.reset();
      // TODO 2025-05-17: Show message about clearing stuff out
    } else if (input === "!") {
      // Negate the current value
      this.currentValue = -1 * this.currentValue;
    } else if (input === "=") {
      // TODO 2025-05-17: Redo the most recent operation.
    } else if (input.match(/^[0-9]+$/)) {
      // regex is 'from start to finish, only numbers'
      // Replace current value
      this.currentValue = parseFloat(input);
    } else if (input.match(/^[0-9+\-\*\/c\./]+$/)) {
      // regex is 'numbers and ops all the way through'
      // If input starts with an operator, we assume the user wants to apply that operator to the current value
      if (input.match(/^[+\-\*\/]/)) {
        // Prepend current value to the string, and handle it the same as we handle a solo string
        input = `${this.currentValue.toString()}${input}`;
      }
      // TODO 2025-05-17: Recursive handling of operations
    } else {
      // If we're here, then something has gone horribly horribly wrong
      throw new CalculatorError(`Invalid input: ${input}`);
    }

    // TODO 2025-05-17: show a message about the operations that were done, maybe. could do some color coding

    // Show the new current value
    print(this.currentValue.toString()); // <-- note: all sorts of edge cases here which will make things look bad (long decimals, `E` notation, so on)
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
