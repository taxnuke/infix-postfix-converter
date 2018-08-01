/**
 * Evaluate postfix expression
 * @param postfix tokens must be space separated
 * @returns {number}
 */
exports.evaluatePostfix = function (postfix) {
  const tokens = postfix.split(' ');
  const stack = [];

  for (const token of tokens) {
    if (!['+', '-', '/', '*', '^'].includes(token)) {
      stack.push(parseFloat(token));
    } else {
      const operands = [stack.pop(), stack.pop()].reverse();
      stack.push(operands.reduce((prev, curr) => {
        switch (token) {
          case '+': return prev + curr;
          case '-': return prev - curr;
          case '*': return prev * curr;
          case '/': return prev / curr;
          case '^': return Math.pow(prev, curr);
        }
      }));
    }
  }

  return stack.pop();
};

/**
 * Convert from infix to postfix notation
 * @param infix {string} tokens must be space separated
 * @returns {string}
 */
exports.toPostfix = function (infix) {
  /**
   * todo: implement constants e.g. PI, E, TAU
   * todo: implement functions e.g. sin cos tg
   */
  const Associativity = Object.freeze({ left: 'l', right: 'r' });
  const operators = Object.freeze({
    '^': { string: '^', precedence: 4, associativity: Associativity.right },
    '*': { string: '*', precedence: 3, associativity: Associativity.left },
    '/': { string: '/', precedence: 3, associativity: Associativity.left },
    '+': { string: '+', precedence: 2, associativity: Associativity.left },
    '-': { string: '-', precedence: 2, associativity: Associativity.left },
    '(': { precedence: 0, isBracket: true },
  });

  const tokens = infix.split(' ');
  const outputStack = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (!(token in operators)) {
      if (token === ')') {
        while (!operatorStack[operatorStack.length - 1].isBracket) {
          outputStack.push(operatorStack.pop().string);
        }
        operatorStack.pop();
      } else {
        outputStack.push(token);
      }

      continue;
    }

    const op1 = operators[token];

    if (!operatorStack.length || op1.isBracket) {
      operatorStack.push(op1);
      continue;
    }

    const op2 = operatorStack[operatorStack.length - 1];

    if (op2.precedence < op1.precedence) {
      operatorStack.push(op1);
      continue;
    }

    while (operatorStack.length) {
      const op2 = operatorStack[operatorStack.length - 1];
      if (
        (op1.associativity === Associativity.left &&
          op1.precedence <= op2.precedence)
        ||
        (op1.associativity === Associativity.right &&
          op1.precedence < op2.precedence)
      ) {
        operatorStack.pop();
        outputStack.push(op2.string);
      } else {
        break;
      }
    }
    operatorStack.push(op1);
  }

  const res = outputStack
    .concat(
      operatorStack
        .reverse()
        .map(x => x.string)
    );

  return res.join(' ');
};