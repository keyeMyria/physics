
import {getTeacher,getSchool} from '../../../../services'

export default {

  namespace: 'teacher',

  state: {
    teacher_data:[],
    school_data:[],
    school_from_id:{},
    fromID:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *getTeacherData({ payload }, { call, put,all }) {
      const [result, school]=yield all([
        call(getTeacher),
        call(getSchool)
      ])
        const teacher_data=[]
        const {data}=result
        data.forEach(i=>{
            teacher_data.push({
              ...i,e_mail:i.email,school:i.school_id,
              account_status:i.status,
              key:'teacher_key_'+i.id,
            })
        })
      const school_from_id={}
      school.data.forEach(i=>{
        school_from_id[i.id]={...i}
      })
      const fromID = {}
      teacher_data.forEach(item=>fromID[item.id]=item)
       yield put({ type: 'setData',payload:{...result,teacher_data,get_data:true,school_data:school.data,school_from_id,fromID} });
    },
    *getTeacherDataSingle({payload},{call,put}){
      const result=yield call(getTeacher)
      const teacher_data=[]
      const {data}=result
      data.forEach(i=>{
        teacher_data.push({
          ...i,e_mail:i.email,school:i.school_id,
          account_status:i.status
        })
      })
      const school_from_id={}
      yield put({ type: 'setData',payload:{...result,teacher_data,} });
    }
  },

  reducers: {
    setData(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
