import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText } from '@tarojs/components'
import './index.scss'
import auth_bn from '@/assets/auth.jpg';
import shareBg from '@/assets/share_bg_one.jpg'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '我的',
    disableScroll: true,
    // navigationStyle:'custom'
  }
  constructor() {
    super()
    this.state = {}
  }
	//分享
	onShareAppMessage() {
		return {
			title:'记录 成为更好的自己',
			path:'pages/login/index',
			imageUrl:shareBg
		}
	}
  componentWillPreload() {

  }
  componentWillMount() {

  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='page-auth'>
        <Image src={auth_bn} className='bg'></Image>

        <View className='name'>HI,Boy </View>
        <View className='tips'>您不符合使用条件袄</View>
      </View>
    )
  }
}
