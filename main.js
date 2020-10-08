import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(Vuex)

// 组件注册
import Reader from "@/components/Readers/Readers.vue"
import Popup from "@/components/popup/popup.vue"
import Setting from "@/components/Setting/Setting.vue" // 设置栏
import Rate from "@/components/Rate/Rate.vue"
import Search from "@/components/Search/Search.vue"
import ConfigBar from "@/components/ConfigBar/ConfigBar.vue" // 内容设置
import QueryList from "@/components/QueryList/QueryList.vue"
import ToTop from "@/components/ToTop/ToTop.vue"
import Tab from "@/components/Tab/Tab.vue"
import Comment from "@/components/Tabs/Comment/index.vue"
import Star from "@/components/Tabs/Star/index.vue"
import NoResult from "@/components/NoResult/NoResult.vue"
// import Emoji from "@/components/Emoji/Emoji.vue"
import {
	uniTransition,
	uniList,
	uniListItem,
	uniRate
} from "@dcloudio/uni-ui"


Vue.component('Reader', Reader)
Vue.component('Popup', Popup)
Vue.component('Setting', Setting)
Vue.component('Rate', Rate)
Vue.component('Search', Search)
Vue.component('ConfigBar', ConfigBar)
Vue.component('QueryList', QueryList)
Vue.component('Tab', Tab)
Vue.component('Comment', Comment)
Vue.component('Star', Star)
Vue.component('NoResult', NoResult)
// Vue.component('Emoji',Emoji)
// uni—ui组件
Vue.component('uniTransition', uniTransition)
Vue.component('uniList', uniList)
Vue.component('uniListItem', uniListItem)
Vue.component('uniRate', uniRate)

const store = new Vuex.Store({
	state: {
		commentList: [], // 用户书评列表
		publish_success: true, // 用户是否发表言论成功
		isOver: false, // 是否已经渲染出了所有书籍
		agree: false, // 加入书桌
		decline: false, //狠心拒绝
		showSettings: false, //	底部设置条
		showCatalog: false, // 小说目录弹出层
		showConfigs: false, // 主题设置条,
		themeFont: "", // 主题字号
		theme: "light", // 主题,
		qsList: [], // 查询书籍列表
		typing: false, // 请求结束后的flag，优化当 qslist 数据不存在时，noresult 组件一直显示的问题
		userInfo: null, // 用户信息
		books: [], // up推荐
		likeBooks: [], // 猜你喜欢
		newBooks: [], // 最新上架
		bookCategories: [] // 小说分类
	},
	mutations: {
		PUBLISH_SUCCESS(state,res){
			state.publish_success = res
		},
		SETDECLINE(state, res) {
			state.decline = res
		},
		SETAGREE(state, res) {
			state.agree = res
		},
		theme(state, res) {
			state.theme = res
		},
		showSettings(state, res) {
			state.showSettings = res
		},
		showCatalog(state, res) {
			state.showCatalog = res
		},
		showConfigs(state, res) {
			state.showConfigs = res
		},
		themeFont(state, res) {
			state.themeFont = res
		},
		qsList(state, res) {
			state.qsList = res
		},
		typing(state, res) {
			state.typing = res
		},
		userInfo(state, res) {
			if (res.result.data.length) {
				state.userInfo = res.result.data[0]
			}
		},
		ADDBOOK(state, res) {
			state.books.push(res) // 将书架中的书架追加进去
		},
		SETISOVER(state, res) {
			state.isOver = res
		},
		SETBOOKS(state, res) {
			if (res.result.data.length) {
				state.books = res.result.data
			} else {
				state.isOver = true
			}
		},
		SETLIKEBOOKS(state, res) {
			if (res.result.data.length) {
				state.likeBooks = res.result.data
			}
		},
		SETNEWBOOKS(state, res) {
			if (res.result.data.length) {
				state.newBooks = res.result.data
			}
		},
		SETCATEGORIES(state, res) {
			// 小说分类
			if (res.result.data.length) {
				const rawData = res.result.data;
				// 所有分类
				const arr = res.result.data.map(item => item.bookCategory)
				// 去重
				const data = [...new Set(arr)]
				const result = []
				for (let key of data) {
					// 查找2张封面图
					let covers = []
					for (let i = 0; i < rawData.length; ++i) {
						if (covers.length === 2) break
						if (rawData[i].bookCategory === key) {
							covers.push(rawData[i].cover)
						}
					}
					result.push({
						name: key,
						covers
					})
				}
				// 组装数据，2个类目为一组
				const grouping = []
				for (let i = 0; i < result.length; i += 2) {
					const temp = {};
					const first = result[i]
					const second = result[i + 1]
					// 拼接类目名 + 封面图
					let name, covers
					if (first && second) {
						name = first.name + '/' + second.name
						covers = [...first.covers, ...second.covers]
					} else {
						name = first.name
						covers = [...first.covers]
					}

					grouping.push({
						name,
						covers
					})
				}
				state.bookCategories = grouping
			}
		},
		QUERYBOOKS(state, res) {
			if (res.result.data && res.result.data.length) {
				state.qsList = res.result.data
			} else {
				// 啥也没查到
				state.qsList = []
			}
		},
		GETCOMMENTS(state,res) {
			if(res.result.data[0] && res.result.data[0].comments) {
				const list = res.result.data[0].comments
				// 用户评论列表
				state.commentList = list
			}else {
				state.commentList = []
			}
		}
	},
	actions: {
		async userInfo({
			commit
		}) {
			commit('userInfo', await getUserInfo())
		},
		async qsList({
			commit
		}) {
			commit('qsList', await mockQsData())
			commit('typing', true) // 请求结束后再渲染 noresult 组件
		},
		async SETBOOKS({
			commit
		}, payload) {
			commit('SETBOOKS', await getBooks(payload))
		},
		async SETLIKEBOOKS({
			commit
		}, payload) {
			commit('SETLIKEBOOKS', await getLikeBooks(payload))
		},
		async SETNEWBOOKS({
			commit
		}) {
			commit('SETNEWBOOKS', await getNewBooks())
		},
		async SETCATEGORIES({
			commit
		}) {
			commit('SETCATEGORIES', await getbooksCategories())
		},
		async QUERYBOOKS({
			commit
		}, payload) {
			commit('QUERYBOOKS', await queryBooks(payload))
		},
		async GETCOMMENTS({
			commit,
		},payload) {
			commit('GETCOMMENTS', await getComments(payload))
		}
	}
})

