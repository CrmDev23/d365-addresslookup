import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPlzs, fetchStrs, fetchGebs } from "../redux/actions";
import PlzPickerSelect from "./PlzPickerSelect";
import StrPickerSelect from "./StrPickerSelect";
import GebPickerSelect from "./GebPickerSelect";
import {
  selectPlzs,
  selectStrs,
  selectGebs,
  selectedPlz,
  selectedStr,
  selectedGeb
} from "../redux/selectors";

class MealsContainer extends Component {
  componentDidMount() {
    const { fetchPlzs } = this.props;
    fetchPlzs();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedPlz !== this.props.selectedPlz) {
      const { fetchStrs, selectedPlz } = this.props;
      fetchStrs(selectedPlz);
    }
    if (prevProps.selectedStr !== this.props.selectedStr) {
      const { fetchGebs, selectedStr } = this.props;
      fetchGebs(selectedStr);
    }
  }

  render() {
    const {
      plzs,
      strs,
      gebs,
      selectedPlz,
      selectedStr,
      selectedGeb
    } = this.props;

    return (
      <div className="meals-container">
        <PlzPickerSelect options={plzs} value={selectedPlz} />
        <StrPickerSelect options={strs} value={selectedStr} />
        <GebPickerSelect options={gebs} value={selectedGeb} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plzs: selectPlzs(state),
  strs: selectStrs(state),
  gebs: selectGebs(state),
  selectedPlz: selectedPlz(state),
  selectedStr: selectedStr(state),
  selectedGeb: selectedGeb(state)
});

const actionCreators = { fetchPlzs, fetchStrs, fetchGebs };

export default connect(
  mapStateToProps,
  actionCreators
)(MealsContainer);
