import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import { delayQuerySelectorCtx } from '@/utils/dom';
import SwipeAction from '@/components/SwipeAction/index';
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '我的优秀笔记'
  }                   
  constructor(){
    super()
    this.state ={
        formats:[],
        nodes: []

    }
    this.editorCtx = null; // 编辑器上下文
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
  onClosed(){
    console.log('onClosed')
  }
  onOpened(){
    console.log('onOpened')
  }
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
              }]} className='cell' onOpened={this.onOpened} onClosed={this.onClosed}>
              <View className='normal'>AtSwipeAction 一般使用场景</View>
             </SwipeAction>



      </View>
    )
  }
}
