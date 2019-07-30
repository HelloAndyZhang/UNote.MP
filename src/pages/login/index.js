import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, RichText } from '@tarojs/components'
import './index.scss'
import logo from '@/assets/logo.png'
import Utils from '@/utils/index'
import http from '@/utils/http';
import QQMapWX from '@/utils/qqmap-wx-jssdk.js';
export default class Login extends Component {

	config = {
		navigationBarTitleText: '登录',
		disableScroll: true
	}
	constructor() {
		super()
		this.state = {
			mobile:'13262057521',
			password:'123456'
		}
	}
	//分享
	onShareAppMessage() {
		return {
			title: '我的优笔记',
		}
	}
	componentWillMount() {
		this.getAuthOpenId()
	}

	componentDidMount() { }

	componentWillUnmount() { }

	async componentDidShow() {
		// Utils.session('token')&&Taro.switchTab({url:'/pages/index/index'})
		let $res = await Taro.getLocation({
			type: "wgs84", //	否	wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		})
		this.getLocation($res.latitude, $res.longitude)
	}
	componentDidHide() { }
	getLocation(lat, lng) {
		const _this = this;
		let qqmapsdk = new QQMapWX({
			key: 'NKSBZ-7F6R4-DYRUM-DFVXT-3EF2T-LMFPR'
		});
		qqmapsdk.reverseGeocoder({
			//位置坐标，默认获取当前位置，非必须参数
			location: `${lat},${lng}`, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
			//get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
			success(res) {//成功后的回调
				console.log(res);

			},
			fail(error) {
				console.error(error);
			},
			complete(res) {
				console.log(res);
			}
		})
	}
	async getAuthOpenId() {
		try{
			let res = await Taro.login();
			if (res.errMsg == "login:ok") {
				let config = {
					url: '/api/token',
					data: {
						code: res.code
					},
					isLoad: true
				}
				let $res = await http.POST(config);
				Utils.session('openid', $res.openId)
				this.setState({
					openid: $res.openId
				})
			} else {
				Utils.msg('授权失败袄');
			}
		}catch(err){
			Taro.redirectTo({
				url:'/pages/auth/index'
			})
		}
	}
	//输入账号
	handleMobileInput(event) {
		this.setState({
			mobile: event.detail.value
		})
	}
	//输入密码
	handlePwdInput(event) {
		this.setState({
			password: event.detail.value
		})
	}

	async handleUserLogin() {
		let { openid, mobile, password } = this.state;
		if (!openid) {
			Utils.msg('未获取到您的openId袄');
			return
		}
		if (!mobile) {
			Utils.msg('您还没有输入手机号袄');
			return
		}
		if (!password) {
			Utils.msg('您还没有输入密码袄');
			return
		}
		if (!Utils.checkPhone(mobile)) {
			Utils.msg('手机号不正确袄');
			return
		}
		try{
			let time = Math.ceil(new Date().getTime())
			let config = {
				url: '/api/user/login',
				data: {
					openid,
					mobile,
					password,
					secret:`6fc27bd0b2a711e9863fa9e0bf592030`
				},
				isLoad: true
			}
			let $res = await http.POST(config);
			if ($res.code == 200) {
				Utils.session('token', $res.data)
				this.setState({
					token: $res.data
				})
				Utils.msg('登录成功');
				setTimeout(() => {
					Taro.switchTab({
						url: '/pages/index/index'
					})
				}, 600)
			}else{
				Utils.msg($res.msg)
			}
		}
		catch(err){
			Taro.redirectTo({
				url:'/pages/auth/index'
			})
		}
	}
	render() {
		let { mobile, password } = this.state;
		return (
			<View class="page-login">
				<View class="logo">
					<Image src={logo} class="img"></Image>
				</View>
				<View class="title">优秀如你 灼灼其华</View>
				<View class="box">
					<View class="phone line-bottom">
						<Input type='number' placeholder='请输入手机号码' value={mobile} onInput={this.handleMobileInput.bind(this)} placeholderStyle="placeholder" maxLength='11' />
					</View>
					<View class="phone line-bottom">
						<Input type='password' placeholder='请输入密码' value={password} onInput={this.handlePwdInput.bind(this)} placeholderStyle="placeholder" maxLength='11' />
					</View>
					<Button class="btn" onClick={this.handleUserLogin.bind(this)}>登录</Button>
				</View>
			</View>
		)
	}
}
