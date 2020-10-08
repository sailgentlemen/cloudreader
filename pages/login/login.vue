<template>
	<view class="container">
		<view class="logo">
			<image mode="widthFix" class="logo" src="/static/logo.png" />
			</image>
		</view>
		<view class="title">暮光书菇</view>
		<view class="descripe">做一个快乐的小书虫</view>
		<button class="login_btn" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			async getUserInfo(res) {
				if(!res.target.userInfo) return;
				// 用户登陆
				wx.showLoading()
				const response = await wx.cloud.callFunction({
					name: 'login',
					data: {
						userInfo: res.target.userInfo
					}
				})
				if (response.result) {
					// 登陆成功后，再获取用户信息,放置到store内
					await this.$store.dispatch('userInfo')
					wx.hideLoading()
					this.loginSuccess = true;
					uni.showToast({
						title: '登录成功!',
						success() {
							uni.navigateBack({
								success() {},
								fail(res) {
									console.log(res)
									uni.switchTab({
										url:"/pages/bookshelf/bookshelf"
									})
								}
							})
						}
					})
				}
			},
		},
		onUnload() {
			// uni.switchTab({
			// 	url: '/pages/bookmall/bookmall'
			// })
		}
	}
</script>

<style scoped lang="less">
	.container {
		display: flex;
		align-items: center;
		height: 100vh;
		flex-direction: column;
		font-size: 28rpx;
		line-height: 1;
		padding: 120rpx 60rpx 0;
	}

	.logo {
		width: 144rpx;
		height: 144rpx;
		margin-bottom: 50rpx;

		image {
			border-radius: 50%;
		}
	}

	.title {
		font-size: 36rpx;
		margin-bottom: 20rpx;
	}

	.descripe {
		color: #929292;
		margin-bottom: 120rpx;
	}

	.login_btn {
		width: 100%;
		background: #FC6337;
		color: #fff;
	}
</style>
