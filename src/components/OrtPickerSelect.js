import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getPlzsByIds } from "../redux/selectors";

class OrtPickerSelect extends Component {
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
          {options.map(plz => (
            <option value={plz.mat_plzid} key={plz.mat_plzid}>
              {plz.mat_plz_ortbez27}
            </option>
          ))}
        </select>
      </span>
    );
  }
}

const mapStateToProps = (state, { options }) => ({
  options: getPlzsByIds(state, options)
});

const actionCreators = { setPlz };

export default connect(
  mapStateToProps,
  actionCreators
)(OrtPickerSelect);
