import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import process from "node:process";

const rl = readline.createInterface({ input, output });

const loop = async () => {
  const answer = await rl.question("> ");
  loop();
};

loop();

// doesn't get called with ctrl+c, but it feels wrong to leave it out
process.on("exit", () => {
  rl.close();
});
