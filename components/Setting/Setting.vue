<template>
	<view class="setting__bar">
		<view class="catelog item">
			<view class="font" @click="catalogClick"><text class="iconfont">&#xe601;
				</text><text>目录</text></view>
			<view class="catalog" v-if="showCatalog">
				<Popup :popScrollTop="popScrollTop" @destroyPop="setPopScrollTop" @sortHandle="sortHandle"
				 :popupclosed="popupclosed" @popupanimationend="popupanimationend">
					<template v-slot:title>
						{{book.bookName}}
					</template>
					<template v-slot:author>
						{{book.bookAuthor}}
					</template>
					<template v-slot:chapters>
						章节数: {{count}}章
					</template>
					<template v-slot:list>
							<view :class="{current: active === index }" class="scroll-view-item" v-for="(item,index) in contents" :key="item._id"
							 @tap="skipHandle(index,item._id)">{{item.title}}</view>
					</template>
				</Popup>
			</view>
		</view>
		<view class="setting item">
			<view class="font" @tap="setThemeHandle"><text class="iconfont">&#xe60d;
				</text><text>设置</text></view>
			<uni-transition :styles="{'position':'absolute','top': '-217%','width': '100vw','left': 0, 'zIndex': 666}" :show="showConfigs"
			 :mode-class="['slide-bottom']">
				<ConfigBar />
			</uni-transition>
		</view>
		<view class="join__bookrack item" :class="{ existing: isExisting }" @tap="addToBookrack">
			<view class="font"><text class="iconfont">&#xe60a;
				</text><text>{{msg}}</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			contents: {
				type: Array,
				default: []
			},
			currentIndex: {
				type: Number,
				default: 0
			},
			book: {
				type: Object,
				default: null
			},
			scroll: {
				type: Boolean,
				default: false
			},
			pageScroll: {
				type: Object
			},
			isBottom: {
				type: Boolean,
				default: false
			}
		},
		created() {

		},
		data() {
			return {
				popScrollTop: 0,
				reverse: false, // false 为正序， true 为倒序
				skip: 0,
				popupclosed: false,
				showSetBar: false,
				loginSuccess: false, //用户第一次授权登陆
				isExisting: false // 书本是否已被添加到书架中
			};
		},
		watch: {
			agree(res) {
				// 用户同意加入书桌
				if(res) {
					// res 为 true 才添加
				 this.addToBookrack()
				}
			},
			loginSuccess(res) {
				if (res) {
					// 登陆成功后，添加到书架
					this.addToBookrack()
				}
			},
			userInfo() {
				// 登录成功后,查看书架
				this.checkBookrack(this.userInfo.bookrack)
			}
		},
		computed: {
			count() {
				return this.contents.length
			},
			agree() {
				return this.$store.state.agree
			},
			active() {
				// 优化正序倒叙激活状态
				return !this.reverse ? this.currentIndex : this.count - 1 - this.currentIndex
			},
			showCatalog() {
				return this.$store.state.showCatalog
			},
			showConfigs() {
				return this.$store.state.showConfigs
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			msg() {
				return this.isExisting ? '已加入书桌' : '加入书桌'
			}
		},
		methods: {
			setPopScrollTop(res) {
				this.popScrollTop = res
			},
			async pushHandle() {
				uni.showLoading({
					title: "加载中..."
				})
				this.skip += 1000;
				await this.getCatalogs()
				uni.hideLoading()
			},
			skipHandle(i, _id) {
				// 是否最后一章
				let isOver;
				if (this.count !== 0) {
					isOver = i === this.count - 1
				}
				if (this.reverse) {
					// 倒序
					const index = this.count - 1 - i
					
					this.$emit('skip', {
						index,
						isOver
					})
				} else {
					// 正序
					this.$emit('skip', {
						index: i,
						isOver
					})
				}
				this.$store.commit('showCatalog', false)
			},
			getCatalogs() {

			},
			checkBookrack(books) {
				if (!this.book) return
				const match = books.find(book => book._id === this.book._id);
				if (match) {
					this.isExisting = true
					this.$emit('isExistingBook', true)
				}
			},
			async moveFromBookrack() {
				uni.showLoading()
				const res = await wx.cloud.callFunction({
					name: 'moveFromBookrack',
					data: {
						book: this.book
					}
				})
				uni.hideLoading()

				if (res.result.stats.updated > 0) {
					uni.showToast({
						title: '移出成功'
					})
					this.isExisting = false
				}
			},
			async addToBookrack() {
				const _this = this
				if (!this.userInfo && !this.loginSuccess) {
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return;
				}
				if (this.isExisting) {
					const msg = `是否将《${this.book.bookName}》移出书桌 ？`
					// 从书架中删除
					uni.showModal({
						title: '移出书桌',
						content: msg,
						confirmText: '移出',
						success(res) {
							if (res.confirm) {
								// 移出
								_this.moveFromBookrack()
							}
						}
					})
					return
				}

				// 添加到书架
				uni.showLoading({
					title: "加载中..."
				})
				
			
				const book = Object.assign({},this.book)
				delete book.contents
				
				const res = await wx.cloud.callFunction({
					name: "addToBookrack",
					data: {
						book
					}
				})
				uni.hideLoading()
				if (res.result.stats.updated > 0) {
					this.isExisting = true
					this.$emit('isExistingBook', true)
					uni.showToast({
						title: '添加成功'
					})
					// 添加成功后，重置状态
					this.$store.commit('SETAGREE', false)
				}
			},
			sortHandle() {
				this.reverse = !this.reverse
				this.$emit('sort')
				this.popScrollTop = 0
			},
			changeStepsHandle(e) {
				// 设置字体
				console.log(e)
			},
			setThemeHandle() {
				if (this.showCatalog) {
					this.$store.commit('showCatalog', false)
				}
				this.$store.commit('showConfigs', !this.showConfigs)
			},
			popupanimationend(payload) {
				this.$store.commit('showCatalog', !this.showCatalog)
				this.popupclosed = payload
			},
			catalogClick() {
				if (this.showConfigs) {
					this.$store.commit('showConfigs', false)
				}
				// 弹出目录
				if (!this.showCatalog) {
					this.$store.commit('showCatalog', !this.showCatalog)
				} else {
					this.popupclosed = true
				}
			}
		}
	}
