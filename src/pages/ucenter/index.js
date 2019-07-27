import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import './index.scss'
import Utils from '@/utils/index'
import http from '@/utils/http';
export default class UCenter extends Component {
  config = {
	navigationBarTitleText: '我的',
	disableScroll: true
  }                   
  constructor(){
    super()
    this.state ={
        token:'',
        qrcode:''
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
  async getShareCode(){
    let {token } = this.state;
    let config={
      url:'/api/user/shareCode',
      headers:{
        Authorization:token
      },
      isLoad:true
   }
   let $res= await http.GET(config);
   console.log($res)
   if($res.code == 200){
       this.setState({
           qrcode:`data:image/png;base64,${$res.data}`
       })
   }
  }
  render () {
    let {qrcode} = this.state;
    return (
      <View className='page-ucenter'>
          我的
          <Image src={qrcode} className='img'></Image>
      </View>
    )
  }
}
