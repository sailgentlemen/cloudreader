<template>
	<view class="page__wrap" v-if="userInfo">
		<!-- 编辑工具 -->
		<view v-if="isNoBooks" class="edit_tools" :class="{edit_false: !edit}">
			<view v-if="!edit"></view>
			<view v-if="!edit"></view>
			<view v-if="!edit" @tap="editHandle">编辑</view>
			<view class="edit_area" v-if="edit">
				<view style="text-align:left" @tap="selectedAllHandle">{{tip}}</view>
				<view style="text-align:center" @tap="deleteHandle">删除({{count}})</view>
				<view style="text-align:right" @tap="finishedHandle">完成</view>
			</view>
		</view>
		<!-- 书籍 -->
		<scroll-view v-if="isNoBooks" scroll-y="true" style="height: cald(110vh - 90rpx);" @scroll="scrollHandle" :scroll-with-animation="true"
		 :scroll-top="scrollTop">
			<view class="books">
				<view @tap="tapHandle(index,book)" class="book" :key="book._id" v-for="(book,index) in booksList">
					<view class="pic" v-if="book.bookName !== 'placeholder'">
						<image mode="widthFix" :src="book.cover"></image>
						<view class="mask" v-if="edit && !book.selected"></view>
						<view class="selector_icon" v-if="edit">
							<image mode="widthFix" :src="book.selected ? '/static/images/selected-true.png': '/static/images/selected.png'"></image>
						</view>
					</view>
					<view class="name" v-if="book.bookName !== 'placeholder'">{{book.bookName}}</view>
				</view>
			</view>
		</scroll-view>
		<view class="no_books" v-if="!isNoBooks">
			<view class="pic_book"></view>
			<view>宁可食无肉，不可居无书，</view>
			<view>无肉令人瘦，无书令人俗。</view>
			<view class="go" @tap="goHandle">快去小书馆看看吧</view>
		</view>
		<uni-transition :mode-class="['slide-right']" :styles="{'position':'absolute','bottom': '15vh','right': '6vw'}" :show="showToTop">
			<ToTop @goTopHandle="goTopHandle" />
		</uni-transition>
	</view>
</template>

