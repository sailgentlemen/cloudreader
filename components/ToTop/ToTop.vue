<template>
	<view class="to__top" @tap="goTopHandle">
		<view class="iconfont">
			&#xe61c;
		</view>
		<view class="tips">回到顶部</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			goTopHandle () {
				this.$emit('goTopHandle')
			}
		}
	}
</script>

<style scoped>
	.iconfont {
		font-size: 60rpx;
	}
	
	.to__top {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.tips {
		margin-top: 15rpx;
	}
</style>
