import Taro, { Component } from '@tarojs/taro'
import { View, Input, } from '@tarojs/components'
import SwipeAction from '@/components/swipe-action/index';
import Modal from '@/components/modal/index';
import './index.scss'

export default class Index extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '我的优笔记',
        disableScroll: true
    }
    constructor(props) {
        super(props)
        this.state = {
            config: [{
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
                title: '2019年开发排期表'
            }, {
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
                title: '2019年开发排期表'
            }, {
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
                title: '2019年开发排期表'
            }, {
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
                title: '2019年开发排期表'
            }],
            isOpened:false,
            noteIndexName:'',
            noteIndex:null
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
    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }
    componentDidHide(){
        this.setState({
            isOpened:false,            
        })
    }
    handleSingle(index) {
        const config = this.state.config.map((item, key) => {
            item.isOpened = key === index
            return item
        }) 
        this.setState({
            config,
            noteIndexName:config[index].title,
            noteIndex: index, 
        })
    }
    handleClick = (item, key, e) => {
        console.log('触发了点击', item, key, e)
        let {noteIndex,config } = this.state;
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
                success:(res)=>{
                    if(res.confirm){
                        config.splice(noteIndex,1); 
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
    handleModalConfirm() {
        let { config ,noteIndexName,noteIndex} = this.state;
        config[noteIndex].title = noteIndexName;
        config[noteIndex].isOpened = false;
        this.setState({
            isOpened:false,
            config,
        })
    }
    //修改笔记名字
    handleNoteRename(event){
        this.setState({
            noteIndexName:event.target.value
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
                            key={index}
                            onOpened={this.handleSingle.bind(this, index)}
                            isOpened={item.isOpened}
                            options={item.options}
                            onClick={this.handleClick}
                            className='u-cell-item'>
                            <View className='item'>
                                <View className='title'>{item.title}</View>
                                <View className='time'>05-18 17:18</View>
                            </View>
                        </SwipeAction>
                    ))
                }

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
            </View>
        )
    }
}
