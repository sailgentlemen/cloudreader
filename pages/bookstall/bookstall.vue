<template>
	<view class="page__wrap">
		<scroll-view scroll-y="true" style="height: 100vh">
			<view class="page">
				<view class="categories">
					<view class="category" v-for="item in bookCategories" @tap="queryListHandle(item.name)" :key="item.name">
						<view class="title">{{item.name}}</view>
						<view class="cover_area">
							<view class="covers">
								<image class="first" :class="{offset: item.covers[1]}" mode="widthFix" :src="item.covers[0]"></image>
								<image v-if="item.covers[1]" class="second" mode="widthFix" :src="item.covers[1]"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed: {
			bookCategories() {
				return this.$store.state.bookCategories
			}
		},
		methods: {
			async queryListHandle(name) {
				// 跳转到查询页
				const qs = encodeURIComponent(name)
				uni.navigateTo({
					url: "/pages/search/search?qs=" + qs
				})
			}
		}
	}
</script>

<style scoped>
.page__wrap {
	background: #f2f2f2;
}	

.categories {
	display: flex;
	/* justify-content: space-evenly; */
	flex-wrap: wrap;
	padding-bottom: 40rpx;
}

.category {
	box-shadow: 0 0 30rpx rbga(0,0,0,.3);
	margin-top: 40rpx;
	margin-left: 50rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.title {
	width: 185rpx;
	background: #fff;
	color: #474747;
	line-height: 62rpx;
	text-align: center;
	font-size: 26rpx;
}

.cover_area {
	position: relative;
	width: 100%;
	height: 169rpx;
	background: #efefef;
	display: flex;
	align-items: center;
	justify-content: center;
}

image {
	width: 78rpx;
	position: relative;
}

.offset {
	transform: translateX(25%);
}

.first {
	z-index: 1;
}

.second {
	width: 58rpx;
	transform:translateX(-20%);
}
</style>
