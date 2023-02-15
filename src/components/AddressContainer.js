import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchPlzs,
  fetchStrs,
  fetchStrsFach,
  fetchGebs,
  fetchConfigs,
  setParameters,
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
  selectedPlzName,
  selectedPlz,
  selectedStr,
  selectedGebName
} from "../redux/selectors";
import { Stack } from "@fluentui/react";
import { FontWeights } from "@fluentui/react";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Overlay } from "@fluentui/react";
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import intl from "react-intl-universal";
import { getUserLocal } from "../config";


class AddressContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { initDone: false, hideDialog: false };
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
    const { fetchConfigs, setParameters } = this.props;
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("data")) {
      const parameters = JSON.parse(urlParams.get("data"));
      setParameters(parameters);
    }

    this.loadLocales();

    fetchConfigs();
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
      this.props.selectedPlzName &&
      prevProps.selectedPlzName !== this.props.selectedPlzName &&
      this.props.importSeqStr !== 0
    ) {
      const { fetchStrsFach, selectedPlzName, importSeqStr } = this.props;
      fetchStrsFach(selectedPlzName, importSeqStr);
    }
  }

  render() {
    const {
      plzs,
      strs,
      gebs,
      selectedPlzName,
      selectedPlzId,
      selectedStrId,
      selectedGebName,
      isLoading,
      isImportRunning,
    } = this.props;

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
    const dialogStyles = { main: { maxWidth: 450 } };
    const dialogContentProps = {
      type: DialogType.normal,
      title: intl.get("DIALOG_TITLE"),
      closeButtonAriaLabel: "Close",
      subText: intl.get("DIALOG_SUBTEXT"),
    };
    const modalProps = {
        isBlocking: false,
        styles: dialogStyles,
        dragOptions: undefined,
      };

    return (
      this.state.initDone && (
        <Stack>
          <Stack tokens={innerStackTokens}>
          </Stack>
          <Stack tokens={innerStackTokens}>
            <OrtPickerSelect options={plzs} value={selectedPlzName} />
            <PlzPickerSelect options={plzs} value={selectedPlzId} />
            <StrPickerSelect options={strs} value={selectedStrId} />
            <GebPickerSelect options={gebs} value={selectedGebName} />
          </Stack>
          <Stack
            horizontal
            tokens={buttonStackTokens}
            styles={buttonStackStyles}
          >
            <OkButton
              plzId={selectedPlzId}
              strId={selectedStrId}
              gebId={selectedGebName}
            />
            <CancelButton
              plzId={selectedPlzId}
              strId={selectedStrId}
              gebId={selectedGebName}
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
          {isImportRunning && (
            <Dialog
              hidden={this.state.hideDialog}
              onDismiss={() => {
                this.setState({ hideDialog: true });
              }}
              dialogContentProps={dialogContentProps}
              modalProps={modalProps}
            >
              <DialogFooter>
                <PrimaryButton onClick={() => {
                  this.setState({ hideDialog: true });
                }} text={intl.get("OK")} />
              </DialogFooter>
            </Dialog>
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
  selectedPlzName: selectedPlzName(state),
  selectedPlzId: selectedPlz(state),
  selectedStrId: selectedStr(state),
  selectedGebName: selectedGebName(state),
  importSeqPlz: state.ui.importSeqPlz,
  importSeqStr: state.ui.importSeqStr,
  importSeqGeb: state.ui.importSeqGeb,
  isLoading: state.ui.isLoading,
  isImportRunning: state.ui.isImportRunning,
});

const actionCreators = {
  fetchPlzs,
  fetchStrs,
  fetchStrsFach,
  fetchGebs,
  fetchConfigs,
  setParameters,
};

export default connect(mapStateToProps, actionCreators)(AddressContainer);
