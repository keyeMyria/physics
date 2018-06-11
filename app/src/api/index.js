import { post , get, image } from './request'


//用户信息相关
export const sign_in = (body) => post('/api/student/sign_in', body)
export const modifyPassword = (body) => post('/api/student/modify_password', body)

//讨论组相关
export const getCourse = (body) => post('/api/course/student_get', body)
export const getDiscuss = (body) => post('/api/disscuss/get', body)
export const getDiscussByID = (body) => post('/api/disscuss/get_by_id', body)
export const createDiscuss = (body) => post('/api/disscuss/create', body)
export const createComment = (body) => post('/api/disscuss/create_comment', body)
export const createReplay = (body) => post('/api/disscuss/create_replay', body)
export const studentTest = (body) => post('/api/course/student_test', body)
export const careDisscuss = (body) => post('/api/disscuss/care', body)
export const getCare = () => get('/api/disscuss/get_care')
export const getCount = () => get('/api/course/count')
export const getNotice = () => get('/api/disscuss/get_notice')
export const clearNotive = (body) => post('/api/disscuss/clear_notice', body)
export const getBind = (body) => post('/api/course/get_bind', body)
// export const getComment

//技术贴相关
export const getPosting = () => get('/api/posting/get')

//上传图片
export const upload = (body) => image('/api/file/upload', body)
export const remove = (body) => post('/api/file/remove', body)
