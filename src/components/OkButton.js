import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "@fluentui/react";
import { getClientUrl } from "../config";
import intl from "react-intl-universal";

class OkButton extends Component {
  handleClick = () => {
    const {
      plz,
      str,
      geb
    } = this.props;
    var addressDetails = {};
    addressDetails = { "str": str.mat_str_strbez2l + " " + geb.mat_geb_hnr,  "plz": plz.mat_plz_postleitzahl, "city": plz.mat_plz_ortbez27 };
    var stringifiedJSON = JSON.stringify(addressDetails);
    sessionStorage.setItem("addressDetails", stringifiedJSON);
    window.close();
  };

  render() {
    const buttonStyles = {
      root: {
        width: 100
      }
    };
    return (
      <PrimaryButton
        styles={buttonStyles}
        text={intl.get("OK")}
        onClick={this.handleClick}
      />
    );
  }
}

const mapStateToProps = (state, { plzId, strId, gebId }) => ({
  plz: getPlzById(state, plzId),
  str: getStrById(state, strId),
  geb: getGebById(state, gebId)
});

export default connect(mapStateToProps)(OkButton);
