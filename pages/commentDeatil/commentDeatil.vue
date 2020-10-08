<template>
	<view class="page__warp">
		<view class="header">
			<view class="avatar">
				<image src="https://qn-qn-echo-image-cdn.app-echo.com/FmWR77avMRNKU4_zy7KExrOowarL?imageMogr2/auto-orient/quality/100%7CimageMogr2/thumbnail/!50x50r/gravity/Center/crop/50x50/dx/0/dy/0"
				 mode="widthFix"></image>
			</view>
			<view class="nickmame">
				不要丢下我一个人
			</view>
			<view class="remark">
				<view style="margin-right: 10rpx;">点评</view>
				<Rate value="4" color="#828491" gap="5rpx" size="30rpx" />
			</view>
		</view>
		<view class="content">
			无聊的人看无聊的书，很多情节重复，剧情够老套，而且很多地方逻辑错误，但还是要感谢作者，毕竟码字这么多，会一直支持下去的，希望作者多多努力！值得大家一看。
		</view>
		<view class="book__info">
			<view class="cover">
				<image src="http://b.heiyanimg.com/book/93529.jpg@!bpm?1" mode="widthFix"></image>
			</view>
			<view class="detail">
				<view class="name">阴司秘事</view>
				<view class="author">辣椒炒扎粉</view>
			</view>
		</view>
		<view class="main">
			<view class="publish__time">
				发表于 4/27 13:27
			</view>
			<view class="tab__area">
				<Tab :tabs="list" :activeTab="activeTab" swiperClass="weui-tabs-swiper" @clickTab="onTabCLick" @changeTab="onChange"
				 activeClass="tab-bar-title__selected"/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						title: '评论 7',
						componentName: "comment"
					},
					{
						title: '点赞 258',
						componentName: "star"
					}
				],
				activeTab: 0,
			}
		},
		methods: {
			onTabCLick(payload) {
				const {
					index
				} = payload
				this.activeTab = index
			},
			onChange(payload) {
				const {
					index
				} = payload
				this.activeTab = index
			}
		}
	}
</script>

<style scoped>
	.page__warp {
		background: #fff;
	}

	.header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		padding-top: 40rpx;
		padding: 60rpx 66rpx 0;
	}

	.avatar {
		width: 58rpx;
		height: 58rpx;
		margin-right: 20rpx;
	}

	.avatar image {
		border-radius: 100%;
	}

	.remark {
		display: flex;
		color: #8c9093;
		margin-left: 15rpx;
	}

	.content {
		line-height: 1.5;
		fonts-size: 42rpx;
		padding: 0 66rpx 50rpx;
		border-bottom: 1px solid #eaeaea;
	}

	.book__info {
		padding: 66rpx 66rpx;
		display: flex;
		border-bottom: 1px solid #eaeaea;
		align-items: center;
	}

	.book__info .cover {
		width: 136rpx;
		margin-right: 50rpx;
	}

	.book__info .name {
		font-size: 50rpx;
		line-height: 1;
	}

	.book__info .author {
		font-size: 35rpx;
		line-height: 1;
		margin-top: 35rpx;
	}

	.main {
		padding: 66rpx 66rpx;
	}

	.publish__time {
		font-size: 30rpx;
		color: #787c7f;
		margin-bottom: 90rpx;
		line-height: 1;
	}	
</style>
