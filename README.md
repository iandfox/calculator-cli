# Four Function Calculator CLI

## Installation

```
  npm i
```

## Usage

```
npm run start
```

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
