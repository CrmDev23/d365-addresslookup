import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getPlzsByIds } from "../redux/selectors";
import { ComboBox } from "office-ui-fabric-react/lib/ComboBox";

class OrtPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsKeyValue = options.map(plz => {
      return {
        key: plz.mat_plzid,
        text: plz.mat_plz_ortbez27
      };
    });

    return (
      <span>
        <h2>{value}</h2>
        <ComboBox
          selectedKey={value}
          label="Ort"
          allowFreeform={true}
          autoComplete="on"
          options={optionsKeyValue}
          onChange={(event, option, index, value) =>
            this.onChange(event, option, index, value)
          }
        />
      </span>
    );
  }

  onChange(event, option, index, value) {
    const { setPlz } = this.props;
    if (option) {
      setPlz(option.key);
    }
  }
}

const mapStateToProps = (state, { options }) => ({
  options: getPlzsByIds(state, options)
});

const actionCreators = { setPlz };

export default connect(
  mapStateToProps,
  actionCreators
)(OrtPickerSelect);
