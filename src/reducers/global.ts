
const INITIAL_STATE = {
  userInfo: null,
  productList: [],
}

export default function global(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVEUSERINFO':
      return {
        ...state,
        userInfo: { ...action.payload },
      }
    case 'GETPRODUCTLIST':
      return {
        ...state,
        productList: action.payload,
      }
    case 'SAVECURRENTKEY':
      return {
        ...state,
        currentKey: action.payload,
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