<script>
	export default {
		computed: {
			showNoResul() {
				return !this.$store.state.qsList.length && this.$store.state.typing
			},
			userInfo() {
				return this.$store.state.userInfo
			},
			count() {
				// 用户选中的书籍数量
				return this.booksList.filter(item => item.selected).length
			},
			tip() {
				return this.selectedAll ? '取消全选' : '全选'
			},
			isNoBooks() {
				return !!this.booksList.length
			}
		},
		data() {
			return {
				booksList: [],
				selectedAll: false,
				edit: false,
				showToTop: false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				mockBooks: []
			}
		},
		methods: {
			goReading(_id){
				uni.navigateTo({
					url: '/pages/read/read?_id=' + _id
				})
			},
			async removeBooksFromBookcases(books) {
				uni.showLoading({
					title: "加载中..."
				})
				const res= await wx.cloud.callFunction({
					name: 'removeFromBookcase',
					data: {
						books
					}
				})
				uni.hideLoading()
			},
			async getBookcases() {
				uni.showLoading({
					title: "加载中..."
				})
				const res = await wx.cloud.callFunction({
					name: 'getBookcases'
				})
				uni.hideLoading()
				if(res.result.data[0].bookrack.length) {
					const booksList = res.result.data[0].bookrack
					if(3 - booksList.length % 3) {
						const num = 3 - booksList.length % 3;
						for(var i = 0;i<num;++i) {
							booksList.push({
								_id: i,
								bookName: 'placeholder'
							})
						}
					}
					// 添加响应式属性
					this.booksList = booksList.map(book => {
						this.$set(book,'selected',false)
						return book
					})
				}
			},
			async deleteHandle() {
				if(!this.count) return
				const books = this.booksList.filter(item => item.selected && item.bookName !== 'placeholder')
				await this.removeBooksFromBookcases(books)
				this.selectedAll = false
				this.booksList = this.booksList.filter(item => !item.selected);
				if(3 - this.booksList.length % 3) {
					const num = 3 - this.booksList.length % 3;
					for(var i = 0;i<num;++i) {
						this.booksList.push({
							_id: i,
							bookName: 'placeholder',
							selected: false
						})
					}
				}
				if (this.booksList.every(book => book.bookName === 'placeholder')) {
					this.edit = false;
					this.booksList = [] // 置空
				}
			},
			selectedAllHandle() {
				if (!this.booksList.length) return;

				if (!this.selectedAll) {
					this.booksList = this.booksList.map(item => {
						if(item.bookName !== 'placeholder') {
							item.selected = true;
						}
						return item;
					})
					this.selectedAll = true
				} else {
					this.booksList = this.booksList.map(item => {
						if(item.bookName !== 'placeholder') {
							item.selected = false;
						}
						return item;
					})
					this.selectedAll = false
				}
			},
			finishedHandle() {
				this.edit = false;
				this.booksList.forEach(book => book.selected = false)
			},
			editHandle() {
				if (!this.booksList.length) return
				this.edit = true;
			},
			async getBook(_id) {
				return await wx.cloud.callFunction({
					name: 'getBook',
					data: {
						_id
					}
				})
			},
			async tapHandle(index,book) {
				if (book.bookName === 'placeholder') {
					return
				} else if(!this.edit) {
					//小说列表不存在该书籍
					// const match = this.$store.state.books.find(item => item._id === book._id)
					// if(!match){
						
					// 	uni.showLoading({
							
					// 	})
					// 	const res = await this.getBook(book._id)
					// 	if(res.result.data) {
					// 		const book = res.result.data
					// 		// 将书架中不存在的小说追加到store的boos中
					// 		this.$store.commit('ADDBOOK',book)
					// 	}
					// 	uni.hideLoading()
					// }
					this.goReading(book._id)
					return
				}else {
					this.selectedAll = false
					this.booksList[index].selected = !this.booksList[index].selected;
					if(this.booksList.filter(book => book.bookName !== 'placeholder').every(book => book.selected === true)) {
						this.selectedAll = true
					}
					// const value = !this.mockBoo ks[index].selected;
					// this.$set(this.mockBooks[index],'selected',value);
				}
			},
			goHandle() {
				uni.switchTab({
					url: '/pages/bookmall/bookmall'
				})
			},
			goTopHandle() {
				// 回到顶部
				this.scrollTop = 0
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
			}
		},
		onShow() {
			if (this.userInfo) {
				this.getBookcases();
			} 
		},
		onHide() {
			if(this.edit) {
				this.edit = false
			}
		},
		onLoad: async function() {
			if (!this.userInfo) {
				uni.reLaunch({
					url: "/pages/login/login"
				})
				return;
			}
			uni.showLoading({
				title: '加载中'
			})
			this.$store.commit('typing', false) // 请求结束后
			this.$store.commit('qsList', [])
			await this.$store.dispatch("qsList")
			uni.hideLoading()
		}
	}
</script>