</script>

<style scoped>
	.current {
		color: var(--yyd-color-primary);
	}

	.setting__bar {
		display: flex;
		background: var(--yyd-bgcolor-configbar);
		border-top: 1px solid var(--yyd-color-settings-border);
		justify-content: space-evenly;
		align-items: center;
		padding: 36rpx 0 27rpx 0;
		font-size: 24rpx;
		position: relative;
	}

	/* 入场动画 */
	.animation__slide_in {
		transform: translateY(0); // 移入视图
		opacity: 1;
	}

	/* 离场动画 */
	.animation__slide_out {
		transform: translateY(100%);
		opacity: 0;
	}

	/* .setting__bar .catalog,.setting__bar .setting {
		position: relative;
		z-index: 999;
	} */

	.catalog .scroll-view-item {
		height: 132rpx;
		border-top: 1px solid #dbdbdb;
		display: flex;
		align-items: center;
	}

	.setting__bar .item .font {
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		align-items: center;
	}

	.setting__bar .iconfont {
		font-size: 40rpx;
	}

	.setting__bar .join__bookrack {
		position: relative;
	}

	.setting__bar .join__bookrack .getUserInfo {
		position: absolute;
		width: 110%;
		height: 110%;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.setting__bar .join__bookrack .getUserInfo button {
		height: 100%;
	}

	.setting__bar .join__bookrack .font {
		flex-direction: row;
		background: #FC6337;
		color: #fff;
		border-radius: 60rpx;
		justify-content: center;
		flex-grow: 0;
		line-height: 77rpx;
		padding: 0 20rpx;
	}

	.setting__bar .existing .font {
		background: var(--yyd-bookrack-bgcolor);
		color: var(--yyd-bookrack-color);
	}

	.setting__bar .join__bookrack .iconfont {
		margin-right: 5rpx;
	}

	.item {
		color: var(--yyd-color-settings-color);
	}
</style>
