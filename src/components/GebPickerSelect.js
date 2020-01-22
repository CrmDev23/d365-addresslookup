import React, { Component } from "react";
import { connect } from "react-redux";
import { setGeb } from "../redux/actions";
import { getGebsByIds } from "../redux/selectors";
import { ComboBox } from "office-ui-fabric-react/lib/ComboBox";

class GebPickerSelect extends Component {
  render() {
    const { options, value } = this.props;
    let optionsKeyValue = options.map(geb => {
      let optionText = "";
      if (geb.mat_geb_hnra) {
        optionText = geb.mat_geb_hnr + geb.mat_geb_hnra;
      } else if (geb.mat_geb_hnr) {
        optionText = geb.mat_geb_hnr.toString();
      }
      return {
        key: geb.mat_gebid,
        text: optionText
      };
    });

    return (
      <span>
        <h2>{value}</h2>
        <ComboBox
          selectedKey={value}
          label="Nummer"
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
