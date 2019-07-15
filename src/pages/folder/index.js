import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import './index.scss'

export default class Folder extends Component {

  config = {
	navigationBarTitleText: '文件夹',
	disableScroll: true
  }                   
  constructor(){
    super()
    this.state ={}
  }
  //分享
  onShareAppMessage() {
    return {
      title:'文件夹',
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
      <View className='page-folder'>
          文件夹
      </View>
    )
  }
}
