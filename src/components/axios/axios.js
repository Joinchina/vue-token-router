// 配置API接口地址
var root = '/api'
// 引用axios
import axios from 'axios'
import {
  getStore
} from '../store/store'
import qs from 'qs'
// 
/*
根据hearder判断数据类型，格式化数据
接收的数据类型分别是（参数，请求头，求情方式，上传数组）
*/
function filterNull(o, h, f, a) {
  if (h == 'h1' && f == 'get') {
    o = o
  } else if (h == 'h1' && f == 'post') {
    o = qs.stringify(o);
  }
  if (h == 'h2' && f == 'get') {
    o = o
  } else if (h == 'h2' && f == 'post') {
    o = qs.stringify(o);
  }
  if (h == 'file' && f == 'post') {
    let param = new FormData();
    if (!!a) {
      for (var i = 0; i < a.length; i++) {
        param.append('files', a[i]);
      }
    }
    for (var j in o) {
      param.append(j, o[j]);
    }
    o = param;
  }
  return o
}

function setheader(headers) {
  let token = getStore().str;
  for (const key in token) {
    token = token[key]
  }
  if (headers == 'h1') {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json;charset=UTF-8'
    }
  } else if (headers == 'h2') {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json;charset=UTF-8',
      'Authorization': token
    }
  } else if (headers == 'file') {
    headers = {
      'Content-Type': 'multipart/form-data;',
      'Authorization': token
    }
  }
  return headers
}
/*
  接口处理函数
*/

function apiAxios(method, url, params, headers, success, fileArray) {
  if (params) {
    params = filterNull(params, headers, method, fileArray)
  };
  if (headers) {
    headers = setheader(headers)
  }
  axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      headers: headers,
      withCredentials: false
    })
    .then(res => {
      success(res)
    })
    .catch(err => {
      let res = err.response
      if (err) {
        window.alert('api error, HTTP CODE: ' + res.status)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, headers, success) {
    return apiAxios('GET', url, params, headers, success)
  },
  post: function (url, params, headers, success, fileArray) {
    return apiAxios('POST', url, params, headers, success, fileArray)
  },
}
