import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText, Button } from '@tarojs/components'
import './index.scss'
import Utils from '@/utils/index'
import http from '@/utils/http';
import refresh_btn from '@/assets/refresh.png';
import save_btn from '@/assets/saveImg.png'
import detailIcon from '@/assets/detail_arrow.png'
import classNames from 'classnames';
import QQMapWX from '@/utils/qqmap-wx-jssdk.js';
export default class UCenter extends Component {
    config = {
        navigationBarTitleText: '我的',
        disableScroll: true
    }
    constructor() {
        super()
        this.state = {
            token: '',
            qrcode: '',
            user_info:{
				nickName:''
			},
            share_img:false
        }
    }
    //分享
    onShareAppMessage() {
        return {
			title: '我的优笔记',
			desc:'',
			path:'pages/login/index',
			imageUrl:''
        }
    }
    componentWillPreload() {

    }
    componentWillMount() {
        this.setState({
            token: Utils.session('token')
        })
    }

   async componentDidMount() {
		let $res = await Taro.getLocation({
			type: "wgs84", //	否	wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		})
		this.getLocation($res.latitude, $res.longitude);
	}

    componentWillUnmount() { }

    componentDidShow() {
		this.getUserInfo()
		this.getShareCode();
	}
	getLocation(lat, lng) {
		let {token} = this.state;
		const _this = this;
		let qqmapsdk = new QQMapWX({
			key: 'NKSBZ-7F6R4-DYRUM-DFVXT-3EF2T-LMFPR'
		});
		qqmapsdk.reverseGeocoder({
			//位置坐标，默认获取当前位置，非必须参数
			location: `${lat},${lng}`, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
			get_poi: 0, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
			success: async (res) =>{//成功后的回调
				if(res.message =="query ok" ){
					let config={
						url: '/api/user/syncUserInfo',
						headers:{
							Authorization:token
						},
						data:{
							country: res.result.address_component.district,
							province: res.result.address_component.province,
							city: res.result.address_component.city,
						},
						isLoad:true
					}
					let $$res= await http.POST(config);
					if($$res.code == 200){
						this.getUserInfo()
					}else{
						Utils.msg($$res.msg)
					}

				}
			},
			fail(error) {
				console.error(error);
			},
			complete(res) {
				console.log(res);
			}
		})
	}
    async handleUserInfo(event) {
        let $res = await Taro.getUserInfo();
		let {token} = this.state;
		let config={
			url: '/api/user/syncUserInfo',
			headers:{
				Authorization:token
            },
            data:$res.userInfo,
			isLoad:true
		}
		let $$res= await http.POST(config);
		if($$res.code == 200){
			this.getUserInfo()
		}else{
			Utils.msg($$res.msg)
		}
    }
    async getUserInfo(){
        let {token} = this.state;
		let config={
			url: '/api/user/getUserInfo',
			headers:{
				Authorization:token
            },
			isLoad:true
		}
		let $res= await http.GET(config);
		if( $res.code == 200){
            this.setState({
                user_info:$res.data
            })
		}else{
			Utils.msg($res.msg)
		}

    }
    componentDidHide() { }
    async getShareCode() {
        let { token } = this.state;
        let config = {
            url: '/api/user/shareCode',
            headers: {
                Authorization: token
            },
            isLoad: true
        }
        let $res = await http.GET(config);
        if ($res.code == 200) {
            const filePath = `${wx.env.USER_DATA_PATH}/temp_image.jpeg`;
            /// 将base64转为二进制数据
            const buffer = wx.base64ToArrayBuffer(`${$res.data}`);
            /// 绘制成图片
            wx.getFileSystemManager().writeFile({
                filePath,
                data: buffer,
                encoding: 'binary',
                success:() =>{
                    this.setState({
                        qrcode:filePath
                    })
                },
                fail() {}
            });

        }
    }
    /* 绘制canvas */
    handleCreateShareImg(){
        Utils.showLoading()
		this.drawCanvas()

    }
    async drawCanvas() {
        let {qrcode,user_info} = this.state;
        let  shareBg = await Utils.downLoadImg('https://otherfiles-ali.uupt.com/Stunner/FE/SecKill/shop-share-save-edit1.png');
        let avatarBg = await Utils.downLoadImg(user_info.avatarUrl);
        let $res = await Taro.getSystemInfoSync();
        let pixelRatio = $res.pixelRatio;
        let windowWidth = $res.windowWidth;
        let windowHeight = $res.windowHeight;
        // 屏幕系数比，以设计稿375*667（iphone7）为例
        let XS = windowWidth / 375;
        const ctx = Taro.createCanvasContext('Canvas');
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, 339 * XS, 522 * XS)
        /* 背景图 */
        ctx.drawImage(shareBg.data, 0 * XS, 0 * XS, 278 * XS, 440 * XS)
        /* 店铺logo */
        ctx.save()
        ctx.beginPath()
        ctx.arc((108 + 60 / 2) * XS, (85 + 60 / 2) * XS, (60 / 2) * XS, 0, 2 * Math.PI)
        ctx.clip()
        avatarBg.data&& ctx.drawImage(avatarBg.data, 108 * XS, 85 * XS, 60 * XS, 60 * XS);
        ctx.restore()
        //店铺名字
        ctx.setFontSize(15 * XS);
        ctx.setFillStyle('#202f4b')
        ctx.setTextAlign('center');
        this.fontLineFeed(ctx, user_info.nickName, 16, 18 * XS, 138 * XS, 172 * XS)
        /* 二维码 */
        qrcode&&ctx.drawImage(qrcode, 42 * XS, 264 * XS, 72 * XS, 72 * XS)
        ctx.draw();
        Utils.hideLoading()
        this.setState({
            share_img:true,
        })
    }
    handleShareClose() {
        Utils.hideLoading()
        this.setState({
            share_img:false,
        })
    }
    // 文字换行
    /**
     * ctx,画布对象
     * str,需要绘制的文字
     * splitLen,切割的长度字符串
     * strHeight,每行文字之间的高度
     * x,位置
     * y
     */
    fontLineFeed(ctx, str, splitLen, strHeight, x, y) {
        let strArr = [];
        for (let i = 0, len = str.length / splitLen; i < len; i++) {
            strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
        }
        if (str.length > splitLen) {
            strArr[0] = strArr[0] + '...';
        }
        ctx.fillText(strArr[0], x, y);
    }
    /* 保存图片 */
    handleSaveImg() {
        wx.canvasToTempFilePath({
            canvasId: 'Canvas',
            success: res => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: res => {
                        Utils.msg('图片保存成功','success')
                    },
                    fail: err => {
                    }
                })
            }
        })
    }
    //刷新太阳码
    handleRefreshImg() {
        Utils.showLoading('重新生成中');
        this.drawCanvas()
    }
    render() {
        let {share_img,user_info } = this.state;
        return (
            <View className='page-ucenter'>
                <View className="m-profile">
                    <View className='avatar'>
						{ user_info.avatarUrl?
							<Image src={user_info.avatarUrl} className='img'></Image>
							:
							<Button open-type='getUserInfo'  ongetuserinfo={this.handleUserInfo.bind(this)} className='open_btn' >点</Button>
						}

                    </View>
                    <View className='user-info-list'>
                        <View className='nickname'>{user_info.nickName}</View>
                        <View className='cityname'>{user_info.country}</View>
                    </View>
                </View>
				{
					user_info.nickName&&
					<View className='m-info'>
						<View className="u-cell line-bottom">
							<View className="u-cell_title">
								昵称:
							</View>
							<View className="u-cell_value" >
								<View className='text'>{user_info.nickName}</View>
							</View>
							<View className="u-cell_arrow">
								<Image  className='img' src={detailIcon}/>
							</View>
						</View>
						<View className="u-cell line-bottom">
							<View className="u-cell_title">
								性别:
							</View>
							<View className="u-cell_value" >
								<View className='text'>{user_info.gender== 1?'男':'女'}</View>
							</View>
							<View className="u-cell_arrow">
								<Image  className='img' src={detailIcon}/>
							</View>
						</View>
						<View className="u-cell line-bottom">
							<View className="u-cell_title">
								手机:
							</View>
							<View className="u-cell_value" >
								<View className='text'>{user_info.mobile}</View>
							</View>
							<View className="u-cell_arrow">
								<Image  className='img' src={detailIcon}/>
							</View>
						</View>
						<View className="u-cell line-bottom">
							<View className="u-cell_title">
								地区:
							</View>
							<View className={classNames('u-cell_value', { 'dark': !user_info.country && !user_info.city})} >
								<View className='text'>{user_info.city} {user_info.country}</View>
							</View>
							<View className="u-cell_arrow">
								<Image  className='img' src={detailIcon}/>
							</View>
						</View>
						<View className="u-cell line-bottom">
							<View className="u-cell_title">
								简介:
							</View>
							<View className={classNames('u-cell_value', { 'dark': !user_info.introduction  })} >
								<View className='text'>{user_info.introduction || '您还没填写简介哦'}</View>
							</View>
							<View className="u-cell_arrow">
								<Image  className='img' src={detailIcon}/>
							</View>
						</View>
					</View>

				}
				{
					user_info.isAdmin == 1 &&
					<Button className='share_btn' onClick={ this.handleCreateShareImg.bind(this)}>分享</Button>
				}
                {
                    share_img &&
                    <View className="share_img">
                        <View className="main">
                            <Canvas canvas-id='Canvas' className='canvas'></Canvas>
                            <View className="shareCover">
                                <Image  className="icon icon_close" src="https://otherfiles-ali.uupt.com/Stunner/FE/C/icon_close.png" onClick={this.handleShareClose.bind(this)} />
                                <View class="shareBtn">
                                    <Image  className="save_btn" src={save_btn}  onClick={this.handleSaveImg.bind(this)}/>
                                    <Image  className="refresh_btn" src={refresh_btn} onClick={this.handleRefreshImg.bind(this)}/>
                                </View>
                            </View>
                        </View>
                    </View>
                }

            </View>
        )
    }
}
