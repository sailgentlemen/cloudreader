<template>
	<view :class="{ wrap: isDark }">
	<view class="page__wrap" :class="theme" v-if="book">
		<scroll-view :scroll-y="!enableScroll" style="height: 100vh;" @scrolltolower="pageOnEarth" @scroll="scrollHanlde"
		 :scroll-top="scrollTop" class="scrollview">
			<view class="page">
				<view class="book__preview" v-if="!hideBookInfo">
					<view class="book__abstract">
						<view class="pic">
							<image :src="book.cover" mode="widthFix"></image>
						</view>
						<view class="book__info">
							<view class="book__title">
								{{book.bookName}}
							</view>
							<view class="book__author">
								{{book.bookAuthor}}
							</view>
							<view class="abstract line2">
								{{book.bookDescription}}
							</view>
							<view class="book__update">最后更新：{{book.bookLastupdate}}</view>
						</view>
					</view>
					<view class="book__view">
						<view class="grade" v-if="!!socre">
							<view class="partial rate">
								<view class="figure">{{socre}}</view>
								<view class="start">
									<uni-rate :disabled="true" :value="socre/2" active-color="#6d6e80" margn="5"></uni-rate>
								</view>
							</view>
							<view class="partial">
								{{commentList.length}}人点评
							</view>
						</view>
						<view class="book__view__count" v-if="false">
							<view class="partial">
								<text class="figure">1.5</text><text>万人</text>
							</view>
							<view class="partial">
								在此读书
							</view>
						</view>
					</view>
					<view class="book__commend" v-if="commentList.length">
						<block v-for="item in comments">
							<view class="partial heading">
									<view class="user-msg">
										<view class="avatar">
											<image :src="item.avatarUrl"
											 mode="widthFix"></image>
										</view>
										 <view class="name">
										 	{{item.nickName}}
										 </view>
									</view>
									<view class="start">
										<text>点评</text>
										<view class="font">
											<uni-rate :disabled="true" :value="item.value" size="16" active-color="#FC6337" margn="5"></uni-rate>
										</view>
									</view>
								</view>
								<view class="partial">
									<text class="commend__content line3">{{item.comment_msg}}</text>
								</view>
								<view class="partial" v-if="commentList.length > 1">
									<navigator url="/pages/commentlist/commentlist">
										查看更多点评 >
									</navigator>
								</view>
							</block>
					</view>
					<view class="to__give__a__mark">
						<view class="msg">{{isComment}}</view>
						<view class="start">
							<view class="font" v-if="rerender">
								<uni-rate :disabled="!!publish_success" :value="grade_value" ref="rate" @change="gradeHandle" active-color="#FC6337" margn="5"></uni-rate>
							</view>
						</view>
					</view>
				</view>
				<view class="book__content">
					<Reader :finished="finished" :hideBookInfo="hideBookInfo" @previous="previousHandle" @next="nextHandle" @tapHandle="tapHandle" :matter="content" />
				</view>
			</view>
		</scroll-view>
		<uni-transition :styles="{'position': 'absolute','bottom': '0','width': '100%'}" :mode-class="['slide-bottom']" :show="showSetting">
			<Setting @sort="sortHandle" :currentIndex="skip" @count="getCount" @isExistingBook="addRecords" @skip="skipHandle" :contents="contents" :book="book" :isBottom="isBottom" :scroll="showSetting"
			 @catalog="catalogHandle"></Setting>
		</uni-transition>
		<uni-transition :styles="{'position': 'absolute','bottom': '40vh','right': '10rpx'}" :mode-class="['slide-right']" :show="showSetting && !showCatalog">
			<view class="share">
				<image mode="widthFix" src="/static/images/share.png"></image>
				<button open-type="share" class="share_btn"></button>
			</view>
			<view class="top" @tap="goTopHandle">
				<image mode="widthFix" src="/static/images/top.png"></image>
			</view>
		</uni-transition>
	</view>
	</view>
