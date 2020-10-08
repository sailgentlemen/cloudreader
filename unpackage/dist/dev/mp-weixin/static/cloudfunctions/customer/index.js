const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() 
  const keyword = event.Content

  const result = await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '非常感谢您体验暮光书菇，这里有海量小说免费读喔，<a href="http://www.qq.com" data-miniprogram-appid="wxfd3291ec7788a340" data-miniprogram-path="pages/bookmall/bookmall">返回小程序</a>'
    }
  })

  try {
    if(keyword.search(/小鸭子/i)!=-1) {
         //我们通常会将云存储的图片作为客服消息媒体文件的素材
    const fileID = 'cloud://cloudreader-1.636c-cloudreader-1-1301790151/images/WechatIMG219.jpeg'
 
    //uploadTempMedia的图片类型为Buffer，而从存储下载的图片格式也是Buffer
    const res = await cloud.downloadFile({
      fileID: fileID,
    })
    const Buffer = res.fileContent  
    const result = await cloud.openapi.customerServiceMessage.uploadTempMedia({
      type: 'image',
      media: {
        contentType: 'image/png',
        value: Buffer
      }
    })

    console.log(result.mediaId)
    const mediaId = result.mediaId
    const wxContext = cloud.getWXContext() 
    const result2 = await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'image',
      image: {
        mediaId: mediaId
      }
    })

    const result3 = await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'text',
      text: {
        content: '女王，你来了鸭~'
      }
    }) 
    }
      return event
  } catch (err) {
    console.log(err)
    return err
  }
}