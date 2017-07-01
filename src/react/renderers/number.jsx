import NumberType from '~/types/data/number';
import NumberInputType from '~/types/view/data/number';

import {withDataRenderer, withStaticRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import FormatronPropTypes from './propTypes';
import ReactRenderer from './reactRenderer';

const NumberInput = ({field, value, disabled, placeholder, onChange, onBlur}) => (
  <input
    className='formatron-input formatron-number'
    type='number'
    disabled={disabled}
    value={numberToInput(value)}
    placeholder={placeholder}
    onChange={e => onChange(inputToNumber(e.target.value))}
    onBlur={onBlur}
  />
);

NumberInput.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(NumberType).isRequired,
  value: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function numberToInput(number) {
  if (!Number.isFinite(number)) {
    return '';
  }
  return `${number}`;
}

function inputToNumber(input) {
  if (typeof input != 'string' || input.length == 0) {
    return null;
  }
  const number = Number(input);
  if (Number.isFinite(number)) {
    return number;
  }
  return null;
}

const NumberFilter = ({renderData}) => (
  <NumberInput
    field={renderData.dataType}
    value={renderData.dataValue}
    onChange={renderData.options.onChange}
    onBlur={renderData.options.onBlur}
  />
);

const NumberComponent = withDataRenderer(props => (
  <NumberInput {...props} />
));

const StaticNumber = withStaticRenderer(({value}) => (
  <p className='formatron-static-value'>{value}</p>
));

const NumberField = withFormLabel(NumberComponent);
const StaticNumberField = withStaticLabel(StaticNumber);

export default ReactRenderer.register(NumberInputType, NumberField, StaticNumberField, NumberFilter, NumberComponent, StaticNumber);

