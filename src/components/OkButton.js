import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "@fluentui/react";
import intl from "react-intl-universal";

class OkButton extends Component {
  handleClick = () => {
    const {
      plz,
      str,
      geb,
      plz_fieldname,
      str_fieldname,
      city_fieldname
    } = this.props;
    let gebText = "";
    if (geb.mat_geb_hnra) {
      gebText = geb.mat_geb_hnr + geb.mat_geb_hnra;
    } else if (geb.mat_geb_hnr) {
      gebText = geb.mat_geb_hnr.toString();
    }
    window.parent.parent.opener.Xrm.Page.getAttribute(plz_fieldname).setValue(
      plz.mat_plz_postleitzahl
    );
    window.parent.parent.opener.Xrm.Page.getAttribute(city_fieldname).setValue(
      plz.mat_plz_ortbez27
    );
    window.parent.parent.opener.Xrm.Page.getAttribute(str_fieldname).setValue(
      str.mat_str_strbez2l + " " + gebText
    );
    window.parent.parent.close();
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
  geb: getGebById(state, gebId),
  plz_fieldname: state.ui.parameters.plz_fieldname,
  str_fieldname: state.ui.parameters.str_fieldname,
  city_fieldname: state.ui.parameters.city_fieldname
});

export default connect(mapStateToProps)(OkButton);
