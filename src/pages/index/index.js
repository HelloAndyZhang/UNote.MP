import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import { delayQuerySelectorCtx } from '@/utils/dom';
import SwipeAction from '@/components/SwipeAction/index';
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '我的优笔记'
  }                   
  constructor(){
    super()
    this.state ={}
	this.config =[{
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
  }
  componentDidHide () { }
  render () {
    return (
      <View className='index'>
		{
			this.config.map((item, index) => (
				<SwipeAction
					key={index}
					onOpened={this.handleSingle.bind(this, index)}
					isOpened={item.isOpened}
					options={item.options}
					className='cell'
				>
					<View className='normal'>{item.title}</View>
				</SwipeAction>
			))
		}
      </View>
    )
  }
}
