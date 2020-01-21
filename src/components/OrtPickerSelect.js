import React, { Component } from "react";
import { connect } from "react-redux";
import { setPlz } from "../redux/actions";
import { getPlzsByIds } from "../redux/selectors";
import { ComboBox } from "office-ui-fabric-react/lib/ComboBox";

class OrtPickerSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      initialDisplayValue: "Gränichen"
    };
  }

  render() {
    const state = this.state;
    const { value, plzs } = this.props;
    let optionsKeyValue = plzs.map(plz => {
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
          label="Controlled single-select ComboBox (allowFreeform: T)"
          allowFreeform={true}
          autoComplete="on"
          options={optionsKeyValue}
          onChange={(event, option, index, value) =>
            this.onChange(event, option, index, value)
          }
          //onResolveOptions={currentOptions => this.getOptions(currentOptions)}
          //text={optionsKeyValue[0].mat_plz_ortbez27}
        />
      </span>
    );
  }

  getOptions(currentOptions) {
    if (this.state.options.length > 0) {
      return this.state.options;
    }

    const { plzs, value } = this.props;
    let optionsKeyValue = plzs.map(plz => {
      return {
        key: plz.mat_plzid,
        text: plz.mat_plz_ortbez27
      };
    });

    this.setState({
      options: optionsKeyValue,
      initialDisplayValue: undefined
    });

    return optionsKeyValue;
  }

  onChange(event, option, index, value) {
    const { setPlz } = this.props;
    console.log("_onChanged() is called: option = " + JSON.stringify(option));
    if (option) {
      // User chose an existing option
      //this.setState({
      //  selectedOptionKey: option.key
      //});
      setPlz(option.key);
    }
  }
}

const mapStateToProps = (state, { plzIds }) => ({
  plzs: getPlzsByIds(state, plzIds)
});

const actionCreators = { setPlz };

export default connect(
  mapStateToProps,
  actionCreators
)(OrtPickerSelect);
