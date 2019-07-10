import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor } from '@tarojs/components'
import './index.scss'
import SwipeAction from '@/components/SwipeAction/index';
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
		<SwipeAction options={[{
				text: '取消',
				style: {
				backgroundColor: '#6190E8'
			}
			},{
				text: '确认',
				style: {
				backgroundColor: '#FF4949'
				}
			}]}>
			<View className='normal'>AtSwipeAction 一般使用场景</View>
		</SwipeAction>
      </View>
    )
  }
}
