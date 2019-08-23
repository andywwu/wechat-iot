import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { Dispatch, AnyAction } from 'redux'

import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/form.scss"
import "taro-ui/dist/style/components/input.scss"
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
  ifShow?: boolean,
  wifi?: string,
  password?: string

}

type PageStateProps = {
  dispatch: Dispatch<AnyAction>,
  process: object
}
type PageDispatchProps = {
}
type PageOwnProps = {

}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ProcessPage {
  props: IProps;
}

@connect(({ process }) => ({
  process
}))
class ProcessPage extends Component {
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
      title: '初始化',
      color: '#000',
      background: '#fff',
      show: true,
      back: true,
      animated: false
    },
    navHeight: 0,
    ifShow: false,
    password: '',
    wifi: '',
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    Taro.getSystemInfo().then((res: any) => {
      if (res.errMsg === "getSystemInfo:ok") {
        const rect = Taro.getMenuButtonBoundingClientRect();
        let gap = rect.top - res.statusBarHeight;
        this.setState({
          navHeight: res.screenHeight - (2 * gap + rect.height + res.statusBarHeight),
        })
      }
    })
    Taro.startWifi().then((res: any) => {
      if (res.errMsg === "startWifi:ok") {
        Taro.getConnectedWifi().then((res: any) => {
          if (res.errMsg === "getConnectedWifi:ok") {
            this.setState({
              wifi: res.wifi.SSID
            })
          }
        }).catch(err => {
          Taro.showToast({
            icon: 'none',
            title: err.errMsg,
            duration: 2000
          })
        })
      }
    }).catch(err => {
      Taro.showToast({
        icon: 'none',
        title: err.errMsg,
        duration: 2000
      })
    })

    // const navHeight = Taro.getMenuButtonBoundingClientRect().bottom;
  }

  startWifi = () => {
    Taro.getSetting().then(res => {
      if (!res.authSetting['scope.userLocation']) {
        Taro.authorize({ scope: 'scope.userLocation' }).then(res => {
          console.log(res)
        }).catch(error => {
          this.setState({
            modalVisible: true,
          })
        })
      } else {
        this.getWifiList()
      }
    })
  }
  getWifiList() {
    Taro.startWifi().then((res: any) => {
      if (res.errMsg === "startWifi:ok") {
        Taro.getWifiList().then((res: any) => {
          console.log(res)
          Taro.onGetWifiList((res: any) => {
            const { wifiList } = res;
            console.log(wifiList)
          })
        })
      }
    })
  }
  onRadioChange = (e) => {
    this.setState({
      checked: e.detail.value === 'device'
    })
  }
  onSubmit = (e) => {
    console.log(e)
  }
  handleChange(value) {
    this.setState({
      password: value,
    })
  }
  componentWillUnmount() { }
  render() {
    const { loading, title, color, background, show, animated, back } = this.state.navbarData
    const { wifi, password } = this.state
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
        <View className="process-content" style={{ height: `${this.state.navHeight}px` }}>
          <View className="top">
            <View className="num-wrap">
              <Text>15</Text>
              <Text>%</Text>
            </View>

            <View className="desc">
              请尽量把手机、设备和路由器靠近
            </View>
          </View>
          <View>
            <AtButton
              className="next-btn"
              onClick={() => Taro.navigateTo({
                url: '/pages/device/connect/index',
              })}
            >
              取消
             </AtButton>
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

export default ProcessPage as ComponentClass<PageOwnProps, PageState>
