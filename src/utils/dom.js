import Taro from '@tarojs/taro'
const ENV = Taro.getEnv()
const delay = function (delayTime = 500) {
    return new Promise(resolve => {
        if ([Taro.ENV_TYPE.WEB, Taro.ENV_TYPE.SWAN].includes(ENV)) {
            setTimeout(() => {
                resolve()
            }, delayTime)
            return
        }
        resolve()
    })
}
// 添加节点的布局位置的查询请求。相对于显示区域，以像素为单位。其功能类似于 DOM 的 getBoundingClientRect。返回 NodesRef 对应的 SelectorQuery
const delayQuerySelector = function (self, selectorStr, delayTime = 500) {
    const $scope = ENV === Taro.ENV_TYPE.WEB ? self : self.$scope
    const selector = Taro.createSelectorQuery().in($scope)
    return new Promise(resolve => {
        delay(delayTime).then(() => {
            selector
                .select(selectorStr)
                .boundingClientRect()
                .exec((res) => {
                    resolve(res)
                })
        })
    })
}
// 添加节点的 Context 对象查询请求。目前支持 VideoContext、CanvasContext、LivePlayerContext 和 MapContext 的获取。
const delayQuerySelectorCtx = function (self, selectorStr, delayTime = 500) {
    const $scope = ENV === Taro.ENV_TYPE.WEB ? self : self.$scope
    const selector = Taro.createSelectorQuery().in($scope)
    return new Promise(resolve => {
        delay(delayTime).then(() => {
            selector
                .select(selectorStr)
                .context((res) => {
                    resolve(res)
                }).exec()
        })
    })
}
const delayGetScrollOffset = ({ delayTime = 500 }) => {
    return new Promise(resolve => {
        delay(delayTime).then(() => {
            Taro.createSelectorQuery()
                .selectViewport()
                .scrollOffset()
                .exec((res) => {
                    resolve(res)
                })
        })
    })
}


const delayGetClientRect = ({ self, selectorStr, delayTime = 500 }) => {
    const $scope = ENV === Taro.ENV_TYPE.WEB || ENV === Taro.ENV_TYPE.SWAN ? self : self.$scope
    const selector = Taro.createSelectorQuery().in($scope)
    return new Promise(resolve => {
        delay(delayTime).then(() => {
            selector
                .select(selectorStr)
                .boundingClientRect()
                .exec((res) => {
                    resolve(res)
                })
        })
    })
}
const uuid = (len = 8, radix = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const value = []
    let i = 0
    radix = radix || chars.length

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)]
    } else {
        // rfc4122, version 4 form
        let r

        // rfc4122 requires these characters
        /* eslint-disable-next-line */
        value[8] = value[13] = value[18] = value[23] = '-'
        value[14] = '4'

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!value[i]) {
                r = 0 | (Math.random() * 16)
                value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return value.join('')
}
const getEventDetail = (event) => {
    let detail
    switch (ENV) {
        case Taro.ENV_TYPE.WEB:
            detail = {
                pageX: event.pageX,
                pageY: event.pageY,
                clientX: event.clientX,
                clientY: event.clientY,
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                x: event.x,
                y: event.y
            }
            break

        case Taro.ENV_TYPE.WEAPP:
            detail = {
                pageX: event.touches[0].pageX,
                pageY: event.touches[0].pageY,
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
                offsetX: event.target.offsetLeft,
                offsetY: event.target.offsetTop,
                x: event.target.x,
                y: event.target.y
            }
            break

        case Taro.ENV_TYPE.ALIPAY:
            detail = {
                pageX: event.target.pageX,
                pageY: event.target.pageY,
                clientX: event.target.clientX,
                clientY: event.target.clientY,
                offsetX: event.target.offsetLeft,
                offsetY: event.target.offsetTop,
                x: event.target.x,
                y: event.target.y
            }
            break

        case Taro.ENV_TYPE.SWAN:
            detail = {
                pageX: event.changedTouches[0].pageX,
                pageY: event.changedTouches[0].pageY,
                clientX: event.target.clientX,
                clientY: event.target.clientY,
                offsetX: event.target.offsetLeft,
                offsetY: event.target.offsetTop,
                x: event.detail.x,
                y: event.detail.y
            }
            break

        default:
            detail = {
                pageX: 0,
                pageY: 0,
                clientX: 0,
                clientY: 0,
                offsetX: 0,
                offsetY: 0,
                x: 0,
                y: 0
            }
            console.warn('getEventDetail暂未支持该环境')
            break
    }
    return detail
}


let scrollTop = 0

const handleTouchScroll = (flag) => {
    if (ENV !== Taro.ENV_TYPE.WEB) {
        return
    }
    if (flag) {
        scrollTop = document.documentElement.scrollTop

        // 使body脱离文档流
        document.body.classList.add('at-frozen')

        // 把脱离文档流的body拉上去！否则页面会回到顶部！
        document.body.style.top = `${-scrollTop}px`
    } else {
        document.body.style.top = null
        document.body.classList.remove('at-frozen')

        document.documentElement.scrollTop = scrollTop
    }
}

const pxTransform = (size) => {
    if (!size) return ''
    return Taro.pxTransform(size)
}
export {
    delayQuerySelector,
    delayQuerySelectorCtx,
    delay,
    uuid,
    getEventDetail,
    pxTransform,
    handleTouchScroll,
    delayGetClientRect,
    delayGetScrollOffset,
}














