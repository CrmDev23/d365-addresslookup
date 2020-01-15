import React, { Component } from "react";
import { connect } from "react-redux";
import { setGeb } from "../redux/actions";
import { getGebsByIds } from "../redux/selectors";

class GebPickerSelect extends Component {
  render() {
    const { options, value, setGeb } = this.props;
    return (
      <span>
        <h2>{value}</h2>
        <select
          onChange={e => {
            setGeb(e.target.value);
          }}
          value={value}
        >
          {options.map(str => (
            <option value={str.mat_gebid} key={str.mat_gebid}>
              {str.mat_geb_hnra
                ? str.mat_geb_hnr + str.mat_geb_hnra
                : str.mat_geb_hnr}
            </option>
          ))}
        </select>
      </span>
    );
  }
}

const mapStateToProps = (state, { options }) => ({
  options: getGebsByIds(state, options)
});

const actionCreators = { setGeb };

export default connect(
  mapStateToProps,
  actionCreators
)(GebPickerSelect);
