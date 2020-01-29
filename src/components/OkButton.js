import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

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
    // eslint-disable-next-line no-restricted-globals
    parent.Xrm.Page.data.entity.attributes
      .get(plz_fieldname)
      .setValue(plz.mat_plz_postleitzahl);
    // eslint-disable-next-line no-restricted-globals
    parent.Xrm.Page.data.entity.attributes
      .get(city_fieldname)
      .setValue(str.mat_plz_ortbez27);
    // eslint-disable-next-line no-restricted-globals
    parent.Xrm.Page.data.entity.attributes
      .get(str_fieldname)
      .setValue(str.mat_str_strbez2l + " " + gebText);
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
        text="OK"
        onClick={this.handleClick}
      />
    );
  }
}

const mapStateToProps = (state, { plzId, strId, gebId }) => ({
  plz: getPlzById(state, plzId),
  str: getStrById(state, strId),
  geb: getGebById(state, gebId),
  plz_fieldname: state.ui.fieldnames.plz_fieldname,
  str_fieldname: state.ui.fieldnames.str_fieldname,
  city_fieldname: state.ui.fieldnames.city_fieldname
});

export default connect(mapStateToProps)(OkButton);
