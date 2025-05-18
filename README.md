# Four Function Calculator CLI

## Installation

```
  npm i
```

## Usage

```
  node index.js
```
(for now)

### Tests

(Not complete coverage as of 2025-05-18)
```
  npm test
```

## Prompt

Coding Assignment

Server Engineering

Problem Statement:

Build a simple four function (addition, subtraction, multiplication,
division) calculator with an interactive command line interface.
The user enters a series of keys corresponding to buttons on the
calculator, and when the user presses enter, the program outputs
what would currently be displayed on the calculator if that series
of buttons had been pressed, and then presents another prompt to
enter more inputs. The state is maintained between entered lines.
The “AC” button should be entered as “c”, the “+/-” button should
be entered as “!”, the “X” button should be entered as “*” and the
“÷” button should be entered as “/”. The rest should be entered as
the character shown on the button in the image to the right.
As an example, here is a sequence of inputs and expected outputs
from a correct solution:
```
  0
  > 2+45
  45
  > =
  47     // <-- see [1], below
  > *3=
  141
  > -8+12=
  145
  > c
  0
```

> [1] for the record, I think the prompt has a typo, and I'm going to assume that the intent is "the last operation was `+45`," and I'm also going to have the last operation be determined from MDAS ordering (because to expand the calculator, the first thing I'd do is MDAS ordering, anyway). Hope that's okay - Ian, 2025-05-18

Your application can be written in whatever language/framework you are most comfortable in.
It must work like a standard calculator. Note that you are not required to implement the
memory functions (M+/MR/MC).
Evaluation Criteria:
You will be evaluated on the following criteria:
- Functional accuracy
- Code architecture/structure, style, and readability
- Code organization and modularity
Acceptance Criteria:
At the minimum, your submission should be able to handle the four basic operations + - * / and
display the current state of the calculator when the enter key is pressed.
Time:
Please plan to do this assignment in one-sitting. Please record your start time and your end
time and include how much time you spent on this in your submission. We appreciate knowing
the actual time so that we can collect data to calibrate for the future.
Submission:
Please send your submission back to us via email and include a zip file or a link to a GitHub
project for the source. If you are using a zip file, be sure to omit the node_modules folder.
Please let us know of any bugs or todo items of note.
