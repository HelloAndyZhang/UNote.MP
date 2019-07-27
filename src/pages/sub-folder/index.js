import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText, Input } from '@tarojs/components'
import './index.scss'
import SwipeAction from '@/components/swipe-action/index';
import Modal from '@/components/modal/index';
import Utils from '@/utils/index'
import classNames from 'classnames';
import http from '@/utils/http';
import note_icon from '@/assets/note_icon.png'
import folder from '@/assets/Folder.png';
import nodata from '@/assets/empty-nodata.png'  
export default class SubFolder extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '',
        enablePullDownRefresh:true,
    }
    constructor(props) {
        super(props)
        this.state = {
            config: [],
            isOpened: false,
            noteIndexName: '',
            noteIndex: null,
            keyWords:'',
            modal_index:1, // 1重命名 2.新建文件夹
            modal_name:'重命名',
            noteId:null
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
	componentDidShow() {
        let { id } = this.$router.params;
        this.setState({
            id
        },()=>{
            this.getNoteList()
        })
		
	}
    componentWillMount() {
        this.setState({
			token:Utils.session('token')
		})
    }
    //下拉刷新
    onPullDownRefresh() {
		this.getNoteList()
	}
	//获取文章列表列表
	async getNoteList(){
		let {token ,id} = this.state;
		let config={
			url: '/api/note/dir-note-list',
			headers:{
				Authorization:token
            },
            data:{
                id,
            },
			isLoad:true
		}
		let $res= await http.POST(config);
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
					id:item.id,
					isDir:item.isDir,
					dirId:item.dirId
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
            noteIndexName: config[index].title,
            noteIndex: index,
            noteId:item.id
        })
    }
    //点击单元格时触发
    handleClick = (item, key, e) => {
        console.log('触发了点击', item, key, e)
        let { noteIndex, config } = this.state;
        //重命名
        if (item.index == 1) {
            this.setState({
                isOpened: true,
                modal_index:1,
                modal_name:'重命名',
            })
        }
        if (item.index == 2) {
            Taro.showModal({
                title: '提示',
                content: '删除不可恢复！',
                success: (res) => {
                    if (res.confirm) {
                        config.splice(noteIndex, 1);
                    } else {
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
            isOpened: false
        })
    }
    //重命名弹窗取消事件
    handleModalCancel() {
        this.setState({
            isOpened: false
        })
    }
    //重命名弹窗确定事件
    async handleModalConfirm() {
        let { config, noteIndexName, noteIndex ,modal_index,token,noteId} = this.state;
        if(modal_index == 1){
            //重命名事件
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
                this.setState({
                    isOpened:false,
                    config,
                })
            }
            this.setState({
                isOpened: false,
                config,
            })
        }
        if(modal_index == 2){
            //新建文件夹
			let config={
				url:'/api/note/create',
				data:{
					title:noteIndexName,
					isDir:1,
				},
				isLoad:true,
				headers:{
					Authorization:token
				},
			}
			let $res= await http.POST(config);
			if($res.code == 200){
				Utils.msg('创建成功!');
				this.setState({
					isOpened:false,
					noteIndexName:'',
				},()=>{
					this.getNoteList()
				})
			}
        }
    }
    //修改笔记名字
    handleNoteRename(event) {
        this.setState({
            noteIndexName: event.target.value
        })
    }
    goCreateNote(){
        let {id} = this.state;
        setTimeout(()=>{
            Taro.navigateTo({
                url:`/pages/create-note/index?dirId=${id}`
            })
        },400)
    }
    	//去笔记详情
	goNoteDetail(item){
		Taro.navigateTo({
			url:`/pages/note-detail/index?id=${item.id}`
		})
	}
    componentDidHide() { }
    render() {
        let { config,isOpened ,modal_name} = this.state;
        return (
            <View className='page-sub_folder'>
                {
                    config.map((item, index) => (
                        <SwipeAction
                            index={index}
                            key={index}
                            onOpened={this.handleSingle.bind(this, index,item)}
                            isOpened={item.isOpened}
                            options={item.options}
                            onClick={this.handleClick}
                        >
                            <View className='u-cell-item' onClick={this.goNoteDetail.bind(this.item)}>
                                <View className='u-cell_title'>
                                    {   
										item.isDir == 1 ?
                                        <Image src={folder} className='icon'></Image>
										:        
										<Image src={note_icon} className='icon'></Image>
									}
                                </View>
                                <View className='u-cell_value'>
                                    <View className='title'>{item.title}</View>
                                    <View className='time'>{item.time}</View>
                                </View>
                            </View>
                        </SwipeAction>
                    ))
                    
                }
                {
                    config.length == 0&&
                    <View className='nodata'>
                        <Image src={nodata} className='img'></Image>
                        <View className='text'>文件夹空空如也，立刻去添加文档吧。</View>
                    </View>
                }
                <Modal
                    isOpened={isOpened}
                    title={modal_name}
                    cancelText='取消'
                    confirmText='确认'
                    onClose={this.handleModalClose.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}
                    onConfirm={this.handleModalConfirm.bind(this)}
                    className='index_modal'
                >
                    <View className='modal_content'>
                        <Input className='input' value={noteIndexName} adjustPosition placeholder="请输入文件夹名字"  onInput={this.handleNoteRename.bind(this)} />
                    </View>
                </Modal>
                <View className='open_btn' onClick={this.goCreateNote.bind(this)}>
                    <Text className='iconfont icon-jiahao icon'></Text>
                </View>
            </View>
        )
    }
}
