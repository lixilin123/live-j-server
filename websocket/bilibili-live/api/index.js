const qs = require('querystring')
const { get, post } = require('../utils/request.js');
const RoomApi = require('./room/index.js');

const BASE_URL = 'api.live.bilibili.com/'

class Api {
  constructor(config = {}) {
    this.protocol = config.useHttps ? 'https://' : 'http://'
    this.cookie = config.cookie || ''
    this.roomId = config.roomId || '23058'
  }

  useHttps(use) {
    this.protocol = use ? 'https://' : 'http://'
  }

  setCookie(cookie) {
    this.cookie = cookie
  }

  setRoomId(roomId) {
    this.roomId = roomId
  }

  get(options) {
    let url = this.protocol + (options.url ? options.url : BASE_URL + options.uri)
    let headers = {
      'Cookie': this.cookie
    }
    let config = {}
    if (!options.html) config.headers = Object.assign(headers, options.headers)
    if (options.params) config.params = options.params
    return get(url, config)
  }

  post(options) {
    let url = this.protocol + (options.url ? options.url : BASE_URL + options.uri)
    let headers = {
      'Cookie': this.cookie
    }
    if (!options.isJson) headers['Content-Type'] = 'application/x-www-form-urlencoded'
    let config = {}
    config.headers = Object.assign(headers, options.headers)
    if (options.body) config.body = options.isJson ? options.body : qs.stringify(options.body)
    return post(url, config)
  }

}

Object.assign(Api.prototype, RoomApi)

module.exports = Api
