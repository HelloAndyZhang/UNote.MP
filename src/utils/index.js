import Taro from "@tarojs/taro";

const formatNumber = (n) => {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
/**
 * 过滤手机号
 * @param {Number} tel
 */
const filterPhone = (tel) => {
    var phone = String(tel).replace(/[^\d.]+/g, '').replace(/^\+?86/g, '').substring(0, 11);
    return phone;
}
/**
 * @method session存、读取
 * @param {String} key
 * @param {any} val
 */
const session = (key, val) => {
    if (!key || typeof key != 'string') {
        throw new Error('key must be a String!');
    }
    if (val != undefined) {
        if (val instanceof Object) {
            val = JSON.stringify(val);
        }
        Taro.setStorageSync(key, val);
        return;
    }
    let value = Taro.getStorageSync(key);
    try {
        value = JSON.parse(value);
    } catch (error) { }
    return value
}
/**
 * @method 删除session
 * @param {String} key
 */
const removeSession = (key) => {
    if (key == undefined) {
        return
    }
    Taro.removeStorageSync(key);
}



//检测手机号
const checkPhone = (m) => {
    var regTel = /^[1]{1}\d{10}$/;
    if (regTel.test(m)) {
        return true
    } else {
        return false
    }
}
/**
 * @method toast提示
 * @param {String} text
 */
const msg = (title, icon = 'none') => {
    Taro.showToast({
        title,
        icon
    })
}
/**
 * @method 显示加载框
 * @param {Boolean} mask 是否显示蒙层
 * @param {String} title 提示文字
 */
const showLoading = (title = "加载中...", mask = true) => {
    Taro.showLoading({
        title,
        mask
    })
}

/**
 * @method 隐藏加载框
 */
const hideLoading = () => {
    Taro.hideLoading();
}
/**
 * @method 设置剪贴板内容
 * @param {String} data
 */
const copy = (data) => {
    return new Promise((resolve, reject) => {
        Taro.setClipboardData({
            data,
            success: () => {
                resolve();
            },
            fail: (error) => {
                reject(error);
            }
        })
    })
}
/**
 * @method 拨打电话
 * @param {Number} tel
 */
const Call = (tel) => {
    return new Promise((resovle, reject) => {
        Taro.makePhoneCall({
            phoneNumber: tel,
            success: () => {
                resovle()
            },
            fail: () => {
                reject();
            }
        })
    })
}
/**
 * @method 下载图片
 * @param {String} url
 */
const downLoadImg = (url) => {
    return new Promise((resolve, reject) => {
        Taro.downloadFile({
            url,
            success: res => {
                if (res.statusCode == 200) {
                    resolve({
                        Success: true,
                        data: res.tempFilePath
                    });
                } else {
                    resolve({
                        Success: false
                    });
                    msg('下载图片失败')
                }
            },
            fail: error => {
                msg('下载图片失败', error)
                resolve({
                    Success: false
                });
            }
        });
    });
}

const formatTime = (time) => {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const t1 = [year, month, day].map(formatNumber).join('/')
    const t2 = [hour, minute, second].map(formatNumber).join(':')
    return `${t1} ${t2}`
}


//格式化时间  date时间对象  fmt时间格式 如yyyy/MM/dd hh:mm:ss
const FmtTime = (date, fmt) => {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 分钟转化为小时
 */
const toHourMinute = (time) => {
    let minute = '';
    let hour = '';
    let day = '';
    if (time >= 60 && time < 60 * 24) {
        minute = time % 60 == 0 ? '' : time % 60 + '分钟';
        hour = parseInt(time / 60) + '小时';
    } else if (time >= 60 * 24) {
        minute = time % 60 == 0 ? '' : time % 60 + '分钟';
        hour = parseInt(parseInt(time % 1440) / 60) == 0 ? '' : parseInt(parseInt(time % 1440) / 60) + '小时';
        day = parseInt(time / 1440) + '天';
    } else {
        minute = time + '分钟'
    }
    return day + hour + minute
}


//跳转小程序
const goMiniProgram = (item) => {
    my.navigateToMiniProgram({
        appId: item.appId,
        path: item.path || 'pages/index/index',
        extraData: item.extraData || {},
        success(res) {
            console.log(res)
        },
        fail(err) {
            console.log(err)
        }
    })
}


export default {
    formatNumber,
    formatTime,
    FmtTime,
    msg,
    showLoading,
    hideLoading,
    session,
    removeSession,
    copy,
    Call,
    checkPhone,
    filterPhone,
    downLoadImg,
    goMiniProgram,
}
