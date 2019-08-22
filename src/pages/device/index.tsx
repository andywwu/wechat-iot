import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { Dispatch, AnyAction } from 'redux'
import { View, Text } from '@tarojs/components'
import "taro-ui/dist/style/components/flex.scss"
import { fetchProductList } from '../../reducers/global'
import './index.less'

type PageState = {
  navbarData: {
    loading?: boolean,
    title?: string,
    color?: string,
    background?: string,
    show?: boolean,
    animated?: boolean,
    back?: boolean,
  },
}

type PageStateProps = {
  dispatch: Dispatch<AnyAction>,
  global: {
    productList: any,
  }
}
type PageDispatchProps = {
  fetchProductList: () => any
}
type PageOwnProps = {

}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface DevicePage {
  props: IProps;
}


@connect(({ global }) => ({
  global
}), (dispatch) => ({
  fetchProductList() {
    dispatch(fetchProductList())
  }
}))
class DevicePage extends Component {
  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    usingComponents: {
      'nav-bar': '../../components/navigation-bar/navigation-bar' // 书写第三方组件的相对路径
    },
  }
  state = {
    navbarData: {
      loading: false,
      title: '选择设备',
      color: '#000',
      background: '#fff',
      show: true,
      back: true,
      animated: false
    },
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    this.props.fetchProductList()
  }
  goFn = (item) => {
    this.props.dispatch({
      type: 'SAVECURRENTKEY',
      payload: item.key,
    })
    Taro.navigateTo({
      url: '/pages/device/add/index',
    })
  }
  componentWillUnmount() { }
  avatarTap = () => {
    console.log('tap')
  }

  render() {
    const { productList } = this.props.global
    const { loading, title, color, background, show, animated, back } = this.state.navbarData
    return (
      <View className='device-wrap'>
        <nav-bar
          loading={loading}
          back={back}
          title={title}
          color={color}
          background={background}
          show={show}
          animated={animated}
        >
        </nav-bar>
        <View className='at-row at-row--wrap'>
          {productList.length > 0 && productList.map(item => (
            <View
              className='at-col at-col-4'
              key={item.key}
              onClick={() => this.goFn(item)}
            >
              <View className="device-item">
                <Text>{item.name}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default DevicePage as ComponentClass<PageOwnProps, PageState>
