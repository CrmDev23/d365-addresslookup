import React, { Component } from "react";
import { connect } from "react-redux";
import { setStr } from "../redux/actions";
import { getStrsByIds } from "../redux/selectors";
import { ComboBox } from "office-ui-fabric-react/lib/ComboBox";

class StrPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsKeyValue = options.map(plz => {
      return {
        key: plz.mat_strid,
        text: plz.mat_str_strbez2l
      };
    });

    return (
      <span>
        <h2>{value}</h2>
        <ComboBox
          selectedKey={value}
          label="Strasse"
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
    const { setStr } = this.props;
    if (option) {
      setStr(option.key);
    }
  }
}

const mapStateToProps = (state, { options }) => ({
  options: getStrsByIds(state, options)
});

const actionCreators = { setStr };

export default connect(
  mapStateToProps,
  actionCreators
)(StrPickerSelect);
