import {compareAll, numericalDisplay, truthyDisplay} from '../utils';

import ValueType from './';

export default class ComputedType extends ValueType {
  static typeName = 'computed';

  static ops = {
    '+': args => args.reduce((a, b) => a + b) || 0,
    '-': args => args.reduce((a, b) => a - b) || 0,
    '*': args => args.reduce((a, b) => a * b) || 0,
    '/': args => args.reduce((a, b) => a / b) || 0,
    '^': args => args.reduce((a, b) => Math.pow(a, b), 1),
    '>': compareAll((a, b) => a > b),
    '<': compareAll((a, b) => a < b),
    '>=': compareAll((a, b) => a >= b),
    '<=': compareAll((a, b) => a <= b),
    '=': compareAll((a, b) => a == b),
    '!=': compareAll((a, b) => a != b)
  };

  static opDisplays = {
    '+': numericalDisplay,
    '-': numericalDisplay,
    '*': numericalDisplay,
    '/': numericalDisplay,
    '^': numericalDisplay,
    '>': truthyDisplay,
    '<': truthyDisplay,
    '>=': truthyDisplay,
    '<=': truthyDisplay,
    '=': truthyDisplay,
    '!=': truthyDisplay
  };

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', this.parseOneOrMany(parseField));
  }

  getOp() {
    return this.options.get('op');
  }

  getArgs() {
    return this.options.get('args');
  }

  getValue(renderData, renderers) {
    const values = this.getChildValues(renderData, this.getArgs(), renderers);
    const func = ComputedType.ops[this.getOp()];
    return func(values);
  }

  getDisplay(renderData, renderers) {
    const value = this.getValue(renderData, renderers);
    const func = ComputedType.opDisplays[this.getOp()];
    return func(value);
  }
}

