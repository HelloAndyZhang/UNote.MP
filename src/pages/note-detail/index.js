import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames';
import Utils from '@/utils/index'
import http from '@/utils/http';
export default class Note extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '文件夹',
        enablePullDownRefresh: false,
    }
    constructor(props) {
        super(props)
        this.state = {
            nodes:[],
			title:'hi',
			token:'',
			id:''
        }
    }
    //分享
    onShareAppMessage() {
        return {
            title: '我的优笔记',
        }
    }
    componentWillPreload() {

    }
    componentWillMount() {

    }
    handleClickRichText(){

    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() {
		let token = Utils.session('token');
		let { id} = this.$router.params
		this.setState({
			token,
			id
		},()=>{
			this.getNoteDetail()
		})
	}
	//获取订单详情
	async getNoteDetail(){
		let {token,id } = this.state;
		let config={
			url: '/api/note/getInfo',
			data:{
				id,
			},
			headers:{
				Authorization:token
			},
			isLoad:true
		}
		let $res= await http.POST(config);
		if( $res.code == 200){
			this.setState({
				title:$res.data.title,
				nodes:$res.data.content
			})
		}else{
			Utils.msg($res.msg)
		}
	}

    componentDidHide() { }
    render() {
        const {nodes,title } = this.state;
        return (
            <View className='page-detail'>
                <View className='title'>
                    {title}
                </View>
                <RichText nodes={nodes} onClick={this.handleClickRichText.bind(this)} className="editor"></RichText>
            </View>
        )
    }
}