</template>
<script>
	import _ from 'lodash'

	export default {
		data() {
			return {
				rerender: true,
				grade_value: 0,// 书评评分
				contents: [], // 小说内容集
				count: 0, // 故事的章节数
				finished: false, // 故事结束。
				joinInTheBookcases: false, // 是否加入书架
				_id: '',
				content: null,
				skip: 0,
				book: '',
				val: 0, // 评分
				isBottom: false, // 到达底部
				enableScroll: false, // 禁止页面滚动
				oldScrollTop: 0,
				limitDistance: 50,
				scrollTop: 0, // 下次进入页面不会回到顶部
				old: {
					scrollTop: 0
				},
				refreshScrollTop: 0
			}
		},
		computed: {
			socre:function() {
				if(this.$store.state.commentList.length) {
					const sum =  this.$store.state.commentList.reduce((sum,item) => {
						return +item.value + sum
					},0)
					return  (sum  * 2 / this.$store.state.commentList.length).toFixed(1)
				}else{
					return 0
				}
			},
			commentList: function() {
				// 用户评论列表
				return this.$store.state.commentList
			},
			publish_success: function() {
				return this.$store.state.publish_success
			},
			comments: function(){
				// 只读取一条
				return this.commentList.slice(0,1)
			},
			isComment: function() {
				return '轻点评分'
			},
			isDark:function() {
				return this.$store.state.theme === "dark"
			},
			decline:function() {
				return this.$store.state.decline
			},
			theme:function() {
				return this.$store.state.theme
			},
			showCatalog:function() {
				return this.$store.state.showCatalog
			},
			showSetting:function() {
				return this.$store.state.showSettings
			},
			hideBookInfo:function() {
				return this.skip !== 0
			},
		},
		created() {
			this.scrollHanlde = _.throttle(this.pageOnScroll, 30)
		},
		methods: {
			gradeHandle(e) {
				const { value } = e
				// 禁止用户再次点击
				this.grade_value = value
				// 写书评
				this.gotoComment(value)
			},
			sortHandle() {
				// 倒叙
				this.contents = this.contents.reverse()
			},
			async addRecords(res) {
				// 已加入书架，获取用户记录渲染数据
				this.joinInTheBookcases = res
				const match = this.$store.state.userInfo.bookrack.find(book => book._id === this._id)
				if (match) {
					const {
						skip,
						scrollTop
					} = match.records
					if (skip === 0) {
						await this.getContent()
						this.scrollTop = scrollTop
					} else {
						this.skip = skip
						this.refreshScrollTop = scrollTop // 用户的滚动记录
					}
				}
			},
			async getUserInfo() {
				await this.$store.dispatch('userInfo')
			},
			async skipHandle(payload) {
				this.refreshScrollTop = 0
				// 点击章节目录跳转到对应内容
				const {
					index,
					isOver
				} = payload
				this.finished = isOver
				this.skip = index
			},
			async nextHandle() {
				if(this.skip === this.count - 1) {
					return
				}
				this.refreshScrollTop = 0
				this.skip += 1
			},
			async previousHandle() {
				if(this.skip === 0) return
				this.refreshScrollTop = 0
				this.skip -= 1
			},
			goTopHandle() {
				this.play = true
				// 回到顶部
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
					this.$store.commit('showSettings',false)
				})
			},
			async getContent(_id) {
				uni.showLoading({
					title: "加载中..."
				})
				const params = this.book.contents[this.skip]
				const res = await wx.cloud.callFunction({
					name: 'getContent',
					data: {
						...params
					}
				})

				uni.hideLoading()

				this.content = res.result
			},
			gotoComment(val) {
				if(!this.$store.state.userInfo) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
				// 去点评
				if (val) {
					this.val = val
					uni.navigateTo({
						url: '/pages/comment/comment?val=' + val + '&_id=' + this.book._id + '&name=' + encodeURIComponent(this.book.bookName)
					})
				}
			},
			tapHandle() {
				this.$store.commit('showSettings', !this.showSetting)
			},
			rollbackHandle(res) {
				this.scroll = res
				this.$store.commit('showSettings', false)
			},
			catalogHandle(res) {
				this.enableScroll = res
			},
			pageOnEarth() {
				this.$store.commit('showSettings', true)
				this.isBottom = true
			},
			pageOnScroll(res) {
				this.old.scrollTop = res.detail.scrollTop
				if (this.isBottom && this.showSetting) {
					if (this.oldScrollTop - res.detail.scrollTop > this.limitDistance) {
						this.$store.commit('showSettings', false)
						this.isBottom = false
					}
					return;
				}
				this.isBottom = false
				this.$store.commit('showSettings', false)
				this.oldScrollTop = res.detail.scrollTop
			},
			addBookRecords() {
				wx.cloud.callFunction({
					name: 'addBookRecords',
					data: {
						_id: this._id,
						skip: this.skip,
						scrollTop: this.old.scrollTop
					}
				})
			},
			async getBook(_id) {
				return await wx.cloud.callFunction({
					name: 'getBook',
					data: {
						_id
					}
				})
			},
			async checkUserComment() {
				// 检查用户是否已经发表过评论
				const res = await wx.cloud.callFunction({
					name: 'checkComment',
					data: {
						_id: this.book._id
					}
				})
				
				if (res.result.list[0] && res.result.list[0].comments.length) {
					 this.grade_value = res.result.list[0].comments[0].value
					 this.$store.commit('PUBLISH_SUCCESS',true)
					 this.rerender = false;
					 this.$nextTick(() => {
						 // 重新渲染组件，触发 rate 的 created 生命周期
					 	this.rerender = true
					 })
				}else{
					// 点击评分
					this.$store.commit('PUBLISH_SUCCESS',false)
				}
			},
			async getComments() {
				const data = {
						_id: this.book._id
					}
				await this.$store.dispatch('GETCOMMENTS',data)
			}
		},
		watch: {
			async book(res) {
				// 评论列表
				await this.getComments()
				// 检查当前用户评分
				await this.checkUserComment()
				this.count = res.contents.length
				this.contents = this.book.contents.slice()
			},
			showSetting: function(current) {
				if (!current) {
					this.$store.commit('showCatalog', false)
					this.$store.commit('showConfigs', false)
				}
			},
			async skip() {
				// 关闭 setting bar
				this.$store.commit('showSettings',false)
				
				await this.getContent()
				if(this.skip === this.count - 1) {
					// 故事的终章
					this.finished = true
				} else {
					this.finished = false
				}
				if (this.refreshScrollTop === 0) {
					this.goTopHandle()
				} else {
					// 跳转到用户上一次滚动位置
					this.scrollTop = this.refreshScrollTop
				}
			}
		},
		onShareAppMessage() {
			// 小程序分享
			return {
				title: `分享一本好书《${this.book.bookName}》,快来和我一起看看`,
				path: `/pages/read/read?_id=${this.book._id}`,
				imageUrl: this.book.cover,
				desc: '快来跟我一起看小说',
				success() {
					uni.showToast({
						title: '分享成功'
					})
				},
				fail(res) {
					console.log('分享失败',res)
				}
			}
		},
		onLoad: async function(opt) {
			// 设置暗黑模式
			if (this.$store.state.theme === 'dark') {
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#000000',
					success(res) {
						console.log(res)
					},
					fail(res) {
						console.log(res)
					}
				})
			}
			
			uni.showLoading({
				title: "加载中..."
			})
			this._id = opt._id

			// 获取当前小说信息
			const res = await this.getBook(opt._id)
			if (res.result.data) {
				const book = res.result.data
				this.book = book
			}
			
			// 同步用户书桌信息
			await this.getUserInfo()
			
			// 用户已登录，但小说不在书架中,读取第一章内容
			if (this.$store.state.userInfo) {
				if (!this.$store.state.userInfo.bookrack.find(book => book._id === opt._id)) {
				await this.getContent();
				}
			} else {
				// 用户没登录
				await this.getContent();
			}
		},
		onReachBottom() {

		},

		onPageScroll(res) {

		},

		onHide() {

		},

		onUnload() {
			// 离开页面，将状态重置
			this.$store.commit('PUBLISH_SUCCESS',false)
			this.$store.commit('GETCOMMENTS',{result: {data: []}})
			
			const _this = this
			// 未加入书桌，但用户已经阅读了三章，提示他
			if(!this.joinInTheBookcases && this.skip > 2 && !this.decline) {
				uni.navigateTo({
					url: '/pages/read/read?_id=' + this._id,
					success() {
						// 重定向成功，提醒用户
						uni.showModal({
							title: "加入书桌？",
							content: "添加到书桌，下次看书更方便",
							cancelText: "狠心拒绝",
							confirmText: "加入书桌",
							confirmColor: "#FC6337",
							success(res) {
								if(res.cancel) {
									// 狠心拒绝
									_this.$store.commit('SETDECLINE',true)
								}
								
								if(res.confirm) {
									// 加入书桌
									_this.$store.commit('SETAGREE', true)
								}
							},
							fail(res) {
								console.log('fail',res)
							}
						})
					}
				})
			} else {
				// 用户离开
				this.$store.commit('SETDECLINE',false)
				this.$store.commit('SETAGREE', false)
			}
			
			// 优化离开页面忘记关闭settings
			if (this.$store.state.showSettings) {
				this.$store.commit('showSettings', false)
			}
			// 用户已登录，且放入了书架，记录用户的阅读位置和当前章节
			if (this.$store.state.userInfo && this.joinInTheBookcases) {
				this.addBookRecords()
			}
		}
	}
