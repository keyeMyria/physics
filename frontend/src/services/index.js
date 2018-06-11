import { post, get } from '../utils/request'

export const login_in = (body) => post('/api/login_in', body)
export const register = (body) => post('/api/register', body)

//取出老师相关数据
export const getTeacher = (body) => get('/api/teacher/get', body)
//取出学校相关
export const getSchool = (body) => get('/api/school/get', body)
//修改老师相关
export const editTeacher = (body) => post('/api/teacher/update', body)
//取出学生相关数据
export const getStudent = (body) => get('/api/student/get', body)

//修改学生相关数据
export const editStudent = (body) => post('/api/student/update', body)

//课题相关
export const getTopic = () => get('/api/topic/get')
export const createTopic = (body) => post('/api/topic/create',body)
export const updateTopic = (body) => post('/api/topic/update',body)
export const topicGetDataByID = (body) => post('/api/topic/get_data_by_id',body)
export const topicBind = (body) => post('/api/topic/bind',body)




//讨论组相关
export const saveCourse = (body) => post('/api/course/save', body)
export const updateCourse = (body) => post('/api/course/update', body)
export const getCourseByID = (body) => post('/api/course/get_data_by_id', body)
export const bindCourse = (body) => post('/api/course/bind', body)
export const getAllCourse = () => get('/api/course/get')
//讨论区相关
export const createDisscuss = (body) => post('/api/disscuss/create',body)
export const getDisscuss = (body) => post('/api/disscuss/get',body)
export const createComment = (body) => post('/api/disscuss/create_comment',body)
export const getDisscussByID = (body) => post('/api/disscuss/get_by_id',body)
export const createReply = (body) => post('/api/disscuss/create_replay',body)
export const deleteComment = (body) => post('/api/disscuss/delete_comment',body)
export const deleteReplay = (body) => post('/api/disscuss/delete_replay',body)

//技术贴相关
export const getPosting = () => get('/api/posting/get')
export const savePosting = (body) => post('/api/posting/save',body)
export const updatePosting = (body) => post('/api/posting/update',body)

// export const deletePosting = (body) => post('/api/posting/delete',body)
