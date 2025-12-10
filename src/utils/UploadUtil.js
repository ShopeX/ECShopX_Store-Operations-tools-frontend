/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

// 阿里云
// import Oss from 'ali-oss'
// 亚马逊
// import AWS from 'aws-sdk'
// 七牛
import * as QiNiu from 'qiniu-js'
// 获取Token
import { getOssToken, AliUpload, LocalUpload } from '../api/ossStorage.js'

class UploadUtil {
  constructor(fileType = 'image') {
    this.client = {}
    this.fileType = fileType
  }

  // 初始化
  init(tokenRes, uploadType = 'qiniu') {
    switch (uploadType) {
      case 'oss':
        this.aliInit(tokenRes)
        break
      case 'local':
        this.local(tokenRes)
        break
      case 'aws':
        this.aws(tokenRes)
        break
      default:
        this.qiNiuInit(tokenRes)
    }
  }

  // 阿里云
  aliInit(tokenRes) {
    console.log('aliInit', tokenRes)
    this.client.upload = (file) => AliUpload(tokenRes, file)
  }

  // 本地
  local(tokenRes) {
    this.client.upload = async (file) => await LocalUpload(tokenRes, file, this.fileType)
  }

  // 亚马逊
  aws(tokenRes) {
    const { Region, AccessKeyId, Bucket, SecretAccessKey, SessionToken } = tokenRes

    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region: Region,
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken
    })
    this.client.upload = (file) => {
      return new Promise((resolve, reject) => {
        s3.upload(
          {
            Bucket: Bucket,
            Key: `${file.uid}.${file.name}`,
            ContentType: file.type,
            Body: file
          },
          (err, data) => {
            if (data) {
              resolve({
                ...data,
                key: data.Location
              })
            } else {
              reject(err)
            }
          }
        )
      })
    }
  }

  // 七牛
  qiNiuInit(tokenRes) {
    this.client.upload = (flie, key) => {
      return new Promise((resolve, reject) => {
        const observable = QiNiu.upload(flie, key, tokenRes.token)
        observable.subscribe({
          next: () => {},
          error: (err) => reject(err),
          complete: (res) => resolve(res)
        })
      })
    }
    // this.client.upload = (flie, key) => {
    //   console.log('qiNiuInit', flie)
    //   const config = {
    //     retryCount: 10
    //   }
    //   console.log('qiNiuInit config', config)
    //   const options = {
    //     quality: 0.1,
    //     noCompressIfLarger: true
    //   }
    //   return new Promise((resolve, reject) => {
    //     QiNiu.compressImage(flie, options).then((data) => {
    //       console.log('data', data)
    //       const observable = QiNiu.upload(data.dist, key, tokenRes.token, {}, config)
    //       // const subscription = observable.subscribe(observer) // 上传开始
    //       observable.subscribe({
    //         next: (res) => {
    //           console.log('next', res, res?.uploadInfo, res?.chunks, res?.total)
    //         },
    //         error: (err) => reject(err),
    //         complete: (res) => resolve(res)
    //       })
    //     })
    //   })
    //   // return new Promise((resolve, reject) => {
    //   //   const observable = QiNiu.upload(flie, key, tokenRes.token, {}, config)
    //   //   observable.subscribe({
    //   //     next: (res) => {
    //   //       console.log('next', res, res?.uploadInfo, res?.chunks, res?.total)
    //   //     },
    //   //     error: (err) => reject(err),
    //   //     complete: (res) => resolve(res)
    //   //   })
    //   // })
    // }
  }

  // 生成文件名
  setFileName() {
    const rx = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    const fileName = `${+new Date()}_${rx}${rx}`
    return fileName
  }

  // 上传
  async uploadImg(file) {
    console.log('push an tag')
    // 初始化
    try {
      const tokenRes = await getOssToken({ filetype: this.fileType })
      console.log('uploadImg tokenRes', tokenRes)
      const data = tokenRes.token
      this.init(data, tokenRes.driver)
      const res = await this.client.upload(file, data.key).catch((e) => console.error(e))
      if (res.data || res.key) {
        if (res.data && res.data.data) {
          return {
            key: res.data.data.image_url
          }
        }
        return res
      } else {
        return {
          key: data?.dir || data?.key
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  // 删除图片
  async deleteImg(fileId) {
    console.log(fileId)
    const res = await this.client.deleteImg(fileId)
    return res
  }

  // 上传视频
  uploadVideo(file) {
    console.log('video')
  }
}

export default UploadUtil
