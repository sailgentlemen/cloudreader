<template>
	<view class="reader__wrap" v-if="contentList.length">
		<view class="reader">
			<!-- <view class="chapter">{{content.title}}</view> -->
			<view v-if="hideBookInfo" class="previous" @tap="previousHandle">上一章</view>
			<view class="title">{{matter.title}}</view>
			<view :class="themeFont" class="main__body" @tap="tapHandle">
				<view class="text" v-for="(item,index) in contentList" :key="index">{{item}}</view>
				<!-- <text>我哥今年三十来岁，他开了一家印刷厂，本来也什么特别的地方，但是他这个印刷厂不是一般的印刷厂，印刷的是死人用的冥币！想到此处不由让我这个不迷信鬼神之说的人，都冷不丁的打了个寒颤。</text>
				<text>我家是在农村，小时候经常听爷爷辈的老人讲，说是这古往今来，这死人用的冥币就是一个特殊的物件，是要沾上血才能进入阴间的，当时听到这些十分害怕，这还要沾上血，那不是会出现杀人之类的事情？那时候年纪小，虽然没亲眼见过鬼怪但是想想就害怕。</text>
				<text>我哥这个人常年和冥币打交道，人是沉默寡言的，和他待在一起，你要是不和他说话，他能哑巴一天，。我有一次问我妈，我哥为啥不喜欢说话，我妈告诉我说，我哥这人做什么工作都倒霉，而且什么倒霉事都能和他沾上边，什么都做的不好。本来很活泼的一个人也因为各种不顺心的事，变得沉默寡言。</text>
				<text>但是我又问我妈为什么我哥要印刷冥币，她却小声嘀咕的告诉我，说她也是从她爷爷那听来的，说这做着印刷冥币活的人，上辈子就是伺候阎王爷的小鬼，在地府把阎王爷伺候高兴了这就赏他投胎做人了，但是还是得为阴间做事，这不我哥这后半生就靠印刷冥币养活了。</text>
				<text>我当时听完这些才明白，不过还是有所怀疑，这世界上真的有阴曹地府？</text>
				<text>我读书不好，高一因为成绩烂被父母臭骂了一顿，后来就辍学了，一时间不知道干啥，而我哥这些年办这个印刷厂也着实赚了不少钱，在市区买了一套房，也找了一个漂亮的姑娘成家，我家看我哥好就索性把我推给我哥了，让我跟着我哥学印刷。</text>
				<text>刚开始学印刷的时候，各种脏活累活我哥都往我这甩，说是这样才能学到东西，我这人也不是吃不得苦，对此也没多少怨言，顶多烦的时候牢骚他几句罢了。</text>
				<text>和我哥相处这些年，我发现他除了沉默寡言之外，还有一个事情让我十分在意，不管何时何地他总是身上带着一包烟，本来男人抽烟是很普通的事，但是怪就怪在他这个人压根不抽烟，而且有一次我犯烟瘾，手里头的烟抽完了，去买烟还得走两里地，当时太阳特别大，火辣辣的阳光能把人晒的脱相，我就找我哥向他问烟，但是他就好像没听见一样，不光是我，就是其他人找他问烟，他也不吭一声，他就是让烟一只兜着，兜的发霉了再换一包新的。</text>
				<text>这导致我对此事一直耿耿于怀，觉得我哥这人太小气了，抽他一只烟怎么了，后来我就开始想着法子怎么拿到他的烟，我这个人性格就是这样，越是不给我我越是要抽！</text>
				<text>有心思办事总会等到机会的，果然，那天下午，我嫂子打了一个电话给我哥，也不知道是啥事，我哥接着电话说话声特别小，怕是让我听见，后来就干脆去外面说去了，他那兜着香烟的衬衫就放在凳子上。</text>
				<text>我心里嘿嘿一笑，你不让我抽，我现在就抽给你看。</text>
				<text>我刚抽两口，啪的一声，一只手就拍在我左肩上，顿时感觉到肩膀火辣辣的疼！</text>
				<text>"我日你大爷！"</text>
				<text>我转头怒骂一声，不是别人，就是刚踏门而出的我哥。</text>
				<text>"你丫的抽我烟？"</text>
				<text>我哥指着凳子上被我从衬衫兜里拿出来的香烟盒，对我怒吼道。</text>
				<text>我当时就懵逼了，这还是我第一次见我哥这么火冒三丈，我不由紧张的后退两步，说话也结结巴巴的。</text>
				<text>"哥，对...对...对不起，我..我..我不就是抽你一支烟吗，干嘛这么火冒三丈啊，别生气嘛。"</text>
				<text>我想在我哥眼里我还是一个小孩儿，这样说他应该能消火。</text>
				<text>"啪！"</text>
				<text>我哥一巴掌甩在我脸上，手上的香烟都被甩出去了，我直接傻了站在原地，从小到大我哥可是从来没打过我的，我顿时感觉受到了委屈，泪珠开始在眼眶里打转，接着花花的流下。</text>
				<text>我扭头就朝门外走去，不停的用袖子擦拭落下的眼泪。</text>
				<text>这么多年的兄弟情，就因为一支破烟！</text>
				<text>太阳下山了的时候，做饭阿姨喊吃饭，我等其他人吃完回去工作了我才拿着饭碗进去厨房，我哥还在饭桌前喝着小酒。</text>
				<text>他见我进来，立马就喊住我。</text>
				<text>"坤啊，今儿哥动手打了你对不住了，是哥错了，对不起，你别往心里去，那烟真不是给咱们抽的。"</text>
				<text>我哥眼神直勾勾的看着我，略带歉意的说道。</text>
				<text>"哥，我没气，我就是不明白，你说那烟是给谁抽的？"</text>
				<text>"有些事情你还是别问了，我是你哥，我不会害你的。"</text>
				<text>他并没有解释这一切，只是淡淡的回了我一句。</text>
				<text>事已至此，我也不想再问了，刚才的气也消了，肚子已经饿的咕咕叫，狼吞虎咽就开始扒起饭来。</text>
				<text>吃完饭，我准备回去工作的时候，我哥又喊住我说了一句。</text>
				<text>"坤啊，下班等会一起走。"</text>
				<text>晚上八点，也不知道怎么的，三伏天的夜晚，今天显得特别的凉透，外面已经被黑夜笼罩。</text>
				<text>因为印刷厂在郊区回去自家的路程太远，我们都是住在附近的居民楼。这附近没几户人家，人烟稀少一望无际的田野，路边的路灯泛着昏黄的灯光，年份久远了即便开着也就一星星灯火，路灯相距甚远，有些路灯还是坏的，导致路段忽暗忽明的，加上阴嗖的凉风，走在这里着实有一份阴冷的不安感。</text>
				<text>长路漫漫又安静的诡异，此刻感觉到自己的内心十分不安，索性没话找话的和我哥搭讪起来。</text>
				<text>"哥，听说这块一年前死过人，被人劫财砍死，当时都上报了，不知道是真的假的。"</text>
				<text>"现在大晚上的可别说这些话，这地本来阴邪的很。"</text>
				<text>一听到阴邪我的心脏不由猛然的跳了一下，身上起了一片鸡皮疙瘩，脚下下意识的朝我哥靠近，不知道是不是心理作祟，总是感觉身后有人在跟着我盯着我的后背看。</text>
				<text>一股强烈的不安冒上心头，我骤然扭头朝后一看，浑身顿时一颤。</text>
				<text>"哥，世上真的有鬼？"</text>
				<text>昏暗的灯光打在我哥侧脸上，他挑着眉疑问道。</text>
				<text>"怎么了？"</text>
				<text>"哥...你往后看..."</text>
				<text>我只感觉自己浑身被恐惧席卷，周身的汗毛到竖起来，声音中夹杂着恐惧朝我哥喊道，随后**里头更是一热。</text>
				<text>我哥好似听出了我声音里夹杂的恐惧，但他并没有回头，只是凛然说道。</text>
				<text>"别慌，回过头来！千万不要跑！"</text>
				<text>说完，他急忙从衬衫兜掏出香烟，也不知捏出几支，看也不看就往后头抛去，我眼角余光扫到烟盒里面的香烟已经少了大半。</text>
				<text>"快走！"</text>
				<text>我俩加快脚步，在一个巷头转进去，走进去的那一刹那，我忍不住用眼角余光扫了下后面，顿时吓得脸色苍白。</text>
				<text>它还在那！</text>
				<text>"哥，刚才那是..."</text>
				<text>还没等我说完，我哥立马伸手堵住我的嘴巴。</text>
				<text>"以后可别抽我的烟了，切记。"</text>
				<text>我恐惧的点了点头。</text>
				<text>回到宿舍，我哥要*立马睡觉，什么也别想。</text>
				<text>"晚上你要是听到什么动静也别出屋，就当没听见，这一晚上你就老老实实呆在房间里吧，知道了吗？"</text>
				<text>这是我哥临睡前对我说的，我凝重着神情向他点了点头。</text> -->
			</view>
			<view v-if="!finished" class="new__chapter" @tap="nextHandle">
				下一章
			</view>
			<view class="finished" v-if="finished">
				<image src="/static/images/finished.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['matter','hideBookInfo','finished'],
		data() {
			return {
				contentList: []
			}
		},
		computed: {
			themeFont () {
				return this.$store.state.themeFont
			}
		},
		watch: {
			matter(res){
				const data = JSON.parse(res.content)
				this.contentList = data.content.split('\n')
			}
		},
		methods: {
			previousHandle() {
				this.$emit('previous')
			},
			nextHandle(){
				this.$emit('next')
			},
			tapHandle() {
				this.$emit('tapHandle')
			}
		}
	}
</script>

<style>
	.dark .reader {
		
	}
</style>
<style scoped>
	.finished  {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}
	.finished image {
		width: 100rpx;
	}
	.reader {
		padding: 100rpx 70rpx 30rpx;
		color: #03060b;
		margin-bottom: 196rpx;
		background: var(--yyd-read-bgcolor);
		position: relative;
	}
	
	.previous {
		position: absolute;
		top: 60rpx;
		font-size: 36rpx;
		color: var(--yyd-color-primary);
	}
	
	.chapter,
	.title {
		font-size: 46rpx;
		font-weight: 500;
		line-height: 1;
		color: var(--yyd-dark-color-commend);
	}

	.title {
		font-size: 48rpx;
		margin-top: 54rpx;
		margin-bottom: 62rpx;
	}

	.main__body .text {
		line-height: 1.8;;
		color: var(--yyd-read-color);
		text-indent: 2em;
	}

	.new__chapter {
		line-height: 100rpx;
		color: #fff;
		font-size: 40rpx;
		text-align: center;
		border-radius: 15rpx;
		/* margin-bottom: 88rpx; */
		margin-top: 58rpx;
		background: var(--yyd-dark-next-bgcolor)
	}
</style>
