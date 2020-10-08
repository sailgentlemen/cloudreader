<template>
	<view class="weui-tabs">
		<view class="weui-tabs-bar__wrp">
			<scroll-view scroll-x="true" :scroll-into-view="current" :scroll-with-animation="animation">
				<view class="weui-tabs-bar__content">
					<block v-for="(item,index) in tabs" :key="item.title">
						<view :id="'item_' + index" @tap="handleTabClick(index)" class="weui-tabs-bar__item" :style="{BackgroundColor: tabBackgroundColor,color: (activeTab === index ? tabActiveTextColor: tabInactiveTextColor)}">
							<view :class="['weui-tabs-bar__title',tabClass,activeTab === index ? activeClass : '' ]" :style="{borderBottomColor: activeTab === index ? tabUnderlineColor : 'transparent'}">
								<text>{{item.title}}</text>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<swiper class="swiperClass" :current="activeTab" :duration="duration" @change="handleSwiperChange">
			<swiper-item v-for="(item,index) in tabs" :key="item.title">
				<view :class="'tab-content-'+index">
					<Comment v-if="index === 0" />
					<Star v-if="index === 1" />
				</view>
			</swiper-item>
		</swiper>
		<!-- 回复工具 -->
		<view class="reply_wrp" :style="{bottom: keyboardHeight + 'px'}">
			<view class="reply_tool">
				<view hover-class="active" class="reply_button replay_quick_button">
					<image src="/static/images/reply_tool_keyboard.svg" mode='aspectFit' class="reply_tool_pic"></image>
				</view>
				<view class="reply_form_wrp">
					<label for="" class="reply_label">
						<input class="reply_input" cursor-spacing="8px" confirm-type="send" :adjust-position="false" confirm-hold :value="comment"
						 :focus="focus" @blur="onBlur" @focus="onFocus" @input="onInput" @confirm="onConfirm" @keyboardheightchange="onkeyboardHeightChange" />
					</label>
				</view>
				<view hover-class="active" class="reply_button replay_emotion_button" @tap="showEmoji">
					<image src="/static/images/reply_tool_emoji.svg" mode='aspectFit' class="reply_tool_pic"></image>
				</view>
				<view hover-class="active" class="reply_button replay_media_button" @tap="showFunction">
					<image src="/static/images/reply_tool_add.png" mode='aspectFit' class="reply_tool_pic"></image>
				</view>
			</view>
			<view class="reply_panel_wrp" :style="{height: (emojiShow ? 300 : 200) + 'px'}" :hidden="!emojiShow && !functionShow">
				<view :class="['reply_panel',emojiShow ? 'show': '']" :hidden="!emojiShow">
					<!-- <mp-emoji source="{{emojiSource}}" class="mp-emoji" bindinsertemoji="insertEmoji" binddelemoji="deleteEmoji" bindsend="onsend"></mp-emoji> -->
				</view>
				<view :class="['reply_panel',emojiShow ? 'show': '']" :hidden="functionShow">
					<swiper :indicator-dots="true" indicator-color="#bbbbbb" indicator-active-color="#8c8c8c">
						<swiper-item>
							<view class="function_list">
								<view class="function_item" bindtap="chooseImage">
									<image src="/static/images/reply_function_image.svg" class="reply_function_pic"></image>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tabs: {
				type: Array,
				default: []
			},
			tabClass: {
				type: String,
				default: ''
			},
			swiperClass: {
				type: String,
				default: ''
			},
			activeClass: {
				type: String,
				default: ''
			},
			tabUnderlineColor: {
				type: String,
				default: '#FC6337'
			},
			tabActiveTextColor: {
				type: String,
				default: '#000000'
			},
			tabInactiveTextColor: {
				type: String,
				default: '#000000'
			},
			tabBackgroundColor: {
				type: String,
				default: '#ffffff'
			},
			activeTab: {
				type: Number,
				default: 0
			},
			swipeable: {
				type: Boolean,
				default: true
			},
			animation: {
				type: Boolean,
				default: true
			},
			duration: {
				type: Number,
				default: 500
			}
		},
		computed: {
			current() {
				return "item_" + this.currentView
			}
		},
		watch: {
			activeTab(_activeTab) {
				var len = this.tabs.length;
				if (len === 0) return;
				var currentView = _activeTab - 1;
				if (currentView < 0) currentView = 0;
				if (currentView > len - 1) currentView = len - 1;
				this.currentView = currentView
			}
		},
		data() {
			return {
				currentView: 0,
				lineHeight: 24,
				functionShow: false,
				emojiShow: false,
				comment: '',
				focus: false,
				cursor: 0,
				_keyboardShow: false,
				emojiSource: 'https://2972385488-1259813239.cos.ap-guangzhou.myqcloud.com/emoji.png',
				parsedComment: [],
				keyboardHeight: 0
			};
		},
		methods: {
			onkeyboardHeightChange(e) {
			    const {height} = e.detail
			    this.keyboardHeight = height || 0
				console.log(this.keyboardHeight)
			  },
			
			  hideAllPanel() {
				this.functionShow = false
				this.emojiShow = false
			  },
			  showEmoji() {
				this.functionShow = false
				this.emojiShow = this._keyboardShow || !this.emojiShow
			  },
			  showFunction() {
				this.functionShow = this._keyboardShow || !this.functionShow
				this.emojiShow = false
			  },
			  chooseImage() {},
			  onFocus() {
			    this._keyboardShow = true
			    this.hideAllPanel()
			  },
			  onBlur(e) {
			    this._keyboardShow = false
			    this.cursor = e.detail.cursor || 0
				if(this.keyboardHeight) {
					this.keyboardHeight = 0
				}
			  },
			  onInput(e) {
			    const value = e.detail.value
			    this.comment = value
			  },
			  onConfirm() {
			    this.onsend()
			  },
			  insertEmoji(evt) {
			    const emotionName = evt.detail.emotionName
			    const { cursor, comment } = this
			    const newComment =
			      comment.slice(0, cursor) + emotionName + comment.slice(cursor)
				this.comment = newComment
				this.cursor = cursor + emotionName.length
			  },
			  onsend() {
			    const comment = this.comment
			    const parsedComment = this.parseEmoji(this.comment)
				this.parsedComment = parsedComment
				this.comment = ''
			  },
			  deleteEmoji: function() {
			    const pos = this.cursor
			    const comment = this.comment
			    let result = '',
			      cursor = 0
			
			    let emojiLen = 6
			    let startPos = pos - emojiLen
			    if (startPos < 0) {
			      startPos = 0
			      emojiLen = pos
			    }
			    const str = comment.slice(startPos, pos)
			    const matchs = str.match(/\[([\u4e00-\u9fa5\w]+)\]$/g)
			    // 删除表情
			    if (matchs) {
			      const rawName = matchs[0]
			      const left = emojiLen - rawName.length
			      if (this.emojiNames.indexOf(rawName) >= 0) {
			        const replace = str.replace(rawName, '')
			        result = comment.slice(0, startPos) + replace + comment.slice(pos)
			        cursor = startPos + left
			      }
			      // 删除字符
			    } else {
			      let endPos = pos - 1
			      if (endPos < 0) endPos = 0
			      const prefix = comment.slice(0, endPos)
			      const suffix = comment.slice(pos)
			      result = prefix + suffix
			      cursor = endPos
			    }
				this.comment = result
				this.cursor = cursor
			  },
			handleTabClick: function handleTabClick(index) {
				this.$emit('clickTab', {
					index: index
				});
			},
			handleSwiperChange: function handleSwiperChange(e) {
				this.$emit('clickTab', {
					index: e.detail.current
				});
			}
		}
	}
