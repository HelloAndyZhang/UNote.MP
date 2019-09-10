import Taro from "@tarojs/taro";
import Utils from './index'

//请求URL地址

// let BASE_URL = "http://192.168.6.3:9277"; //  6.3
// let BASE_URL = 'http://192.168.6.249:5000'
// let BASE_URL = 'http://192.168.6.143:5000'
// let BASE_URL ='http://192.168.2.6:5000'
let BASE_URL = 'https://zzu.unote.uupt.com'
/**
 * @method get请求
 * @param {Object} opt
 */
const GET = (opt = {}) => {
  let isLoad = opt.isLoad != undefined ? opt.isLoad : true;
  let time = new Date().getTime();
  const str = Object.entries(opt.params ? opt.params : {}).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
  let isMsg = opt.isMsg != undefined ? opt.isMsg : true;
  let editHeaders = Object.assign({}, {
    // 'content-type': 'application/json'
  })
  opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
  isLoad && Utils.showLoading();
  return new Promise((resolve, reject) => {
    let address = str ? `${opt.url}?${str}&t=${time}` : `${opt.url}?t=${time}`;
    Taro.request({
      url: BASE_URL + address,
      header: editHeaders,
      method: "GET",
      dataType:opt.dataType||'json',
      success: res => {
		if (res.data.code == 401) {
			Utils.msg('状态获取失败')
			Taro.navigateTo({
				url:`/pages/login/index`
			})
            return
        }
		setTimeout(_ => {
			resolve(res.data)
		}, 0)
        isLoad && Utils.hideLoading();
      },
      fail: err => {
          console.log(err)
        isLoad && Utils.hideLoading();
        reject(err)
        isMsg && Utils.msg('网络异常')
      }
    })
  })
}

/**
 * @method POST请求
 * @param {Object} opt
 */
const POST = (opt = {}) => {
    // console.table(Object.assign(opt.data,{url:opt.url}))
  let isLoad = opt.isLoad != undefined ? opt.isLoad : true;
  let isMsg = opt.isMsg != undefined ? opt.isMsg : true;
  let editHeaders = {
    'Content-Type': 'application/json'
  }
  opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
  isLoad && Utils.showLoading();
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${opt.url}`,
      data: opt.data,
      header:editHeaders,
      method: "POST",
      success: (res) => {
        setTimeout(_ => {
          if (res.data.code == 401) {
			Utils.msg('状态获取失败')
			Taro.navigateTo({
				url:`/pages/login/index`
			})
            return
          }
          if (res.data) {
            resolve(res.data);
          }
        }, 0)
        isLoad && Utils.hideLoading();
      },
      fail: err => {
        reject(err)
        isLoad && Utils.hideLoading();
        isMsg && Utils.msg('网络异常')
      }
    })
  })
}


const Fetch = (opt = {}) => {
  let isLoad = opt.isLoad != undefined ? opt.isLoad : true;
  let editHeaders = Object.assign({}, {
    'Content-Type': 'application/json'
  })
  opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
  isLoad && Utils.showLoading();
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${opt.url}`,
      data:opt.data,
      header: editHeaders,
      method:opt.method,
      success: (res) => {
        setTimeout(_ => {
          if (res.data) {
            resolve(res.data);
          }
        }, 0)
        isLoad && Utils.hideLoading();
      },
      fail: err => {
        reject(err)
        isLoad && Utils.hideLoading();
        Utils.msg('网络异常请重试','loading')
      }
    })
  })
}

export default {
  POST,
  GET,
  Fetch,
  BASE_URL,
}