<style scoped>
	.edit_false {
		display: flex;
		justify-content: space-evenly;
		text-align: right;
	}

	.edit_false view {
		width: 185rpx;
	}

	.edit_tools,
	.books {
		padding: 0 40rpx;
	}

	.books {
		margin-top: 25rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		padding-top: 90rpx;
		/* padding-bottom: 90rpx; */
	}

	.book {
		width: 185rpx;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.book .pic {
		position: relative;
		/* 消除图片底部的幽灵空白 */
		display: flex;    
	}

	.mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .3);
		z-index: 9999;
	}

	.selector_icon {
		position: absolute;
		right: 10rpx;
		bottom: 30rpx;
		width: 25rpx;
		height: 25rpx;
	}

	.edit_tools {
		background: #f8f8f8;
		line-height: 90rpx;
		position: absolute;
		top: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 9999;
	}

	.edit_area {
		display: flex;
		justify-content: space-evenly;
	}

	.edit_area view {
		width: 185rpx;
	}

	.no_books {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		flex-direction: column;
		padding-top: 200rpx;
		color: #979797;
	}

	.go {
		padding: 10rpx 20rpx;
		background: #eff9f8;
		border-radius: 30rpx;
		color: #99d1c6;
		line-height: 1;
		margin-top: 40rpx;
	}

	.pic_book {
		width: 218rpx;
		height: 221rpx;
		margin-bottom: 20rpx;
		background: url(data:image/png;base64,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XnlEFQApazYAKetYtfojAWHmm3zf/0Q1tfxRSZJsHu8kJy6pBiD51h1eAUDKOlatfikgzrkbgiC4pppS8VFhGL7B87w7ieik8SgAUty+/1UCkLKOVatfAsj1xpgd1VTKj0qS5PXjneQ1+CxWef8ASAXPqgzJAHHOPRwEwWerjK8zJgzDTdm7W8wcGGMeqqrVh5Pp4tzzvjpZtcejxvWh6VXyad6dxpidjS1cSaEkSU5O03QWgJQ0DoCUNGwFl+/atWvj/Pz876u20IesYAdZfvVqvbisGgiMO9wBANJROFfDJZYG2AAIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwACQMTCpUEYgAAQDTkW6wGAABCxcGkQBiAAREOOxXoAIABELFwahAEIANGQY7EeAAgAEQuXBmEAAkA05FisBwCyjLXOuXODINgr5joRWWtdjv6ZxpiHJOcA7XwH4jg+1zl395TK1taJ86fbTIW19jQiemySGjN/zPf9W5s52vIqAETS3ea0rbVXEdEXpyhuNsb8orkjTlZqDZAoik5k5v1TmtpljNku2TQAkXS3OW1r7QIRXTFJ0Tn3qiAI/tzcEXsASJIkG9I0PTilqfuMMWdLNg1AJN1tRvvmm28+dt26dT8holMmKXqed+xgMHiqmSNOV2ltB8mmYa39OxEdP2lKaZpeNxwOd0o1DkCknG1ON4qi7zDz+6YoHjDGvLS5I/YIkCiKbmLmq6dNiZnP9n3/PgkDAIiEq81pRlF0PjN/d5qic+7zQRB8vLmj9guQtzFzXvj/SETXG2N2N20CAGna0eb0oii6mJnvzFN0zr09CIL78+qaer7VS6xs0nEcP+qc21yggfuZ+ZbRaLRvOBz+tUB9bgkAybWo1YLsdalz7iQiutQ5l/sGDTM/5vv+G9ucZOuAWGu3EdEdZZpk5gPOuT+UGTOhdkuOBu6BNGByQYlXE9EJBWsXyy4xxuTuMiU1p5a3Dkg2G2vtPUR0TpONQEu9A3uNMee23WUngERRdAYzP0BEx7TdMI63Ih141jm3NQiCn7Y9+04AGe8i2Y2g7IYQHnAgz4E5Y8yX84oknu8MkKyZMAx3ep53rURj0NThgPS9sTyXOgVkvJOcxcx3O+fW5U0Wz68eB5j5386584wxD3bZdeeAZM0vLCxsGo1G1+OFe5dR6NWx987MzHx6bm5uX9ez6gUgiyZkbwEz8/aC90m69g7Hb9iB7D6Hc+7Wtt/KndZGrwBZnGgURdlbwM/9Yebs/XI8lDrgnPsTEWXfA9or/X2gKhb2EpCljSRJsv7QoUOznucdR0QbqjSJMb1z4Kk0TZ9Ys2bNk4PB4OnezW7JhHoPSJ/Nw9z0OwBA9K8xOqzhAACpYR6G6ncAgOhfY3RYwwEAUsM8DNXvAADRv8bosIYDAKSGeRiq3wEAon+N0WENBwBIDfMwVL8DAET/GqPDGg4AkBrmYah+BwCI/jVGhzUc+C/neLZ9UD0DggAAAABJRU5ErkJggg==) no-repeat;
		background-size: contain;
	}
</style>
