import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Map } from '@tarojs/components'
import './index.scss'
import logo from '@/assets/logo.png'
import shareBg from '@/assets/share_bg_one.jpg'
import Utils from '@/utils/index'
import http from '@/utils/http';

export default class MapT extends Component {

	config = {
		navigationBarTitleText:'',
		transparentTitle:'auto',
		gestureBack:'YES',
		showTitleLoading:'YES',
		pullRefresh:'NO'
	}
	constructor(props) {
		super(props);
		this.state = {
			longitude: '113.730106',
			latitude: '34.778559',
		};
		// this._observer ={};
	}
	//分享
	onShareAppMessage() {
		return {
			title: '记录 成为更好的自己',
			path: 'pages/login/index',
			imageUrl: shareBg
		}
	}
	componentWillMount() {

	}

	componentDidMount() {

	}

	componentWillUnmount() { }

	componentDidShow() {
		my.createIntersectionObserver().relativeToViewport({top: 100, bottom: 100}).observe('.state-name', (res) => {
			console.log(res, 'intersectionObserver');
			console.log(res.intersectionRatio); // 相交区域占目标节点的布局区域的比例
			console.log(res.intersectionRect);  // 相交区域
			console.log(res.relativeRect);      // 参照区域的边界
			console.log(res.boundingClientRect); // 目标边界
			console.log(res.time); // 时间戳
			console.log(res.id);
			console.log(res.dataset);
		  });
	}
	componentDidHide() { }


	render() {
		let { latitude, longitude } = this.state;
		return (
			<View className="page-map">
				<Map id="order_map"
					className="status_map"
					longitude={longitude}
					latitude={latitude}
					show-location
					scale='16'
				>
				</Map>
				<View className='overlay'>

					<View className='state-name'>
						<View className='title'>
							<Image className='img ' src='https://fesmallapp.uupt.com/static/ant/linke_serve.png'></Image>
							<View className="text" >
								订单记录
							</View>
						</View>
						<View className='name'>
							待支付
						</View>
					</View>
					<View className='box'>

					</View>
					<View className='box'>

					</View>
					<View className='box'>

					</View>
					<View className='box'>

					</View>
				</View>
			</View>
		)
	}
}
