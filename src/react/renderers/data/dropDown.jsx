import {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Select from '~/react/components/tetheredSelect';
import FormatronPropTypes from '~/react/propTypes';
import EnumType from '~/types/data/enum';
import DropDownType from '~/types/view/data/dropDown';

import {withFormLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableDropDownFilter} from '../tableHelpers';
import {withDataRenderer, withDisplayRenderer} from './';

const DropDownFilter = ({viewType, renderData}) => (
  <TableDropDownFilter
    renderData={renderData}
    filterOptions={viewType.getFilterOptions(renderData.dataType)}
    options={viewType.getOptions(renderData.dataType).toJS()}
  />
);

class MultiDropDown extends React.Component {
  createLoadingOptions(value) {
    return [{
      value,
      label: 'Loading...'
    }];
  }

  getCache = () => {
    const {viewType, field, value, renderData} = this.props;

    if (field.getValuesCache) {
      const cache = field.getValuesCache();

      const valueOption = viewType.getValueOption(field, value, renderData);
      if (valueOption && valueOption.length > 0) {
        const options = cache[''];
        const hasValueOption = options.find(option => option.label == valueOption[0].label);
        if (!hasValueOption) {
          cache[''].unshift(valueOption[0]);
        }
      }
      return cache;
    }
    return null;
  }

  render() {
    const {viewType, renderData, field, value, placeholder, disabled, onChange, onBlur} = this.props;
    const isAsync = viewType.isAsync(field);

    const options = !isAsync
      ? viewType.getOptions(field).toJS()
      : viewType.getValueOption(field, value, renderData);

    return <Select
      className='formatron-input formatron-dropdown formatron-multi'
      tetheredClassName='formatron-dropdown-tether'
      async={isAsync}
      value={value ? value.toJS() : []}
      placeholder={placeholder || 'Select...'}
      disabled={disabled}
      multi={true}
      filterOptions={viewType.getFilterOptions(field)}
      options={options || this.createLoadingOptions(value)}
      loadOptions={isAsync && viewType.getOptions.bind(viewType, field, renderData, value)}
      autoload={true}
      cache={isAsync && this.getCache()}
      onChange={options => onChange(List(options)
        .map(parseOption)
        .filter(option => option)
      )}
      onBlur={onBlur}
    />;
  }
};

MultiDropDown.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(EnumType).isRequired,
  value: React.PropTypes.oneOfType([
    ImmutablePropTypes.listOf(
      React.PropTypes.string.isRequired
    ).isRequired,
    ImmutablePropTypes.listOf(
      React.PropTypes.number.isRequired
    ).isRequired
  ]).isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

class SingleDropDown extends React.Component {
  createLoadingOptions(value) {
    return [{
      value,
      label: 'Loading...'
    }];
  }

  getCache = () => {
    const {viewType, field, value, renderData} = this.props;

    if (field.getValuesCache) {
      const cache = field.getValuesCache();
      const valueOption = viewType.getValueOption(field, value, renderData);
      if (valueOption && valueOption.length > 0) {
        const options = cache[''];
        const hasValueOption = options.find(option => option.label == valueOption[0].label);
        if (!hasValueOption) {
          cache[''].unshift(valueOption[0]);
        }
      }
      return cache;
    }
    return null;
  }

  render() {
    const {viewType, renderData, field, value, placeholder, disabled, onChange, onBlur} = this.props;
    const isAsync = viewType.isAsync(field);

    const options = !isAsync
      ? viewType.getOptions(field).toJS()
      : viewType.getValueOption(field, value, renderData);

    return <Select
      className='formatron-input formatron-dropdown formatron-single'
      tetheredClassName='formatron-dropdown-tether'
      async={isAsync}
      value={value === null ? '' : value}
      placeholder={placeholder || 'Select...'}
      disabled={disabled}
      filterOptions={viewType.getFilterOptions(field)}
      options={options || this.createLoadingOptions(value)}
      loadOptions={isAsync && viewType.getOptions.bind(viewType, field, renderData, value)}
      autoload={true}
      cache={isAsync && this.getCache()}
      onChange={option => onChange(parseOption(option))}
      onBlur={onBlur}
    />;
  }
}

SingleDropDown.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(EnumType).isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function parseOption(option) {
  if (!option || typeof option.value == 'undefined') {
    return null;
  }
  return option.value;
}

const DropDown = withDataRenderer(props => (
  props.viewType.isMulti(props.field) ? (
    <MultiDropDown {...props} />
  ) : (
    <SingleDropDown {...props} />
  )
));

const StaticDropDown = withDisplayRenderer(({value}) => {
  return <p className='formatron-static-value'>{value}</p>;
});

const DropDownField = withFormLabel(DropDown);
const StaticDropDownField = withStaticLabel(StaticDropDown);

export default ReactRenderer.register(
  DropDownType,
  DropDownField,
  StaticDropDownField,
  DropDownFilter,
  DropDown,
  StaticDropDown
);

