import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { Dispatch, AnyAction } from 'redux'
import { AtList, AtListItem } from "taro-ui"
import { View, Button, Text, Image } from '@tarojs/components'

import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
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
    userInfo: any,
  }
}
type PageDispatchProps = {
}
type PageOwnProps = {

}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyPage {
  props: IProps;
}


@connect(({ global }) => ({
  global
}))
class MyPage extends Component {
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
      title: '我的',
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
  componentDidMount() {
    Taro.getSetting().then(res => {
      if (!res.authSetting['scope.userInfo']) {
        Taro.authorize({ scope: 'scope.userInfo' }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
      } else {
        Taro.getUserInfo().then(res => {
          this.props.dispatch({
            type: 'SAVEUSERINFO',
            payload: res.userInfo,
          })
        })
      }
    })
  }
  componentWillUnmount() { }
  onGotUserInfo = (e) => {
    if (e.currentTarget.errMsg === "getUserInfo:ok") {
      this.props.dispatch({
        type: 'SAVEUSERINFO',
        payload: e.currentTarget.userInfo,
      })
    }
  }
  avatarTap = () => {
    console.log('tap')
  }

  render() {
    const { userInfo } = this.props.global
    const { loading, title, color, background, show, animated, back } = this.state.navbarData
    return (
      <View className='index'>
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
        <View className="header">
          <View className='userInfo'>
            {userInfo ? (
              <Image src={userInfo.avatarUrl} class='userinfo-avatar' mode='cover' onClick={this.avatarTap} />
            ) : (
                <Button className='avatar-btn' openType='getUserInfo' lang='zh_CN' onGetUserInfo={this.onGotUserInfo} ></Button>
              )
            }
          </View>
          <Text className="username">
            {userInfo.nickName || '未登录'}
          </Text>
        </View>
        <View className="content">
          <AtList>
            <AtListItem title='设备问题反馈' arrow='right' iconInfo={{
              size:
                25, color: '#385392', value: 'message',
            }} />
            <AtListItem title='关于我们' arrow='right' iconInfo={{
              size: 25,
              color: '#385392', value: 'alert-circle',
            }} />
            <AtListItem title='语言' arrow='right' iconInfo={{
              size: 25,
              color: '#385392', value: 'bookmark',
            }} />
          </AtList>
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

export default MyPage as ComponentClass<PageOwnProps, PageState>
