/*
* 一些数据处理的实用类函数
* */

export const toThousand = (num) => {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}  //千位数转换

//手机号码检查
export const phoneCheck=(phone)=>{
  return phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)
}
//e_mail检查
export const emailCheck=(e_mail)=>{
  return e_mail.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
}
// 只能英文匹配
export const checkEnglish=(name)=>/^[a-z]+$/i.test(name)
