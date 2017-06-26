import {List, Map} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes, compareAll, numericalDisplay, truthyDisplay} from './';

export default function(register) {
  register('computed', {
    parseOptions(options, parseField) {
      return options
        .update('args', args => {
          if (Map.isMap(args)) {
            return parseField(args);
          } else {
            return args.map(parseField);
          }
        });
    },

    Component: ComputedComponent,
    getValue: getComputedValue,
    getDisplayValue: getComputedDisplayValue
  });
}

const ops = {
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

const displays = {
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

const ComputedComponent = ({options, getters}) => {
  return <div className='form-computed'>
    <Label getters={getters}>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {getComputedDisplayValue(options, getters)}
    </div>
  </div>;
};

ComputedComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    op: React.PropTypes.string.isRequired,
    args: React.PropTypes.oneOfType([
      ImmutablePropTypes.listOf(
        FormPropTypes.value.isRequired
      ).isRequired,
      FormPropTypes.value.isRequired
    ]).isRequired,
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getComputedDisplayValue(options, getters) {
  const value = getComputedValue(options, getters);
  return displays[options.get('op')](value);
}

function getComputedValue(options, getters) {
  const args = options.get('args');
  const values = List.isList(args) ?
    args.map(arg => arg.getValue(getters)) :
    args.getValue(getters) || List();

  return ops[options.get('op')](values);
}
