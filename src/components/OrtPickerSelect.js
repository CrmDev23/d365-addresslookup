import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getPlzsByIds } from "../redux/selectors";
import { VirtualizedComboBox } from "office-ui-fabric-react/lib/ComboBox";

class OrtPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsKeyValue = options.map((plz, index, array) => {
      // If city names are equal, add plz in parentesis
      if (
        (index > 0 &&
          array[index].mat_plz_ortbez27 ===
            array[index - 1].mat_plz_ortbez27) ||
        (array.length > index + 1 &&
          array[index].mat_plz_ortbez27 === array[index + 1].mat_plz_ortbez27)
      ) {
        return {
          key: plz.mat_plzid,
          text: plz.mat_plz_ortbez27 + " (" + plz.mat_plz_postleitzahl + ")"
        };
      } else {
        return {
          key: plz.mat_plzid,
          text: plz.mat_plz_ortbez27
        };
      }
    });
    return (
      <VirtualizedComboBox
        selectedKey={value}
        label="Ort"
        allowFreeform={true}
        autoComplete="on"
        options={optionsKeyValue}
        onChange={(event, option, index, value) =>
          this.onChange(event, option, index, value)
        }
        useComboBoxAsMenuWidth={true}
      />
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
