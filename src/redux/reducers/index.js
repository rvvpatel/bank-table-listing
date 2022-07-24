import { combineReducers } from "redux";
import allDataReducer from "./allDataReducers";

export default combineReducers({
  all: allDataReducer,
});
