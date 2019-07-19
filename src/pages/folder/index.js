import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText, Input } from '@tarojs/components'
import './index.scss'
import SwipeAction from '@/components/swipe-action/index';
import Modal from '@/components/modal/index';
import Utils from '@/utils/index'
import classNames from 'classnames';
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
        
        this.init()
    }
    //下拉刷新
    onPullDownRefresh() {
        this.init()
        setTimeout(() => {
            Taro.stopPullDownRefresh();
        }, 600)
    }
    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }
    //初始化生成数据
    init() {
        const num = Math.floor(Math.random() * (25 - 10) + 10);
        let config = []
        for (let i = 0; i < num; i++) {
            config.push({
                options: [{
                    text: '重命名',
                    style: {
                        backgroundColor: '#6190E8'
                    },
                    index: 1
                }, {
                    text: '删除',
                    style: {
                        backgroundColor: '#FF4949'
                    },
                    index: 2
                }],
                isOpened: false,
                title: '2019年开发排期表',
                time: Utils.formatTime(this.getRandomDateBetween())
            })
        }
        this.setState({
            config
        })
    }
    //随机生成时间
    getRandomDateBetween() { // 生成当前时间一个月内的随机时间。
        var date = new Date();
        var e = date.getTime();//当前时间的秒数
        var f = date.getTime() - (30 * 24 * 60 * 60 * 1000); //30天之前的秒数，
        return new Date(this.RandomNumBoth(f, e));
    }
    RandomNumBoth(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }
    //滑动单元格时触发
    handleSingle(index) {
        const config = this.state.config.map((item, key) => {
            item.isOpened = key === index
            return item
        })
        this.setState({
            config,
            noteIndexName: config[index].title,
            noteIndex: index,
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
    handleModalConfirm() {
        let { config, noteIndexName, noteIndex ,modal_index} = this.state;
        if(modal_index == 1){
            config[noteIndex].title = noteIndexName;
            config[noteIndex].isOpened = false;
            this.setState({
                isOpened: false,
                config,
            })
        }
        if(modal_index == 2){
            this.getNewFolder()
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
            isPupShow:!isPupShow
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
        })
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
    getNewFolder(){
        let { config,noteIndexName } = this.state;
        config.unshift({
            options: [{
                text: '重命名',
                style: {
                    backgroundColor: '#6190E8'
                },
                index: 1
            }, {
                text: '删除',
                style: {
                    backgroundColor: '#FF4949'
                },
                index: 2
            }],
            isOpened: false,
            title:noteIndexName,
            time: Utils.formatTime(new Date())
        })
        this.setState({
            config,
            isOpened:false,
            noteIndexName:'',
        })
    }
    getDateDiff(setdateTimeStamp) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var dateTimeStamp = new Date(setdateTimeStamp);
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            //若日期不符则弹出窗口告之
            return "结束日期不能小于开始日期！";
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        let result
        if (monthC >= 1) {
            result = "发表于" + parseInt(monthC) + "个月前";
        }
        else if (weekC >= 1) {
            result = "发表于" + parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
            result = "发表于" + parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = "发表于" + parseInt(hourC) + "个小时前";
        }
        else if (minC >= 1) {
            result = "发表于" + parseInt(minC) + "分钟前";
        } else
            result = "刚刚发表";
        return result;
    }
    componentDidHide() { }
    render() {
        let { config,isPupShow,keyWords,isOpened ,modal_name,modal_index} = this.state;
        return (
            <View className='page-folder'>
                <View className='header'>
                    <Text className='iconfont icon-sousuo'></Text>
                    <Input className='input' value={keyWords} placeholder="搜索" onInput={this.handleSearchKey.bind(this)}></Input>
                    {
                        keyWords.length>0&&
                        <Text className='iconfont icon-guanbi' onClick={this.handleClearKeyWords.bind(this)}></Text>
                    }
                </View>
                {
                    config.map((item, index) => (
                        <SwipeAction
                            key={index}
                            onOpened={this.handleSingle.bind(this, index)}
                            isOpened={item.isOpened}
                            options={item.options}
                            onClick={this.handleClick}
                        >
                            <View className='u-cell-item'>
                                <View className='u-cell_title'>
                                    <Text className='iconfont icon-wenjianjia1'></Text>
                                </View>
                                <View className='u-cell_value'>
                                    <View className='title'>{item.title}</View>
                                    <View className='time'>{this.getDateDiff(item.time)}</View>
                                </View>
                            </View>
                        </SwipeAction>
                    ))
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
                <View className='open_btn' onClick={this.handleTogglePup.bind(this)}>
                    <Text className='iconfont icon-jiahao icon'></Text>
                </View>
            </View>
        )
    }
}
