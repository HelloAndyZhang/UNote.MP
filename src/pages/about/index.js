import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor } from '@tarojs/components'
import './index.scss'

export default class About extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  //分享
  onShareAppMessage() {
    return {
      title:'我的优笔记',
    }
  }
  componentWillPreload () {
    
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
          关于我们
      </View>
    )
  }
}
