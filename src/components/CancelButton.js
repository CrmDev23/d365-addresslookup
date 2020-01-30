import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

class CancelButton extends Component {
  handleClick = () => {
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
        text="Cancel"
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
