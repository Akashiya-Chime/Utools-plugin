/*
** preload.js
*/

const fetch = require('fetch')
const { remote, clipboard } = require('electron')
const { ReadStream, openSync, readFile, createReadStream, readFileSync } = require('fs')
const FormData = require('formdata')
const axios = require('axios')
const sha1 = require('js-sha1')
const { resolve } = require('path')
const { reject, tail } = require('lodash')

utools.onPluginEnter(() => {

    console.log('我已出仓，感觉良好')

    const dragWrapper = document.querySelector('.uploadbox')
    //添加拖拽事件监听器
    dragWrapper.addEventListener("drop", (e) => {
        //阻止默认行为
        e.preventDefault()
        //获取文件列表
        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            // 获取文件路径
            const path = files[0].path;
            // 获取文件名
            const fileName = path.split('/').pop()
            // 以流的方式读取文件内容，以便 FormData 处理
            let reader = createReadStream(path)
            // 文件流流动
            reader.resume()
            // 观察读取
            reader.on('data', () => {
                console.log('du qu zhong')
            })
            // 读取结束
            reader.on('end', () => {
                // alert('上传完毕，已复制到剪贴板')
                // clipboard.writeText(json.data.url)
                console.log(reader.bytesRead)

                // let tokenFormData = new window.FormData()
                // tokenFormData.append('action', 'token')
                // window.fetch('https://tun.tmp.link/api_v2/token', {
                //     method: 'POST',
                //     body: tokenFormData
                // })
                //     .then(res => res.json())
                //     .then(json => {
                //         let token = json.data
                //     })
                let token = document.getElementsByTagName('input')[0].value

                let selectFormData = new window.FormData()
                selectFormData.append('token', token)
                selectFormData.append('action', 'upload_request_select')
                selectFormData.append('filesize', reader.bytesRead)

                window.fetch('https://tun.tmp.link/api_v2/file', {
                    method: 'POST',
                    body: selectFormData
                })
                    .then(res => res.json())
                    .then(json => {
                        console.log(json)
                        // -> {"data":{"utoken":"QDxeai3eiX","uploader":"https:\/\/tmp-panda.vx-cdn.com:616\/app\/upload","src":"182.139.45.188"},"status":1,"debug":[]}

                        readFile(path, (err, data) => {
                            let blob = new Blob([data])
                            let uploadFormData = new window.FormData()

                            uploadFormData.append('file', blob)
                            uploadFormData.append('filename', fileName)
                            uploadFormData.append('utoken', json.data.utoken)
                            uploadFormData.append('model', 0)
                            uploadFormData.append('mr_id', 0)
                            uploadFormData.append('token', token)

                            window.fetch(json.data.uploader, {
                                method: 'POST',
                                body: uploadFormData
                            })
                                .then(res => res.json())
                                .then(json => {
                                    console.log(json)
                                    console.log(json.data.url)
                                    // -> https://tmp-titan.vx-cdn.com:616/file/614c4ff79dc25
                                    // -> https://tmp-titan.vx-cdn.com:616/file/614c501cb32d6
                                    // clipboard.writeText('https://tmp-titan.vx-cdn.com:616/file/' + json.data.ukey)
                                    clipboard.writeText(json.data.url)
                                    alert('上传完毕，已复制到剪贴板')

                                    // https://tmp-titan.vx-cdn.com:616/file/614c50e10d4e0
                                    // https://tmp-titan.vx-cdn.com:616/file/614c51105c2d3
                                    // window.fetch(json.data.url)
                                    //     .then(res => res.text())
                                    //     .then(text => console.log(text))
                                    // let url = document.querySelector('.btn .btn_copy_downloadurl')
                                    // console.log(url)
                                })
                        })
                    })

                // // & prepare
                // // 通过 sha1 加密的数据来查是否已存在
                // readFile(path, (err, data) => {
                //     let sha1Data = sha1(data)
                //     console.log(sha1Data)
                //     let prepareFormData = new window.FormData()
                //     prepareFormData.append('sha1', sha1Data)
                //     prepareFormData.append('filename', fileName)
                //     prepareFormData.append('model', 0)
                //     prepareFormData.append('mr_id', 0)
                //     prepareFormData.append('action', 'prepare_v4')

                //     window.fetch('https://tun.tmp.link/api_v2/file', {
                //         method: 'POST',
                //         body: prepareFormData
                //     })
                //         .then(res => res.json())
                //         .then(json => {
                //             console.log(json)
                //             // -> {"data": {"ukey": "614b0efa4bc39","url": "http://tmp.link/f/614b0efa4bc39"},"status": 1,"debug": [["无用户权限A:MRID:0:UserID:51047"]]}
                //             // -> {"data":false,"status":0,"debug":[]}
                //             if (json.data) {
                //                 console.log('已存在：' + json.data.url)
                //             } else {

                //                 // prepare 结束
                //                 // & upload_request_select

                //                 let selectFormData = new window.FormData()
                //                 selectFormData.append('token', 's0s5beqvenlusxkayavn')
                //                 selectFormData.append('action', 'upload_request_select')
                //                 selectFormData.append('filesize', reader.bytesRead)

                //                 window.fetch('https://tun.tmp.link/api_v2/file', {
                //                     method: 'POST',
                //                     body: selectFormData
                //                 })
                //                     .then(res => res.json())
                //                     .then(json => {
                //                         console.log(json)
                //                         // -> {"data":{"utoken":"QDxeai3eiX","uploader":"https:\/\/tmp-panda.vx-cdn.com:616\/app\/upload","src":"182.139.45.188"},"status":1,"debug":[]}
                //                         let uploadFormData = new FormData()
                //                         uploadFormData.append('file', reader)
                //                         uploadFormData.append('filename', fileName)
                //                         uploadFormData.append('utoken', json.data.utoken)
                //                         uploadFormData.append('model', 0)
                //                         uploadFormData.append('mr_id', 0)
                //                         uploadFormData.append('token', 's0s5beqvenlusxkayavn')

                //                         window.fetch(json.data.uploader, {
                //                             method: 'POST',
                //                             body: uploadFormData
                //                         })
                //                             .then(res => res.json())
                //                             .then(json => {
                //                                 console.log(json)
                //                                 console.log(json.data.url)
                //                             })
                //                     })
                //             }
                //         })
                // })

            })

        }
    })
    //阻止拖拽结束事件默认行为
    dragWrapper.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

})


