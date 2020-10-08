<template>
	<view class="page__wrap" v-if="likeBooks.length">
		<Search :route="route" />
		<scroll-view scroll-y="true" style="height: 100vh;" @scroll="scrollHandle" :scroll-with-animation="true" :scroll-top="scrollTop" @scrolltolower="lower">
			<view class="page">
				<view class="header section">
					<view class="swiper-wrap">
						<swiper class="swiper" :style="{ height: scaleHeight + 'px' }" :circular="circular" :autoplay="autoplay">
							<swiper-item v-for="item in banners" :key="item.id">
								<view class="swiper-item">
									<image mode="widthFix" :src="item.url" @load="loadHandler"></image>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="menu">
						<view class="menu-item" @tap="toBoys">
							<label class="iconfont">&#xe64a;
							</label>
							<text>男生</text>
						</view>
						<view class="menu-item" @tap="toGirls">
							<label class="iconfont">&#xe64b;
							</label>
							<text>女生</text>
						</view>
						<view class="menu-item" @tap="toBookStall">
							<image class="bookstall" src="/static/images/categray.png"></image>
							<text>分类书摊</text>
						</view>
					</view>
				</view>
				<!-- 猜你喜欢 -->
				<view class="hot-header section-header">
					<view class="hot-title">猜你喜欢</view>
				</view>
				<view class="hot section likes">
					<swiper @change="changeHandle" previous-margin="215rpx" :acceleration="true" display-multiple-items="2" interval="3000"
					 class="swiper" :style="{ height: likesScaleHeight + 'px' }" :circular="circular" :autoplay="autoplay">
						<swiper-item v-for="(book,index) in likeBooks" :key="book._id">
							<view class="swiper-item" @tap="goReading(book._id)">
								<image :class="{active: current === index}" mode="widthFix" :src="book.cover" @load="loadLikesHandler"></image>
								<view class="name">{{book.bookName}}</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<!-- 火热先锋 -->
				<view class="hot-header section-header">
					<view class="hot-title">火热先锋</view>
					<view class="refresh" @tap="debouncedrefreshHandle"><text>换一换</text><label class="iconfont">&#xe7cf;</label></view>
				</view>
				<view class="hot section">
					<view class="scroll__area">
						<view class="scroll-view-item" v-for="book in books" :key="book._id" @tap="goReading(book._id)">
							<view class="cover">
								<image :src="book.cover" mode="widthFix"></image>
							</view>
							<view class="info">
								<view class="info-title">
									{{book.bookName}}
								</view>
								<view class="info-author">{{book.bookAuthor}}</view>
								<view>{{book.bookStatus}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 重磅新品 -->
				<view class="hot-header section-header">
					<view class="hot-title">重磅新品</view>
				</view>
				<view class="hot section">
					<view class="scroll__area">
						<view class="scroll-view-item" v-for="book in newBooks" :key="book._id" @tap="goReading(book._id)">
							<view class="cover">
								<image :src="book.cover" mode="widthFix"></image>
							</view>
							<view class="info">
								<view class="info-title">
									{{book.bookName}}
								</view>
								<view class="info-author">{{book.bookAuthor}}</view>
								<view>{{book.bookStatus}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<uni-transition :mode-class="['slide-right']" :styles="{'position':'absolute','bottom': '15vh','right': '6vw'}" :show="showToTop">
			<ToTop @goTopHandle="goTopHandle" />
		</uni-transition>
	</view>
</template>

<script>
	import _ from 'lodash'
	
	export default {
		created() {
			// 在500ms内只执行一次
			this.debouncedrefreshHandle = _.debounce(this.refreshHandle,500)
		},
		data() {
			return {
				limit: 8,
				skip: 0,
				current: 0,
				banners: [{
					id: 1,
					url: '/static/images/banner.jpg'
				}, {
					id: 2,
					url: '/static/images/banner.jpg'
				}, {
					id: 3,
					url: '/static/images/banner.jpg'
				}],
				circular: true, // 无缝滚动
				autoplay: true,
				imageHeights: [],
				current: 0,
				likesScaleHeight: 0,
				scaleHeight: 0,
				route: '',
				showToTop: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			}
		},
		computed: {
			books: function() {
				return this.$store.state.books
			},
			likeBooks: function() {
				return this.$store.state.likeBooks
			},
			newBooks: function() {
				return this.$store.state.newBooks
			},
			isOver: function () {
				return this.$store.state.isOver
			}
		},
		methods: {
			lower: function(e) {
				console.log('low')
			},
			goReading(_id) {
				uni.navigateTo({
					url: '/pages/read/read?_id=' + _id
				})
			},
			// 换一换
			async refreshHandle() {
				this.skip += 8;
				await this.getBookList();
				// 数据库的书已经光了...
				if(this.isOver){
					this.skip = 0
					await this.getBookList();
					this.$store.commit('SETISOVER',false)
				}
			},
			async getBookList() {
				uni.showLoading({
					title: "加载中..."
				})
				// 读取数据库中的书籍
				await this.$store.dispatch('SETBOOKS', {
					skip: this.skip,
					limit: this.limit
				})
				uni.hideLoading()
			},
			changeHandle(e) {
				this.current = e.detail.current;
			},
			async loadHandler(e) {
				const _this = this
				const query = uni.createSelectorQuery()
				await query.select('.swiper-item').boundingClientRect(data => {
					// 缩放后的高度
					if (data) {
						_this.scaleHeight = data.height + 20
					}
				}).exec()
			},
			async loadLikesHandler(e) {
				const _this = this
				const query = uni.createSelectorQuery()
				await query.select('.hot .swiper-item').boundingClientRect(data => {
					// 缩放后的高度
					if (data) {
						_this.likesScaleHeight = data.height
					}
				}).exec()
			},
			goTopHandle() {
				// 回到顶部
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				})
			},
			scrollHandle(event) {
				this.old.scrollTop = event.detail.scrollTop
				if (event.detail.scrollTop > 666) {
					this.showToTop = true
				} else {
					this.showToTop = false
				}
			},
			// toRanking() {
			// 	uni.navigateTo({
			// 		url: "/pages/ranking/ranking"
			// 	})
			// },
			toBoys() {
				uni.navigateTo({
					url: "/pages/boys/boys"
				})
			},
			toGirls() {
				uni.navigateTo({
					url: "/pages/girls/girls"
				})
			},
			toBookStall() {
				uni.navigateTo({
					url: "/pages/bookstall/bookstall"
				})
			}
		},
		onShow() {},
		onLoad: function() {
			const pages = getCurrentPages()
			const ins = pages[pages.length - 1]
			const route = ins.route
			this.route = route
		}
	}
