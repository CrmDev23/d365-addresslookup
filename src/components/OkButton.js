import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

class OkButton extends Component {
  handleClick = () => {
    const { plz, str, geb } = this.props;
    // eslint-disable-next-line no-restricted-globals
    parent.Xrm.Page.data.entity.attributes.get("new_attribute").getValue();
    alert(plz + str + geb);
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
  geb: getGebById(state, gebId)
});

export default connect(mapStateToProps)(OkButton);
