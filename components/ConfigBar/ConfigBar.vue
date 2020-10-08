<template>
	<view class="settings">
		<view class="fontSettings">
			<view style="font-size: 36rpx">A-</view>
			<view class="steps__wrap">
				<slider style="width: 80%;" :value="value" @change="sliderChange" activeColor="#FC6337" backgroundColor="#eaeaea"
				 block-color="#fff" block-size="18" step="20" />
			</view>
			<view style="font-size: 48rpx">A+</view>
		</view>
		<view class="darkSettings">
			<view class="sunshine" @tap="themeSunChange"></view>
			<view class="moonshine" @tap="themeMoonChange"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: 40
			};
		},
		mounted() {
			const class__str = `font-emphasis-${this.value}`
			this.$store.commit('themeFont',class__str)
		},
		methods: {
			sliderChange(e) {
				const class__str = `font-emphasis-${e.detail.value}`
				this.$store.commit('themeFont',class__str)
				this.value = e.detail.value
			},
			themeMoonChange() {
				this.$store.commit('theme','dark')
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
			},
			themeSunChange() {
				this.$store.commit('theme','light')
				uni.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: '#ffffff',
					success(res) {
						console.log(res)
					},
					fail(res) {
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.darkSettings {
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
	}
	
	.darkSettings view {
		border: 1rpx solid #eaeaea;
		font-size: 40rpx;
		padding: 10rpx 118rpx;
		border-radius: 8rpx;
	}
	
	.darkSettings .sunshine:before {
		content: "\1F31E";
	}
	
	.darkSettings .moonshine:before {
		content: "\1F31C";
	}
	
	.settings {
		background: var(--yyd-bgcolor-configbar);
		padding: 60rpx 0;
		border-top: 1px solid var(--yyd-border-configbar-color);
	}

	.fontSettings {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
	}

	.steps__wrap {
		flex: 1;
		display: flex;
		justify-content: center;
	}
</style>
