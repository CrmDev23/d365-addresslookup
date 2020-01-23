import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Stack } from "office-ui-fabric-react/lib/Stack";

class CancelButton extends Component {
  handleClick = () => {
    const { plz, str, geb } = this.props;
    alert(plz + str + geb);
  };

  render() {
    const stackTokens = { childrenGap: 20 };
    return <PrimaryButton text="Cancel" onClick={this.handleClick} />;
  }
}

const mapStateToProps = (state, { plzId, strId, gebId }) => ({
  plz: getPlzById(state, plzId),
  str: getStrById(state, strId),
  geb: getGebById(state, gebId)
});

export default connect(
  mapStateToProps,
  null
)(CancelButton);
