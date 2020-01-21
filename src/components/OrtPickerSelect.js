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
      initialDisplayValue: "Suhr"
    };
  }

  render() {
    const state = this.state;
    const { value } = this.props;

    return (
      <span>
        <h2>{value}</h2>
        <ComboBox
          selectedKey={state.selectedOptionKey}
          label="Controlled single-select ComboBox (allowFreeform: T)"
          allowFreeform={true}
          autoComplete="on"
          options={state.options}
          onChange={(event, option, index, value) =>
            this.onChange(event, option, index, value)
          }
          onResolveOptions={currentOptions => this.getOptions(currentOptions)}
          text={state.initialDisplayValue}
        />
      </span>
    );
  }

  getOptions(currentOptions) {
    if (this.state.options.length > 0) {
      return this.state.options;
    }

    const { options, value } = this.props;
    let optionsKeyValue = options.map(plz => {
      return {
        key: plz.mat_plzid,
        text: plz.mat_plz_ortbez27
      };
    });

    this.setState({
      options: optionsKeyValue,
      selectedOptionKey: value,
      initialDisplayValue: undefined
    });

    return options;
  }

  onChange(event, option, index, value) {
    const { setPlz } = this.props;
    console.log("_onChanged() is called: option = " + JSON.stringify(option));
    if (option) {
      // User chose an existing option
      this.setState({
        selectedOptionKey: option.key
      });
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
