import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

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
}
type PageDispatchProps = {
}
type PageOwnProps = {

}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface HelpPage {
  props: IProps;
}


class HelpPage extends Component {
  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    usingComponents: {
      'nav-bar': '../../../components/navigation-bar/navigation-bar' // 书写第三方组件的相对路径
    },
  }
  state = {
    navbarData: {
      loading: false,
      title: '帮助',
      color: '#000',
      background: '#fff',
      show: true,
      back: true,
      animated: false
    },
    navHeight: 0,
    checked: false,
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    console.log(this.props)
    Taro.getSystemInfo().then((res: any) => {
      if (res.errMsg === "getSystemInfo:ok") {
        const rect = Taro.getMenuButtonBoundingClientRect();
        let gap = rect.top - res.statusBarHeight;
        this.setState({
          navHeight: res.screenHeight - (2 * gap + rect.height + res.statusBarHeight),
        })
      }
    })
    // const navHeight = Taro.getMenuButtonBoundingClientRect().bottom;
  }
  onRadioChange = (e) => {
    this.setState({
      checked: e.detail.value === 'device'
    })
  }
  componentWillUnmount() { }
  render() {
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
        <View className="help-content">
          <View className="help-title">
            设备进入配网模式步骤：
          </View>
          <View className="help-desc">
            确保设备通电后长按电源键5秒，当WiFi提示灯快速闪动点击下一步。
          </View>
          <View className="help-desc">
            长按电源键5秒，WiFi提示灯快速闪动重新配置网络。
          </View>
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

export default HelpPage as ComponentClass<PageOwnProps, PageState>
