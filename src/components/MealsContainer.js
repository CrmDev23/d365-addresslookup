import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchPlzs,
  fetchStrs,
  fetchGebs,
  fetchConfigs,
  setObject
} from "../redux/actions";
import OrtPickerSelect from "./OrtPickerSelect";
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
    const { fetchPlzs, fetchConfigs, setObject } = this.props;
    fetchConfigs().then(() => fetchPlzs());

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("Data")) {
      const dataParams = new URLSearchParams(urlParams.get("Data"));
      if (dataParams.has("object")) {
        const object = JSON.parse(dataParams.get("object"));
        setObject(object);
      }
    }
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
        <OrtPickerSelect options={plzs} value={selectedPlz} />
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

const actionCreators = {
  fetchPlzs,
  fetchStrs,
  fetchGebs,
  fetchConfigs,
  setObject
};

export default connect(
  mapStateToProps,
  actionCreators
)(MealsContainer);
