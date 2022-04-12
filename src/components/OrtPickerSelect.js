import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getUniquePlzsNamesByIds } from "../redux/selectors";
import { VirtualizedComboBox } from "office-ui-fabric-react/lib/ComboBox";
import intl from "react-intl-universal";

class OrtPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsKeyValue = options.map((plz) => {
      return {
        key: plz,
        text: plz,
      };
    });

    return (
      <VirtualizedComboBox
        selectedKey={value}
        label={intl.get("CITY")}
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
  options: getUniquePlzsNamesByIds(state, options),
});

const actionCreators = { setPlz };

export default connect(mapStateToProps, actionCreators)(OrtPickerSelect);
