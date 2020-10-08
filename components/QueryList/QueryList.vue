<template>
	<view class="query__list">
		<block v-for="item in list" :key="item._id">
			<view class="scroll-view-item" @tap="toRead(item._id)">
				<view class="cover">
					<image :src="item.cover" mode="widthFix"></image>
				</view>
				<view class="info">
					<view class="info-title">
						{{item.bookName}}
					</view>
					<view class="info-author">{{item.bookAuthor}} | {{item.bookCategory}}</view>
					<view>最后更新：{{item.bookLastupdate}}</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		computed: {
			list () {
				return this.$store.state.qsList
			}
		},
		data() {
			return {

			};
		},
		methods: {
			toRead(_id) {
				uni.navigateTo({
					url: "/pages/read/read?_id=" + _id
				})
			}
		}
	}
</script>

<style scoed>
	.query__list .scroll-view-item {
		padding: 33rpx 0;
		display: flex;
		align-items: center;
	}

	.query__list .cover {
		width: 160rpx;
		height: auto;
	}

	.query__list .info {
		margin-left: 40rpx;
	}

	.query__list .info-title {
		color: #14151a;
		font-size: 40rpx;
		margin-bottom: 20rpx;
	}

	.query__list .info-author {
		margin-bottom: 20rpx;
	}
</style>
