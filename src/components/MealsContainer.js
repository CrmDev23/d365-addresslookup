import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMeals, fetchPlzs, fetchStrs } from "../redux/actions";
import MealShowcase from "./MealShowcase";
import PlzPickerSelect from "./PlzPickerSelect";
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
    const { fetchMeals, fetchPlzs, fetchStrs, selectedPlz } = this.props;

    fetchMeals()
      .then(() => {
        fetchPlzs();
      })
      .then(() => {
        fetchStrs(selectedPlz);
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedPlz !== this.props.selectedPlz) {
      const { fetchPlzs, fetchStrs, selectedPlz } = this.props;
      fetchPlzs().then(() => {
        fetchStrs(selectedPlz);
      });
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

const actionCreators = { fetchMeals, fetchPlzs, fetchStrs };

export default connect(
  mapStateToProps,
  actionCreators
)(MealsContainer);
