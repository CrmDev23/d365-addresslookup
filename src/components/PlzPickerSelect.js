import React, { Component } from "react";
import { connect } from "react-redux";
import PlzPickerOption from "./PlzPickerOption";
import { setPlz } from "../redux/actions";

class PlzPickerSelect extends Component {
  render() {
    const { options, value, setPlz } = this.props;
    return (
      <span>
        <h2>{value}</h2>
        <select
          onChange={e => {
            setPlz(e.target.value);
          }}
          value={value}
        >
          {options.map(m => (
            <PlzPickerOption key={m} id={m} />
          ))}
        </select>
      </span>
    );
  }
}

const actionCreators = { setPlz };

export default connect(
  null,
  actionCreators
)(PlzPickerSelect);
