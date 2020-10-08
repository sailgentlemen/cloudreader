<template>
	<view class="no__result">
		<view class="pic">
			<image src="/static/images/no-result.jpg" mode="widthFix"></image>
		</view>
		<view class="msg">{{msg}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			msg: {
				type: String,
				default: '没有找到相关内容哟～'
			}
		},
		name: 'noReult',
		data() {
			return {

			};
		}
	}
</script>

<style scoped>
	.no__result {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #b8b8b8;
		margin-top: 500rpx;
	}

	.no__result .pic {
		width: 350rpx;
		margin-bottom: 20rpx;
	}
</style>
