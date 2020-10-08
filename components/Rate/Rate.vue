<template>
	<view class="rate" :class="val">
		<block v-for="i in times" :key="i">
			<text class="iconfont" :style="{ color: (i <= value ? color : '#dde1e4'),fontSize: fontSize, margin: marginR }" @tap="tapHandle(i)">&#xe64c;</text>
		</block>
	</view>
</template>

<script>
	export default {
		props: ["value", "color", "size", "gap"],
		computed: {
			fontSize() {
				return this.size || "40rpx"
			},
			marginR() {
				return this.gap || 0
			}
		},
		data() {
			return {
				times: [1, 2, 3, 4, 5]
			};
		},
		methods: {
			tapHandle(val) {
				this.$emit('goto',val)
			}
		}
	}
</script>

<style scoped>
	.iconfont {
		font-size: 40rpx;
		color: #dde1e4;
		/* color: #72767f; */
	}
</style>
