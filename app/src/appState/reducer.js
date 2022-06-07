


function reducer(state, action) {
  let newState;
  const { type, payload } = action
  const toLog = state.dev.logs && state.dev.reducer;
  switch (type) {
    case 'UPDATE_ROOM':
      newState = { ...state };
      newState.room = payload;
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   PROD_INIT   prodId: ', newState.currentProduct);
      }
      return newState;

    case 'UPDATE_HOME':
      newState = { ...state };
      newState.home = payload;

      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   PROD_INIT   prodId: ', newState.currentProduct);
      }
      return newState;

    case 'UPDATE_USER':
      newState = { ...state };
      newState.user = payload ? payload : { name: null, rooms: [], theme: newState.user.theme };
      if (toLog) {
        console.log('\n\nDEV  STATE-REDUCER   PROD_INIT   prodId: ', newState.currentProduct);
      }
      return newState;

    default:
      console.log('\n\nDEV  STATE-REDUCER   default    prodId: ', state.currentProduct);
      return { ...state };
  }
}

export default reducer;
