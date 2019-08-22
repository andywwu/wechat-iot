import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { Dispatch, AnyAction } from 'redux'
import { AtButton } from 'taro-ui'
import { View, Text, Image, Button, Radio, RadioGroup } from '@tarojs/components'

import BGPIC from '../../../assets/add-device.jpg'
import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/icon.scss"
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
  checked: boolean,
  navHeight: number,
}

type PageStateProps = {
  dispatch: Dispatch<AnyAction>,
  global: {
    userInfo: any,
  }
}
type PageDispatchProps = {
}
type PageOwnProps = {

}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface AddDevicePage {
  props: IProps;
}


@connect(({ global }) => ({
  global
}))
class AddDevicePage extends Component {
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
      title: '添加设备',
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
    const { userInfo } = this.props.global
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
        <View className="device-content" style={{ height: `${this.state.navHeight}px` }}>
          <Image src={BGPIC} />
          <View className="desc-wrap">
            <View className="info">
              <Text>
                确保设备通电后长按电源键5秒，当WiFi提示灯快速闪动点击下一步。
              </Text>
              <View className="help" onClick={() => {
                Taro.navigateTo({
                  url: '/pages/device/add/help',
                })
              }}>
                <Text
                  className="at-icon at-icon-help"
                  style={{ marginRight: '16rpx' }}
                />
                帮助
              </View>
            </View>
            <View className="btn-wrap">
              <RadioGroup onChange={(e) => this.onRadioChange(e)}>
                <Radio
                  className='radio-list__radio'
                  color="#0057B8"
                  checked={this.state.checked}
                  value="device"
                >
                  设备已通电
                </Radio>
              </RadioGroup>
              <AtButton
                className="next-btn"
                disabled={!this.state.checked}
                onClick={() => Taro.navigateTo({
                  url: '/pages/device/connect/index',
                })}
              >
                下一步
              </AtButton>
            </View>
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

export default AddDevicePage as ComponentClass<PageOwnProps, PageState>
