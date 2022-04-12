import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchPlzs,
  fetchStrs,
  fetchStrsFach,
  fetchGebs,
  fetchConfigs,
  setFieldnames,
} from "../redux/actions";
import OrtPickerSelect from "./OrtPickerSelect";
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
  selectedGeb,
  getPlzById,
} from "../redux/selectors";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Text } from "office-ui-fabric-react/lib/Text";
import { FontWeights } from "office-ui-fabric-react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Overlay } from "office-ui-fabric-react";
import intl from "react-intl-universal";
import { getUserLocal } from "../config";

class AddressContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { initDone: false };
  }

  getLocale = (locale) => {
    return import("../locales/" + locale);
  };

  loadLocales = () => {
    getUserLocal().then((userLocal) => {
      this.getLocale(userLocal).then((localData) => {
        intl
          .init({
            currentLocale: userLocal,
            locales: { [userLocal]: localData },
          })
          .then(() => {
            this.setState({ initDone: true });
          });
      });
    });
  };

  componentDidMount() {
    this.loadLocales();

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
      this.props.selectedPlzId &&
      prevProps.selectedPlzId !== this.props.selectedPlzId &&
      this.props.importSeqStr !== 0
    ) {
      const { fetchStrsFach, selectedPlzId, importSeqStr } = this.props;
      fetchStrsFach(selectedPlzId, importSeqStr);
    }
  }

  render() {
    const {
      plzs,
      strs,
      gebs,
      selectedPlzId,
      selectedStrId,
      selectedGebId,
      isLoading,
    } = this.props;

    const titleBoldStyle = { root: { fontWeight: FontWeights.semibold } };
    const buttonStackStyles = {
      root: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      },
    };

    const innerStackTokens = { childrenGap: 5, padding: 10 };
    const buttonStackTokens = { childrenGap: 50, padding: 20 };
    const overlayStackTokens = { padding: 180 };

    return (
      this.state.initDone && (
        <Stack>
          <Stack tokens={innerStackTokens}>
            <Text variant="large" styles={titleBoldStyle}>
              {intl.get("SELECT_ADDRESS")}
            </Text>
          </Stack>
          <Stack tokens={innerStackTokens}>
            <OrtPickerSelect options={plzs} value={selectedPlzId} />
            <StrPickerSelect options={strs} value={selectedStrId} />
            <GebPickerSelect options={gebs} value={selectedGebId} />
          </Stack>
          <Stack
            horizontal
            tokens={buttonStackTokens}
            styles={buttonStackStyles}
          >
            <OkButton
              plzId={selectedPlzId}
              strId={selectedStrId}
              gebId={selectedGebId}
            />
            <CancelButton
              plzId={selectedPlzId}
              strId={selectedStrId}
              gebId={selectedGebId}
            />
          </Stack>
          {isLoading && (
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
      )
    );
  }
}

const mapStateToProps = (state) => ({
  plzs: selectPlzs(state),
  strs: selectStrs(state),
  gebs: selectGebs(state),
  selectedPlzId: selectedPlz(state),
  selectedStrId: selectedStr(state),
  selectedGebId: selectedGeb(state),
  selectedPlz: getPlzById(state, state.ui.selectedPlz),
  importSeqPlz: state.ui.importSeqPlz,
  importSeqStr: state.ui.importSeqStr,
  importSeqGeb: state.ui.importSeqGeb,
  isLoading: state.ui.isLoading,
});

const actionCreators = {
  fetchPlzs,
  fetchStrs,
  fetchStrsFach,
  fetchGebs,
  fetchConfigs,
  setFieldnames,
};

export default connect(mapStateToProps, actionCreators)(AddressContainer);
