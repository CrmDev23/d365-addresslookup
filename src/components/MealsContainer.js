import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMeals, fetchPlzs, fetchStrs, fetchGebs } from "../redux/actions";
import MealShowcase from "./MealShowcase";
import PlzPickerSelect from "./PlzPickerSelect";
import StrPickerSelect from "./StrPickerSelect";
import GebPickerSelect from "./GebPickerSelect";
import {
  selectBreakfastMeals,
  selectDinnerMeals,
  selectLunchMeals,
  selectPlzs,
  selectStrs,
  selectGebs,
  selectedPlz,
  selectedStr,
  selectedGeb
} from "../redux/selectors";

class MealsContainer extends Component {
  componentDidMount() {
    const { fetchPlzs } = this.props;
    fetchPlzs();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedPlz !== this.props.selectedPlz) {
      const { fetchStrs, selectedPlz } = this.props;
      fetchStrs(selectedPlz);
    }
    if (prevProps.selectedStr !== this.props.selectedStr) {
      const { fetchGebs, selectedStr } = this.props;
      fetchGebs(selectedStr);
    }
  }

  render() {
    const {
      breakfastMeals,
      lunchMeals,
      dinnerMeals,
      plzs,
      strs,
      gebs,
      selectedPlz,
      selectedStr,
      selectedGeb
    } = this.props;

    return (
      <div className="meals-container">
        <MealShowcase title="Breakfast" meals={breakfastMeals} />
        <MealShowcase title="Lunch" meals={lunchMeals} />
        <MealShowcase title="Dinner" meals={dinnerMeals} />
        <PlzPickerSelect options={plzs} value={selectedPlz} />
        <StrPickerSelect options={strs} value={selectedStr} />
        <GebPickerSelect options={gebs} value={selectedGeb} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  breakfastMeals: selectBreakfastMeals(state),
  lunchMeals: selectLunchMeals(state),
  dinnerMeals: selectDinnerMeals(state),
  plzs: selectPlzs(state),
  strs: selectStrs(state),
  gebs: selectGebs(state),
  selectedPlz: selectedPlz(state),
  selectedStr: selectedStr(state),
  selectedGeb: selectedGeb(state)
});

const actionCreators = { fetchMeals, fetchPlzs, fetchStrs, fetchGebs };

export default connect(
  mapStateToProps,
  actionCreators
)(MealsContainer);
