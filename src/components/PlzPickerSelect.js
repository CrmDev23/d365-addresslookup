import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getPlzsByIds } from "../redux/selectors";
import _sortBy from "lodash/sortBy";
import { VirtualizedComboBox } from "office-ui-fabric-react/lib/ComboBox";

class PlzPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsSorted = _sortBy(options, ["mat_plz_postleitzahl"]);
    let optionsKeyValue = optionsSorted.map(plz => {
      return {
        key: plz.mat_plzid,
        text: plz.mat_plz_postleitzahl
      };
    });
    return (
      <VirtualizedComboBox
        selectedKey={value}
        label="Plz"
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
)(PlzPickerSelect);
