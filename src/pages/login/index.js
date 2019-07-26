import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, RichText } from '@tarojs/components'
import './index.scss'
import logo from '@/assets/logo.png'
export default class Index extends Component {

  config = {
    navigationBarTitleText: '登录',
    disableScroll: true
  }
  constructor() {
    super()
    this.state = {}
  }
  //分享
  onShareAppMessage() {
    return {
      title: '我的优笔记',
    }
  }
  componentWillPreload() {

  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }
  componentDidHide() { }
  render() {
    return (
      <View className='page-ucenter'>
        <View class="page-login">
          <Navigator target="miniProgram" open-type="exit">返回</Navigator>
          <View class="logo">
            <Image src={logo} class="img"></Image>
          </View>
          <View class="title">优秀是一种习惯</View>
          <View class="box">
            <View class="phone line-bottom">
              <Input type='number' placeholder='请输入手机号码' placeholderStyle="placeholder" maxLength='11' />
            </View>
            <View class="phone line-bottom">
              <Input type='password' placeholder='请输入密码' placeholderStyle="placeholder" maxLength='11' />
            </View>
            <Button class="btn">登录</Button>

          </View>



        </View>
      </View>
    )
  }
}
