//  存储localstorage
export const setStore = (key, data) => {
  //存储之前先清除这样保持始终只有一个账户的信息
  window.localStorage.clear();
  //定义一个时间，用来设置过期则清除
  let curTime = new Date().getTime();
  //存储数据和存储时间
  let setdata = {
    data: data,
    time: curTime,
  };
  //将数据存储为字符串类型
  setdata = JSON.stringify(setdata)
  window.localStorage.setItem(key, setdata)
  // console.log(setdata)
}

//获取locastorage
export const getStore = () => {
  //    对当前的localStorage进行遍历查找数据
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      let keyname = localStorage.key(i);
      let str = localStorage.getItem(keyname);
      str = JSON.parse(str)
      //对时间进行比较看是否过期
      let curTime = new Date().getTime();
      let tiem = 7 * 24 * 60 * 60 * 1000;
      if (curTime - str.time > tiem) {
        console.log("当年账户已经过期了，清从新登录");
        window.localStorage.clear();
      } else {
        return str.data
      }
    }
  }
}
