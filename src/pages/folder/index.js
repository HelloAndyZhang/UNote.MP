import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'
import SwipeAction from '@/components/swipe-action/index';
import Modal from '@/components/modal/index';
import Utils from '@/utils/index'
import classNames from 'classnames';
import http from '@/utils/http';
import note_icon from '@/assets/note_icon.png'
import folder from '@/assets/Folder.png';
import nodata from '@/assets/empty-nodata.png'
export default class Folder extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '文件夹',
        enablePullDownRefresh:true,
    }
    constructor(props) {
        super(props)
        this.state = {
            config: [],
            isOpened: false,
            noteIndexName: '',
            noteIndex: null,
            isPupShow:false,
            keyWords:'',
            modal_index:1, // 1重命名 2.新建文件夹
            modal_name:'重命名',
			noteId:null,
			serach_list:[],
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
	componentDidShow() {
		this.getFolderList()
	}
    componentWillMount() {
        this.setState({
			token:Utils.session('token')
		})
    }
    //下拉刷新
    onPullDownRefresh() {
		this.getFolderList()
	}
	//获取文件夹列表
	async getFolderList(){
		let {token } = this.state;
		let config={
			url: '/api/note/list',
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
        console.log(index,item)
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
					this.getFolderList()
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
    handleTogglePup(){
        const { isPupShow} =this.state;
        this.setState({
			isPupShow:!isPupShow,
			noteIndexName:''
        })
        !isPupShow ? Taro.hideTabBar():setTimeout(()=>{Taro.showTabBar()},400) ;
    }
    goCreateNote(){
        this.handleTogglePup();
        setTimeout(()=>{
            Taro.navigateTo({
                url:'/pages/create-note/index'
            })
        },400)
    }
    handleSearchKey(event){
        this.setState({
            keyWords:event.target.value
        },()=>{
			this.getSearchFolder()
		})
	}
	async getSearchFolder(){
		let {token,keyWords} = this.state;
		// //新建文件夹
		let config={
			url:'/api/note/search',
			data:{
				query:keyWords
			},
			isLoad:false,
			headers:{
				Authorization:token
			},
		}
		let $res= await http.POST(config);
		if($res.code == 200){
			let list = $res.data;
			let serach_list =[]
			list.map((item,index)=>{
				serach_list.push({
					options: [],
					isOpened: false,
					title:item.title,
					time: Utils.formatTime(item.created_at),
					id:item.id,
					isDir:item.isDir,
					dirId:item.dirId
				})
			})
			this.setState({
				serach_list
			})
		}
	}
    handleClearKeyWords(){
        this.setState({
            keyWords:''
        })
    }
    handleNewFolder(){
        this.setState({
            isOpened:true,
            modal_index:2,
            modal_name:'请输入文件夹名字',
        })
        this.handleTogglePup()
    }

    //去列表或者详情
    goNoteList(item){
        if(item.isDir == 1){
            Taro.navigateTo({
                url:`/pages/sub-folder/index?id=${item.id}`
            })
        }else{
            Taro.navigateTo({
                url:`/pages/note-detail/index?id=${item.id}`
            })
        }
    }
    componentDidHide() { }
    render() {
        let { config,isPupShow,keyWords,isOpened ,modal_name,modal_index,serach_list} = this.state;
        return (
            <View className='page-folder'>
                <View className='header'>
                    <Text className='iconfont icon-sousuo'></Text>
                    <Input className='input' type='text' value={keyWords} placeholder="搜索" onInput={this.handleSearchKey.bind(this)}/>
                    {
                        keyWords.length>0&&
                        <Text className='iconfont icon-guanbi' onClick={this.handleClearKeyWords.bind(this)}></Text>
                    }
                </View>
				<View className='folder_list'>
					{
						config.map((item, index) => (
							<SwipeAction
								index={index}
								key={index}
								onOpened={this.handleSingle.bind(this,index,item)}
								isOpened={item.isOpened}
								options={item.options}
								onClick={this.handleClick}
							>
								<View className='u-cell-item' onClick={this.goNoteList.bind(this,item)}>
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
				</View>
				{
					keyWords.length > 0 &&
					<View className='search_list'>
						{
							serach_list.length == 0?
							<View className='nodata'>
								<Image src={nodata} className='img'></Image>
								<View className='text'>未检索到文章或文件夹</View>
							</View>
							:
							serach_list.map((item, index) => (
								<SwipeAction
									index={index}
									key={index}
									onOpened={this.handleSingle.bind(this,index,item)}
									isOpened={item.isOpened}
									options={item.options}
									onClick={this.handleClick}
								>
									<View className='u-cell-item' onClick={this.goNoteList.bind(this,item)}>
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
					</View>
				}
                {
                    config.length == 0&&
                    <View className='nodata'>
                        <Image src={nodata} className='img'></Image>
                        <View className='text'>文件夹空空如也，立刻去添加文档吧。</View>
                    </View>
                }
                <View className={classNames('float-pup',{'float-pup--active':isPupShow})} >
                    <View className='float-pup__overlay' onClick={this.handleTogglePup.bind(this)}></View>
                    <View className='float-pup__container'>
                        <View className='type-list'>
                            <View className='type_item' onClick={this.handleNewFolder.bind(this)}>
                                <Text className='iconfont icon-wenjianjia1 icon'></Text>
                                <Text className='text'>新建文件夹</Text>
                            </View>
                            <View className='type_item' onClick={this.goCreateNote.bind(this)}>
                                <Text className='iconfont icon-wenjian-wenben icon'></Text>
                                <Text className='text'>新建笔记</Text>
                            </View>
                        </View>
                        <View className='close_box' onClick={this.handleTogglePup.bind(this)}>
                            <Text className='iconfont icon-guanbi1'></Text>
                        </View>
                    </View>
                </View>
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
				{
					keyWords.length == 0 &&
					<View className='open_btn' onClick={this.handleTogglePup.bind(this)}>
						<Text className='iconfont icon-jiahao icon'></Text>
					</View>
				}
            </View>
        )
    }
}