</script>

<style scoped>
	.grade {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.grade .rate {
		display: felx;
		align-items: center;
	}
	/* 暗黑模式背景优化 */
	.wrap {
		background: #000;
		min-height: 100vh;
	}
	
	.user-msg {
		display: flex;
		align-items: center;
	}
	
	.book__commend .heading {
		justify-content: space-between;
	}
	.share,.top {
		display: flex;
		width: 100%;
		margin-bottom: 40rpx;
		justify-content: center;
		position: relative;
	}
	
	.share_btn {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
		padding: 0;
	}
	
	.share image ,.top image{
		width: 60rpx;
	}
	
	.book__info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.abstract {
		max-width: 316rpx;
	}

	.scrollview {
		background: var(--yyd-bgcolor-page);
	}

	.enableScroll {}

	.book__preview {
		padding-top: 40rpx;
		padding: 30rpx 36rpx;
	}

	.book__abstract {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.book__abstract .pic {
		width: 312rpx;
		margin-right: 60rpx;
	}

	.book__abstract .book__title {
		font-size: 46rpx;
		color: var(--yyd-dark-color-title);
		line-height: 1.5;
	}

	.book__abstract .book__author {
		font-size: 30rpx;
		color: #FC6337;
		line-height: 90rpx;
	}

	.book__abstract .abstract {
		color: var(--yyd-dark-color-abstract);
		line-height: 1.4;
		margin-top: 7rpx;
	}

	.book__abstract .book__update {
		color: #94979c;
		margin-top: 12rpx;
	}

	.book__view {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		align-items: center;
	}

	.book__view .partial {
		display: flex;
		align-items: center;
		color: var(--yyd-dark-color-primary);
	}

	.dark .msg {
		color: var(--yyd-dark-color-primary);
	}

	.book__view .partial:first-child {
		margin-bottom: 10rpx;
	}

	.book__view .book__commend .partial:nth-child(2) {
		padding: 40rpx 0;
	}

	.book__view .figure,
	.book__view__count .figure {
		font-size: 50rpx;
		color: var(--yyd-dark-color-nums);
		margin-right: 30rpx;
	}

	.book__view__count .figure {
		margin-right: 12rpx;
	}

	.book__commend {
		margin-top: 60rpx;
		/* display: flex; */
		background: var(--yyd-dark-bgcolor-commend);
		border-radius: 30rpx;
		padding: 40rpx 48rpx;
	}

	.book__commend .avatar {
		width: 58rpx;
		margin-right: 28rpx;
	}

	.book__commend .avatar image {
		border-radius: 100%;
	}

	.book__commend .partial:first-child {
		display: flex;
		align-items: center;
	}

	.dark .book__commend .partial {
		color: var(--yyd-dark-color-primary);
	}

	.book__commend .start {
		display: flex;
		align-items: center;
		color: var(--yyd-dark-bgcolor-commend);
	}

	.book__commend .start text:first-child {
		margin-right: 10rpx;
	}

	.book__commend .name {
		margin-right: 10rpx;
		color: var(--yyd-dark-color-primary);
	}

	.book__commend .commend__content {
		margin-bottom: 30rpx;
		color: var(--yyd-dark-color-commend);
	}

	.to__give__a__mark {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 50rpx;
	}
</style>
