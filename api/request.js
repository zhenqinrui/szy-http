import store from '@/store'

// 获取网络状态
export const getNetworkType = () => {
    let status = '';

    return new Promise((resole, reject) => {
        uni.getNetworkType({
            success: ({ networkType }) => {
                status = networkType;
            },
            fail: () => {
                status = 'error'
            },
            complete() {
                if (status === 'none') {
                    // 无网络
                    reject(status);
                } else {
                    resole(status);
                }
            }
        });
    });
}

export function request(config) {
    return new Promise(function (resolve, reject) {
        getNetworkType().then(() => {
            let showLoading = false;
            // { 'content-type': 'application/x-www-form-urlencoded' },
            let header = config.header ? config.header : { 'content-type': 'application/json' };
            let url = config.url;
            let timeout = config.timeout || 5000;
            let method = config.method && config.method.toUpperCase() || 'GET';

            let params = { showLoading, header, url, timeout, method }

            if (config.data) {
                params.data = config.data
            }

            if (config.dataType) {
                params.dataType = config.dataType
            }

            if (config.responseType) {
                params.responseType = config.responseType
            }

            if (config.showLoading) {
                uni.showLoading({
                    title: '加载中...',
                })
                showLoading = true;
            }


            uni.request({
                ...params,
                success(response) {
                    let code = ''
                    let data = ''
                    if (response.data) {
                        code = response.data.code || response.data.returncode
                        data = response.data.body
                    }
                    if (code == 10000) {
                        if (config.message) {
                            showToast(config.message, 'success')
                        }

                        resolve(data)
                    } else if (code == 10005) {
                        showToast('登录过期', 'none')
                        uni.showModal({
                            title: '提示',
                            content: '登录已过期,请重新登录',
                            success (res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                                store.commit('user/LOGOUT')
                                uni.navigateTo({url: '/pages/login/auth'})
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          })
                    } else  {
                        showToast(response.data.message || '请求失败', 'none')
                        reject(response.data)
                    }


                },
                fail(error) {
                    setTimeout(() => {
                        showToast('请求异常，请稍后再试', 'none');
                    }, 100);
                    reject(error)
                },
                complete() {
                    if (showLoading) {
                        uni.stopPullDownRefresh();
                        uni.hideLoading()
                        showLoading = false;
                    }
                }
            })
        }).catch((error) => {
            uni.stopPullDownRefresh();
            uni.hideLoading()
            showToast('网络已断开，请下拉刷新重试', 'none');
            reject(error)
        });
    })
}
/**
 * @description:
 * @param {string} message
 * @return {*}
 * @author: huangxiaoguo
 */
function showToast(message, icon) {
    return uni.showToast({
        title: message,
        icon: icon || 'success',
        duration: 2000
    })
}
