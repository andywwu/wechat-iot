import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtModal, AtModalContent } from 'taro-ui'
import { connect } from '@tarojs/redux'
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/modal.scss";
import './index.less'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  global: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {
  navbarData: {
    loading?: boolean,
    title?: string,
    color?: string,
    background?: string,
    show?: boolean,
    animated?: boolean
  },
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ global }) => ({
  global
}))
class Index extends Component {
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
    modalVisible: false,
    navbarData: {
      loading: false,
      title: '我的设备',
      color: '#000',
      background: '#fff',
      show: true,
      back: false,
      animated: false
    },
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  addDevice = () => {
    console.log('add')
  }
  onGetScanCode = () => {
    Taro.scanCode().then((res: any) => {
      if (res.errMsg === "scanCode:ok") {
        Taro.showToast({
          title: '扫码成功',
          icon: 'success',
          duration: 2000
        })
        // Taro.navigateTo({
        //   url: '/pages/device/connect/index',
        // })
      }
    })
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { modalVisible } = this.state
    const { loading, color, background, show, animated, back } = this.state.navbarData
    return (
      <View>
        <nav-bar
          loading={loading}
          back={back}
          color={color}
          background={background}
          show={show}
          animated={animated}
        >
          <view slot="left">我的设备</view>
        </nav-bar>
        <View className='index'>

          <View className="add-device">
            <AtButton
              type='primary'
              className="btn"
              onClick={() => this.setState({ modalVisible: true })}
            >
              <AtIcon value='add-circle' size='20' color='#0057B8'></AtIcon>
              <Text className="btn-title">添加设备</Text>
            </AtButton>
          </View>
        </View>
        <AtModal isOpened={modalVisible}>
          <AtModalContent>
            <View onClick={() => this.onGetScanCode()}>
              <Text className='at-icon at-icon-camera'></Text>
              <Text>
                扫描二维码
              </Text>
            </View>
            <View onClick={() => {
              Taro.navigateTo({
                url: '/pages/device/index',
              })
              this.setState({ modalVisible: false })
            }}>
              <Text className='at-icon at-icon-add-circle'></Text>
              <Text>
                手动添加
              </Text>
            </View>
          </AtModalContent>
        </AtModal>
      </View >
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