</script>

<style scoped>
	.hot image {
		// 预设尺寸,防止网络加载慢,scroll-view计算错误
		min-height: 240rpx;
	}
	
	.bookstall {
		width: 76rpx;
		height: 76rpx;
		margin-bottom: 8rpx;
	}

	.active {
		transform: scale(1.3);
		transform: translateZ(-100px);
	}

	.active .name {
		transform: translateZ(-100px);
	}

	.page {
		padding: 0 38rpx 40rpx;
	}

	.header {
		border-bottom: 1px solid #e8e8e8;
		margin-top: 142rpx;
	}

	.swiper-item {
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
	}

	.swiper-item .name {
		margin-top: 10rpx;
	}

	swiper-item {
		border-radius: 3rpx;
		overflow: hidden;
	}

	.likes {
		padding-left: 15rpx;
		padding-right: 15rpx;
	}

	.likes .name {
		text-align: center;
		padding: 0 15rpx;
	}

	.swiper image {
		width: 100%;
		height: auto;
		border-radius: 3rpx;
	}

	.hot .swiper image {
		width: 180rpx !important;
		transition: .3s;
	}

	.swiper-item {
		display: flex;
		justify-content: space-around;
		perspective: 1000px;
		transform-style: preserve-3d;
	}

	.menu {
		display: flex;
		justify-content: space-evenly;
		margin-top: 30rpx;
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.menu-item text {
		font-size: 30rpx;
		line-height: 36rpx;
		margin-top: 22rpx;
	}

	.menu-item:nth-child(1) .iconfont {
		color: #ffd165;
	}

	.menu-item:nth-child(2) .iconfont {
		color: #70bcf8;
	}

	.menu-item:nth-child(3) .iconfont {
		color: #fb848a;
	}

	.menu-item:nth-child(4) .iconfont {
		color: #96db8b;
	}

	.hot-title {
		font-size: 40rpx;
		color: #434343;
		line-height: 1;
	}

	.refresh {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.refresh label {
		font-size: 40rpx;
		margin-left: 10rpx;
	}

	.hot .scroll__area {}

	.hot .scroll-view-item {
		padding: 33rpx 0;
		display: flex;
		align-items: center;
	}

	.hot .cover {
		width: 160rpx;
		height: auto;
	}

	.hot .info {
		margin-left: 40rpx;
	}

	.hot .info-title {
		color: #14151a;
		font-size: 30rpx;
		margin-bottom: 15rpx;
	}

	.hot .info-author {
		margin-bottom: 20rpx;
	}
</style>
