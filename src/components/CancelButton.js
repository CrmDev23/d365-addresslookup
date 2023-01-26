import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { DefaultButton } from '@fluentui/react/lib/Button';
import intl from "react-intl-universal";

class CancelButton extends Component {
  handleClick = () => {
    sessionStorage.removeItem("addressDetails");
    window.close();
  };

  render() {
    const buttonStyles = {
      root: {
        width: 100
      }
    };
    return (
      <DefaultButton
        styles={buttonStyles}
        text={intl.get("CANCEL")}
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

export default connect(mapStateToProps)(CancelButton);
