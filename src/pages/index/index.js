import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button, } from '@tarojs/components'
import SwipeAction from '@/components/swipe-action/index';
import Modal from '@/components/modal/index';
import './index.scss'
import Utils from '@/utils/index'
import http from '@/utils/http';
export default class Index extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '我的优笔记',
        enablePullDownRefresh:true,
    }
    constructor(props) {
        super(props)
        this.state = {
            config: [],
            isOpened:false,
            noteIndexName:'',
            noteIndex:null,
			token:'',
			noteId:null,
        }
        this.editorCtx = null; // 编辑器上下文
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
        this.setState({
          token:Utils.session('token')
        })
    }
    componentDidShow(){
      this.getNoteList()
    }
    //获取笔记列表
    async getNoteList(){
		let {token } = this.state;
		let config={
			url: '/api/note/note-list',
			headers:{
				Authorization:token
			},
			isLoad:true
		}
		let $res= await http.GET(config);
		if( $res.code == 200){
			let list = $res.data.rows;
			let config =[]
			list.map((item,index)=>{
				config.push({
					options: [{
						text: '重命名',
						style: {
							backgroundColor: '#6190E8'
						},
						index:1
					}, {
						text: '删除',
						style: {
							backgroundColor: '#FF4949'
						},
						index:2
					}],
					isOpened: false,
					title:item.title,
					time: Utils.formatTime(item.created_at),
					id:item.id
				})
			})
			this.setState({
				config
			})
		}else{
			Utils.msg($res.msg)
		}
		setTimeout(()=>{
            Taro.stopPullDownRefresh();
        },300)
    }
    //获取文件夹列表
    async getNotesList(){
      let {token } = this.state;
      let config={
        url:'/api/note/list',
        params:{
          page:1,
          limit:10
        },
        headers:{
          token
        },
        isLoad:true
     }
     let $res= await http.GET(config);
    }
    async getUpdataUserInfo(data){
      let { token } = this.state;
      let config={
        url: '/api/user/syncUserInfo',
        data,
        isLoad:true,
        headers:{
          Authorization:token,
        }
     }
     let $res= await http.POST(config);
     if($res){
       console.log($res)
     }
    }
    async getUserInfo(){
      let { token } = this.state;
      let config={
        url: '/api/user/getUserInfo',
        data:{},
        headers:{
          Authorization:token,
        },
        isLoad:true
     }
     let $res= await http.GET(config);
     console.log($res)

    }
    async getCreateNote(){
		let { token } = this.state;
		let config={
			url: '/api/note/create',
			data:{
				title:'Anydzhang',
				content:'HI',
				isDir:0, //是否是目录
				dirId:20, //目录ID
			},
			isLoad:true,
			headers:{
				Authorization:token,
			}
		}
		let $res= await http.POST(config);
		if($res){
			console.log($res)

		}

    }
    //下拉刷新
    onPullDownRefresh(){
        this.getNoteList();
    }
    componentDidMount() { }

    componentWillUnmount() { }
    //滑动单元格时触发
    handleSingle(index,item) {
        const config = this.state.config.map((item, key) => {
            item.isOpened = key === index
            return item
		})
        this.setState({
            config,
            noteIndexName:config[index].title,
			noteIndex:index,
			noteId:item.id
        })
	}
    //点击单元格时触发
    handleClick = (item, key, e) => {
        console.log('触发了点击', item, key, e)
        let {noteIndex,config,noteId,token } = this.state;
        //重命名
        if(item.index == 1){
            this.setState({
                isOpened:true,
            })
        }
        if(item.index == 2){
            Taro.showModal({
                title:'提示',
                content:'删除不可恢复！',
                success:async (res)=>{
                    if(res.confirm){
						let config={
							url: '/api/note/delete',
							data:{
								id:noteId
							},
							isLoad:true,
							headers:{
								Authorization:token,
							}
						}
						let $res= await http.POST(config);
						if($res.code == 200){
							Utils.msg('删除成功')
							config.splice(noteIndex,1);
						}
                    }else{
                        config[noteIndex].isOpened = false;
                    }
                    this.setState({
                        config
                    })
                }
            })
        }
	}
    //重命名弹窗关闭事件
    handleModalClose() {
        this.setState({
            isOpened:false
        })
    }
    //重命名弹窗取消事件
    handleModalCancel() {
        this.setState({
            isOpened:false
        })
    }
    //重命名弹窗确定事件
    async handleModalConfirm() {
        let { config ,noteIndexName,noteIndex,token,noteId} = this.state;
		config[noteIndex].title = noteIndexName;
		config[noteIndex].isOpened = false;
		let query={
			url: '/api/note/update',
			data:{
				title:noteIndexName,
				id:noteId,
			},
			isLoad:true,
			headers:{
				Authorization:token,
			}
		}
		let $res= await http.POST(query);
		if($res.code == 200){
			console.log($res)
			this.setState({
				isOpened:false,
				config,
			})
		}

    }
    //修改笔记名字
    handleNoteRename(event){
        this.setState({
            noteIndexName:event.target.value
        })
    }
    //去创建文章
    goCreateNote(){
        Taro.navigateTo({
            url:'/pages/create-note/index?isDir=0'
        })
	}
	//去笔记详情
	goNoteDetail(item){
		Taro.navigateTo({
			url:`/pages/note-detail/index?id=${item.id}`
		})
	}


    componentDidHide() { }
    render() {
        let { config,isOpened } = this.state;
        return (
            <View className='index'>
                {
                    config.map((item, index) => (
                        <SwipeAction
                            index={index}
                            key={index}
                            onOpened={this.handleSingle.bind(this, index,item)}
                            isOpened={item.isOpened}
                            options={item.options}
                            onClick={this.handleClick}
                            className='u-cell-item'>
                            <View className='item' onClick={this.goNoteDetail.bind(this,item)}>
                                <View className='title'>{item.title}</View>
                                <View className='time'>{item.time}</View>
                            </View>
                        </SwipeAction>
                    ))
                }
                <View className='no_more'>
                    <Text>没有更多了</Text>
                </View>
                <Modal
                    isOpened={isOpened}
                    title='重命名'
                    cancelText='取消'
                    confirmText='确认'
                    onClose={this.handleModalClose.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}
                    onConfirm={this.handleModalConfirm.bind(this)}
                    className='index_modal'
                >
                    <View className='modal_content'>
                        <Input className='input' value={noteIndexName} onInput={this.handleNoteRename.bind(this)} />
                    </View>
                </Modal>

                <View className='open_btn' onClick={this.goCreateNote.bind(this)}>
                    <Text className='iconfont icon-jiahao icon'></Text>
                </View>
            </View>
        )
    }
}
