import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getStrsByIds } from "../redux/selectors";

class StrPickerSelect extends Component {
  render() {
    const { options, value, setStr } = this.props;
    return (
      <span>
        <h2>{value}</h2>
        <select
          onChange={e => {
            setStr(e.target.value);
          }}
          value={value}
        >
          {options.map(str => (
            <option value={str.mat_str_strid} key={str.mat_str_strid}>
              {str.mat_str_strbez2l}
            </option>
          ))}
        </select>
      </span>
    );
  }
}

const mapStateToProps = (state, { options }) => ({
  options: getStrsByIds(state, options)
});

const actionCreators = { setPlz };

export default connect(
  mapStateToProps,
  actionCreators
)(StrPickerSelect);
