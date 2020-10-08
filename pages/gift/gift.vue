<template>
	<view class="gift">
		<view class="login-div">
			<view class="thumbnail">
				<open-data type="userAvatarUrl"></open-data>
			</view>
			<view class="login-msg">
				<view class="info user-name">
					<open-data type="userNickName"></open-data>
					<view class="gender" v-if="gender" style="margin-left: 5rpx;">
						<image :src="gender" mode="widthFix"></image>
					</view>
				</view>
				<view @tap="login" class="info user-id">{{ id }}</view>
			</view>
		</view>
		<view class="functional">
			<view class="customer item">
				<image src="/static/images/customer.png" class="icon"></image>
				<button class="contacButton" open-type="contact">在线客服</button>
				<view class="arrow">></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			login() {
				if (!this.userInfo) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			},
			id() {
				return this.userInfo ? `id:  ${this.userInfo._id.slice(-8)}` : '未登陆'
			},
			gender() {
				if (this.userInfo) {
					switch (this.userInfo.gender) {
						case 1:
							return '/static/images/boy.png'
						case 2:
							return '/static/images/girl.png'
					}
				}
			}
		}
	}
</script>

<style>
	.icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.functional {
		padding-left: 30rpx;
	}
	
	.functional .item {
		position: relative;
		display:flex;
		align-items: center;
	}
	
	.functional .item .arrow {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 36rpx;
		color: #999;
	}
	
	
	.contacButton {
		background-color: #FFF;
		padding: 0;
		margin: 0;
		font-size: inherit;
		text-align: left;
	}

	.contacButton::after {
		border: #FFF solid;
	}

	.contacButtonView {
		padding: 12rpx 20rpx 12rpx 60rpx;
		color: #333;
	}

	.gift {
		margin: 30rpx 30rpx 0 0;
	}

	.login-div {
		display: flex;
		align-items: center;
		padding-bottom: 30rpx;
		border-bottom: #ddd 1rpx solid;
		margin-left: 30rpx;
	}

	.login-div .thumbnail {
		width: 160rpx;
		height: 160rpx;
		display: flex;
		border-radius: 50%;
		overflow: hidden;
	}

	.login-msg .info {
		margin-left: 40rpx;
		margin-bottom: 20rpx;
	}

	.login-msg .user-name {
		display: flex;
	}

	.gender {
		width: 40rpx;
	}
</style>
