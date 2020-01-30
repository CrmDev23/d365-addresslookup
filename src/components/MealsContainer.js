import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchPlzs,
  fetchStrs,
  fetchGebs,
  fetchConfigs,
  setFieldnames
} from "../redux/actions";
import OrtPickerSelect from "./OrtPickerSelect";
import PlzPickerSelect from "./PlzPickerSelect";
import StrPickerSelect from "./StrPickerSelect";
import GebPickerSelect from "./GebPickerSelect";
import OkButton from "./OkButton";
import CancelButton from "./CancelButton";
import {
  selectPlzs,
  selectStrs,
  selectGebs,
  selectedPlz,
  selectedStr,
  selectedGeb
} from "../redux/selectors";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Text } from "office-ui-fabric-react/lib/Text";
import { FontWeights } from "office-ui-fabric-react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Overlay } from "office-ui-fabric-react";

class MealsContainer extends Component {
  componentDidMount() {
    const { fetchConfigs, setFieldnames } = this.props;
    fetchConfigs();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("data")) {
      const fieldnames = JSON.parse(urlParams.get("data"));
      setFieldnames(fieldnames);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.importSeqPlz !== 0 &&
      prevProps.importSeqPlz !== this.props.importSeqPlz
    ) {
      const { fetchPlzs, importSeqPlz } = this.props;
      fetchPlzs(importSeqPlz);
    }
    if (
      this.props.selectedPlz !== "" &&
      prevProps.selectedPlz !== this.props.selectedPlz &&
      this.props.importSeqStr !== 0
    ) {
      const { fetchStrs, selectedPlz, importSeqStr } = this.props;
      fetchStrs(selectedPlz, importSeqStr);
    }
    if (
      this.props.selectedStr !== "" &&
      prevProps.selectedStr !== this.props.selectedStr &&
      this.props.importSeqGeb !== 0
    ) {
      const { fetchGebs, selectedStr, importSeqGeb } = this.props;
      fetchGebs(selectedStr, importSeqGeb);
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

    const titleBoldStyle = { root: { fontWeight: FontWeights.semibold } };
    const buttonStackStyles = {
      root: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }
    };

    const innerStackTokens = { childrenGap: 5, padding: 10 };
    const buttonStackTokens = { childrenGap: 50, padding: 20 };
    const overlayStackTokens = { padding: 180 };

    return (
      <Stack>
        <Stack tokens={innerStackTokens}>
          <Text variant="large" styles={titleBoldStyle}>
            Adresse auswählen
          </Text>
        </Stack>
        <Stack tokens={innerStackTokens}>
          <OrtPickerSelect options={plzs} value={selectedPlz} />
          <PlzPickerSelect options={plzs} value={selectedPlz} />
          <StrPickerSelect options={strs} value={selectedStr} />
          <GebPickerSelect options={gebs} value={selectedGeb} />
        </Stack>
        <Stack horizontal tokens={buttonStackTokens} styles={buttonStackStyles}>
          <OkButton
            plzId={selectedPlz}
            strId={selectedStr}
            gebId={selectedGeb}
          />
          <CancelButton
            plzId={selectedPlz}
            strId={selectedStr}
            gebId={selectedGeb}
          />
        </Stack>
        {(plzs.length === 0 || strs.length === 0 || gebs.length === 0) && (
          <Overlay>
            <Stack
              horizontal
              tokens={overlayStackTokens}
              styles={buttonStackStyles}
            >
              <Spinner size={SpinnerSize.large} />
            </Stack>
          </Overlay>
        )}
      </Stack>
    );
  }
}

const mapStateToProps = state => ({
  plzs: selectPlzs(state),
  strs: selectStrs(state),
  gebs: selectGebs(state),
  selectedPlz: selectedPlz(state),
  selectedStr: selectedStr(state),
  selectedGeb: selectedGeb(state),
  importSeqPlz: state.ui.importSeqPlz,
  importSeqStr: state.ui.importSeqStr,
  importSeqGeb: state.ui.importSeqGeb
});

const actionCreators = {
  fetchPlzs,
  fetchStrs,
  fetchGebs,
  fetchConfigs,
  setFieldnames
};

export default connect(
  mapStateToProps,
  actionCreators
)(MealsContainer);
