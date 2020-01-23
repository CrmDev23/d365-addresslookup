import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

class OkButton extends Component {
  handleClick = () => {
    const { plz, str, geb } = this.props;
    alert(plz + str + geb);
  };

  render() {
    return (
      <div>
        <h2 />
        <PrimaryButton text="OK" onClick={this.handleClick} />
      </div>
    );
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
)(OkButton);
