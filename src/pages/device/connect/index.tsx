import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Form, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { Dispatch, AnyAction } from 'redux'
import CONNECTPIC from '../../../assets/connect.png'
import { AtInput, AtButton } from 'taro-ui'

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
  process: {
    wifiInfo: object
  }
}
type PageDispatchProps = {

}
type PageOwnProps = {

}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ConnectPage {
  props: IProps;
}

@connect(({ process }) => ({
  process
}))
class ConnectPage extends Component {
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
        <View className="connect-content" style={{ height: `${this.state.navHeight}px` }}>
          <View className="top">
            <Image src={CONNECTPIC} />
            <View className="tips">
              <Text>选择设备将要链接Wi-Fi网络（不支持5G Wi-Fi)，输入对应的密码，点击下一步。</Text>
            </View>
            <View className="form-wrap">
              <View className="inputWrap">
                <AtInput
                  name='value'
                  type='text'
                  value={wifi || '请打开定位服务'}
                  editable={false}
                  onChange={(e) => console.log(e)}
                >
                </AtInput>
                <Text
                  className="at-icon at-icon-chevron-right"
                  onClick={this.startWifi.bind(this)}
                ></Text>
              </View>
              <AtInput
                name='value'
                type={this.state.ifShow ? 'text' : 'password'}
                placeholder='Wi-Fi密码'
                onChange={this.handleChange.bind(this)}
              >
                <Text
                  className="at-icon at-icon-eye"
                  onClick={() => this.setState({
                    ifShow: !this.state.ifShow
                  })}
                >
                </Text>
              </AtInput>
              <Text className="desc">Wi-Fi名称和密码只会传输到设备端用于设备入网，为方便下次配
置，入网完成后APP将在本地保存Wi-Fi名称和密码，不会上传到服务器。</Text>
            </View>
          </View>
          <View>
            <AtButton
              className="next-btn"
              disabled={!wifi || !password}
              onClick={() => {
                this.props.dispatch({
                  type: 'SAVEWIFIINFO',
                  payload: {
                    wifi: this.state.wifi,
                    password: this.state.password,
                  },
                })
                Taro.navigateTo({
                  url: '/pages/device/connect/process',
                })
              }}
            >
              下一步
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

export default ConnectPage as ComponentClass<PageOwnProps, PageState>
