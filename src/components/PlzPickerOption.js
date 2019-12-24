import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById } from "../redux/selectors";

class PlzPickerOption extends Component {
  render() {
    const { plz } = this.props;
    return <option value={plz.mat_plzid}>{plz.mat_plz_postleitzahl}</option>;
  }
}

const mapStateToProps = (state, { id }) => ({
  plz: getPlzById(state, id)
});

export default connect(mapStateToProps)(PlzPickerOption);
