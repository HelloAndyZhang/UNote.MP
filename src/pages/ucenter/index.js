import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import { delayQuerySelectorCtx } from '@/utils/dom';
import SwipeAction from '@/components/swipe-action/index';
import Noticebar from '@/components/noticebar/index';
import './index.scss'

export default class Index extends Component {

  config = {
	navigationBarTitleText: '我的优笔记',
	disableScroll: true
  }                   
  constructor(){
    super()
    this.state ={
		config:[{
			options:[{
				text: '取消',
				style: {
				  backgroundColor: '#6190E8'
				}
			  },{
				  text: '确认',
				  style: {
				  backgroundColor: '#FF4949'
				}
			}],
			isOpened:false,
			title:'AtSwipeAction 一般使用场景'
		},{
			options:[{
				text: '取消',
				style: {
				  backgroundColor: '#6190E8'
				}
			  },{
				  text: '确认',
				  style: {
				  backgroundColor: '#FF4949'
				}
			}],
			isOpened:false,
			title:'AtSwipeAction 一般使用场景'
		},{
			options:[{
				text: '取消',
				style: {
				  backgroundColor: '#6190E8'
				}
			  },{
				  text: '确认',
				  style: {
				  backgroundColor: '#FF4949'
				}
			}],
			isOpened:false,
			title:'AtSwipeAction 一般使用场景'
		},{
			options:[{
				text: '取消',
				style: {
				  backgroundColor: '#6190E8'
				}
			  },{
				  text: '确认',
				  style: {
				  backgroundColor: '#FF4949'
				}
			}],
			isOpened:false,
			title:'AtSwipeAction 一般使用场景'
		},]
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
  handleSingle(index){
	  const config = this.state.config.map((item, key) => {
			item.isOpened = key === index
			return item
	  })
	  this.setState({
		config
	  })
  }
  handleClick = (item, key, e) => {
    console.log('触发了点击', item, key, e)
  }
  componentDidHide () { }
  render () {
	let {config} = this.state;
    return (
      <View className='page-ucenter'>
          我的
      </View>
    )
  }
}
