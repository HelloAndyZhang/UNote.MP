import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, RichText } from '@tarojs/components'
import './index.scss'
import logo from '@/assets/logo.png'
import shareBg from '@/assets/share_bg_one.jpg'
import Utils from '@/utils/index'
import http from '@/utils/http';
import Weather from '@/components/weather'

export default class Login extends Component {

	config = {
		navigationBarTitleText: '登录',
		disableScroll: true
	}
	constructor() {
		super()
		this.state = {
			mobile:'',
			password:'',
			openid:'',
			secret:'',
		}
	}
    //分享
    onShareAppMessage() {
        return {
			title:'记录 成为更好的自己',
			path:'pages/login/index',
			imageUrl:shareBg
        }
    }
	componentWillMount() {
		this.getAuthOpenId()
	}

	componentDidMount() {

	}

	componentWillUnmount() { }

	async componentDidShow() {
		let { params} = this.$router
		this.setState({
			secret:params.scene||Utils.session('secret')
		})
		// Utils.session('token')&&Taro.switchTab({url:'/pages/index/index'})
	}
	componentDidHide() { }

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
		let { openid, mobile, password,secret } = this.state;
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
			let config = {
				url: '/api/user/login',
				data: {
					openid,
					mobile,
					password,
					secret
				},
				isLoad: true
			}
			let $res = await http.POST(config);
			if ($res.code == 200) {
				Utils.session('token', $res.data)
				this.setState({
					token: $res.data
				})
				Utils.removeSession('secret');
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
				{/* start */}
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
