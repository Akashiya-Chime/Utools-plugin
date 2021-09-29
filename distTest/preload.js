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
    dragWrapper.addEventListener("drop", (e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            const path = files[0].path;
            const fileName = path.split('/').pop()
            let reader = createReadStream(path)
            reader.resume()
            reader.on('data', () => {
                console.log('du qu zhong')
            })
            reader.on('end', () => {
                console.log(reader.bytesRead)
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
                                    clipboard.writeText(json.data.url)
                                    alert('上传完毕，已复制到剪贴板')
                                })
                        })
                    })
            })

        }
    })
    dragWrapper.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

})


