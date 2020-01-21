import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlzById, getStrById, getGebById } from "../redux/selectors";

class OkButton extends Component {
  handleClick = () => {
    const { plz, str, geb } = this.props;
    alert(plz + str + geb);
  };

  render() {
    return (
      <span>
        <button onClick={this.handleClick}>OK</button>
      </span>
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
