
const INITIAL_STATE = {
  wifiInfo: {},
}

export default function wifi(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVEWIFIINFO':
      return {
        ...state,
        wifiInfo: { ...action.payload },
      }
    default:
      return state
  }
}

// 异步的action
export function fetchProductList() {
  return dispatch => {
    setTimeout(() => {
      dispatch({
        type: 'GETPRODUCTLIST',
        payload: [{
          key: 'acc',
          name: 'FLOWCLEAR',
        }, {
          key: 'abb',
          name: 'SLEEP\nCONTROL',
        }, {
          key: 'add',
          name: 'SPA\nCONTROL',
        }, {
          key: 'aee',
          name: 'SPA\nCONTROL',
        }]
      })
    }, 1000)
  }
}