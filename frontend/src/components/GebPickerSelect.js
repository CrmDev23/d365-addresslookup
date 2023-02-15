import React, { Component } from "react";
import { connect } from "react-redux";
import { setGeb } from "../redux/actions";
import { getGebsByIds } from "../redux/selectors";
import { VirtualizedComboBox } from "@fluentui/react";
import intl from "react-intl-universal";

class GebPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsKeyValue = options.map(str => {
      return {
        key: str.mat_strid,
        text: str.mat_geb_hnr
      };
    });
    return (
      <VirtualizedComboBox
        selectedKey={value}
        label={intl.get("STREET_NUMBER")}
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
    const { setGeb } = this.props;
    if (option) {
      setGeb(option.key);
    }
  }
}

const mapStateToProps = (state, { options }) => ({
  options: getGebsByIds(state, options)
});

const actionCreators = { setGeb };

export default connect(
  mapStateToProps,
  actionCreators
)(GebPickerSelect);
