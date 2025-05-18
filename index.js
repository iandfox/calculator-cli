import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import process from 'node:process'; // can't import `on` from `process` apparently
import { Calculator } from './classes/Calculator.class.js';
import { log } from './helpers/log.js';

const rl = readline.createInterface({ input, output });

const calculator = new Calculator();

const loop = async () => {
  const input = await rl.question('> ');
  calculator.handleInput(input);
  loop();
};

loop();

// doesn't get called with ctrl+c, but it feels wrong to leave it out
process.on("exit", () => {
  rl.close();
});