const app = new Vue({
	...App,
	store
})
app.$mount()

// 云函数调用

// 获取评论列表
async function getComments(payload) {
	return await wx.cloud.callFunction({
		name: 'getComments',
		data: {
			...payload
		}
	})
}

// 查询书籍列表
async function queryBooks(payload) {
	return await wx.cloud.callFunction({
		name: 'queryBooks',
		data: {
			...payload
		}
	})
}

// 获取分类
async function getbooksCategories() {
	return await wx.cloud.callFunction({
		name: 'getbooksCategories'
	})
}

// 获取用户信息
async function getUserInfo() {
	return await wx.cloud.callFunction({
		name: 'getUserInfo'
	})
}

//up推荐
async function getBooks(payload) {
	return await wx.cloud.callFunction({
		name: 'getBooks',
		data: { ...payload
		}
	})
}

// 猜你喜欢
async function getLikeBooks(payload) {
	return await wx.cloud.callFunction({
		name: 'getLikeBooks',
		data: { ...payload
		}
	})
}

// 最新上架
async function getNewBooks() {
	return await wx.cloud.callFunction({
		name: 'getNewBooks'
	})
}

//  mock 查询列表
async function mockQsData() {
	return await new Promise((resolve, reject) => {
		setTimeout(() => {
			const data = [
				[{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 1
					},
					{
						book__update: '更新至第一百二十章',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 2
					},
					{
						book__update: '更新至第一百二十章',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 3
					},
					{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 4
					},
					{
						book__update: '更新至第一百二十章',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 5
					},
					{
						book__update: '更新至第一百二十章',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 6
					},
					{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 7
					},
					{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 8
					},
					{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 9
					},
					{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 10
					},
					{
						book__update: '已完结',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 11
					},
					{
						book__update: '更新至第一百二十章',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 12
					},
					{
						book__update: '更新至第一百二十章',
						book__title: 'mock',
						book__cover: 'http://b.heiyanimg.com/book/93529.jpg@!bpm?1',
						book__author: '辣椒炒杂粉',
						book__grade: '8.7',
						id: 13
					}
				],
				[]
			]
			// 随机返回空数据或13条测试数据
			resolve(data[getRandomInt(2)])
		}, 1000)
	})
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
