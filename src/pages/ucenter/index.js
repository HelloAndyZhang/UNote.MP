import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import './index.scss'

export default class UCenter extends Component {
  config = {
	navigationBarTitleText: '我的',
	disableScroll: true
  }                   
  constructor(){
    super()
    this.state ={
        token:''
    }
  }
  //分享
  onShareAppMessage() {
    return {
      title:'我的优笔记',
    }
  }
  componentWillPreload () {
    
  }
  componentWillMount () { 
    this.setState({
        token:Utils.session('token')
      })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
      this.getShareCode()
   }

  componentDidHide () { }
  getShareCode(){
    let {token } = this.state;
    let config={
      url:'/api/user/shareCode',
      headers:{
        token
      },
      isLoad:true
   }
   let $res= await http.GET(config);
   console.log($res)
  }
  render () {
    return (
      <View className='page-ucenter'>
          我的
      </View>
    )
  }
}
