
const initialstate = {
  data: [],
  details: undefined,
};

const allDataReducer = (state = initialstate, action) => {

  switch (action.type) {
    case "STORE_DATA":
      return {
        ...state,
        data: action.payload,
      };



    default:
      return state;
  }
};

export default allDataReducer;
