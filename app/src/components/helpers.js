const helpers = {

  updateComponentState: ({id, type, updatedState, componentState, movables, socket, dispatch, returnValue}) => {
    let updatedComponentState = {...componentState, [type]: updatedState}
    let updatedMovable = {...movables[id], componentState: updatedComponentState};
    let updatedMovables = {...movables, [id]: updatedMovable};
    if (dispatch) {
      socket.emit({
        type: socket.RT.UPDATE_TABLE,
        payload: updatedMovables,
        emitAll: true,
      });
    }
    if (returnValue) {
      return updatedMovables;
    }
  }
};

export default helpers;