</script>

<style lang="less">
	.weui-tabs {
		width: 100%
	}

	.weui-tabs-bar__wrp {
		width: 100%;
		background: #fff
	}

	.weui-tabs-bar__content {
		width: 100%;
		white-space: nowrap
	}

	.weui-tabs-bar__item {
		display: inline-block
	}

	.weui-tabs-bar__title {
		display: inline-block;
		border-bottom-width: 2px;
		border-bottom-style: solid;
		border-bottom-color: transparent
	}

	swiper {
		height: 80vh;
	}

	.reply_wrp {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #F9F9F9;
	}

	.reply_tool {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		font-size: 0;
		padding: 8px 12px;
		background-color: #F9F9F9;
		position: relative;
	}

	.reply_tool:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1 rpx solid rgba(0, 0, 0, 0.1);
		color: rgba(0, 0, 0, 0.1);
	}

	.reply_form_wrp {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		min-width: 0;
	}

	.reply_label {
		display: block;
		background-color: #FFFFFF;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		margin-right: 8px;
	}

	.reply_input {
		font-size: 17px;
		min-height: 40px;
		/* height: 40px;  */
		padding: 0 12px;
		width: 100%;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-border-radius: 4px;
		border-radius: 4px;
		caret-color: #1AAD19;
	}

	.reply_input[disabled] {
		background-color: #E8E8E8;
		color: #888888;
	}

	.reply_button {
		width: 32px;
		height: 32px;
		overflow: hidden;
		margin-right: 8px;
	}

	.reply_button.active {
		opacity: 0.5;
	}

	.reply_button image {
		width: 32px;
		height: 32px;
	}

	.reply_button image:active {
		opacity: 50%;
	}

	.reply_button:last-child {
		margin-right: 0;
	}

	.reply_panel_wrp {
		height: 200px;
		overflow: hidden;
		position: relative;
	}

	.reply_panel {
		height: 200px;
		overflow: auto;
		position: absolute;
		left: 0;
		right: 0;
		top: 300px;
		-webkit-transition: top .2s;
		transition: top .2s;
	}

	.reply_panel[hidden] {
		display: block;
	}

	.reply_panel.show {
		height: 300px;
		top: 0;
	}

	.reply_panel:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1 rpx solid rgba(0, 0, 0, 0.1);
		color: rgba(0, 0, 0, 0.1);
	}

	.reply_quick_item {
		position: relative;
		padding: 16px 12px;
		font-size: 17px;
		background-color: #FFFFFF;
		border-radius: 4px;
		margin: 8px;
		color: rgba(0, 0, 0, 0.9);
		word-wrap: break-word;
		word-break: break-all;
	}

	.reply_quick_item:last-child {
		margin-bottom: 0;
	}

	.reply_quick_item:after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-top: 1 rpx solid rgba(0, 0, 0, 0.05);
		color: rgba(0, 0, 0, 0.05);
	}

	.reply_quick_item:last-child:after {
		display: none;
	}

	.reply_quick_tool {
		text-align: center;
		padding: 16px 12px;
		font-size: 14px;
	}

	.reply_quick_tool navigator {
		color: #204495;
	}

	.reply_quick_empty {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		text-align: center;
		font-size: 17px;
	}

	.reply_quick_empty:active image {
		opacity: 0.5;
	}

	.pic_reply_quick_edit {
		vertical-align: middle;
		width: 18px;
		height: 18px;
		vertical-align: middle;
		margin-top: -3px;
		margin-right: 8px;
	}

	.reply_quick_empty:after {
		content: "";
		display: inline-block;
		vertical-align: middle;
		width: 0;
		height: 100%;
	}

	.reply_quick_empty navigator {
		color: #000000;
	}

	.function_list {
		text-align: justify;
	}

	.function_item {
		display: inline-block;
		vertical-align: middle;
		padding: 12px;
	}

	.function_item .reply_function_pic.active {
		display: none;
	}

	.function_item:active .reply_function_pic {
		display: none;
	}

	.function_item:active .reply_function_pic.active {
		display: inline-block;
	}

	.reply_function_pic {
		width: 64px;
		height: 64px;
	}
</style>
