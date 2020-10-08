<template>
	<view class="page__wrap">
		<view class="star" v-if="value">
			<uni-rate :value="value" :disabled="true" active-color="#FC6337" margn="5"></uni-rate>
		</view>
		<view class="comment">
			 <textarea :placeholder="placeholder" maxlength="-1" :focus="true" @input="inputHandle"/>
		</view>
		<button @tap="publishHandle">发表</button>
	</view>
</template>

<script>
	let finished = true
	
	export default {
		data() {
			return {
				value: 0,
				name: '',
				_id: '',
				comment: ''
			}
		},
		computed: {
			placeholder() {
				return `点评《${this.name}》...`
			}
		},
		methods: {
			inputHandle(e) {
				const value = e.detail.value
				this.comment = value
			},
			async publishHandle() {
				if(!finished) return
				finished = false
				const res = await wx.cloud.callFunction({
					name: 'msgsec',
					data: {
						msg: this.comment
					}
				})
				if(res.result.errCode === 87014) {
					uni.showToast({
					    title: '注意，当前内容违规，请修改后重试',
						icon: 'none',
						duration: 2000
					});
					return
				}
				
				// 内容合法，添加到 comments 集合中
				if(res.result.errCode === 0) {
					uni.showLoading({
						title: '加载中...'
					})
					const { nickName,avatarUrl,gender } = this.$store.state.userInfo
					const res = await wx.cloud.callFunction({
						name: 'addComment',
						data: {
							_id: this._id,
							msg: this.comment,
							value: this.value,
							nickName,
							avatarUrl,
							gender
						}
					})
					uni.hideLoading()
					const _this = this
					this.$store.commit('PUBLISH_SUCCESS',true)
					// 发布成功，重新加载数据
					await this.$store.dispatch('GETCOMMENTS',{
						_id: this._id
					})
					uni.showToast({
						title: '发表成功',
						success() {
							setTimeout(()=>{
								finished = true
								uni.navigateBack()
							},1500)
						}
					})
				}
			}
		},
		onLoad(opt) {
			const { val,_id,name } = opt
			this._id = _id
			this.name = decodeURIComponent(name)
			this.value = val
		}
	}
</script>

<style scoped>
.star {
	padding: 30rpx 0;
	display: flex;
	justify-content: center;
	border-bottom: 1px solid #e6e6e6;
}

.comment {
	padding: 30rpx 0;
	flex: 1;
}

.comment textarea {
	width: 100%;
	height: 100%;
	line-height:1.5;
}

button {
	width: 80%;
	background: #FC6337;
	color: #fff;
}

.page__wrap {
	padding: 0 38rpx 30rpx;
	display: flex;
	flex-direction: column;
	height: 100vh;
}
</style>
