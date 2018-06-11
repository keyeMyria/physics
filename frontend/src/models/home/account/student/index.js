
import {getStudent,getSchool} from '../../../../services'

export default {

  namespace: 'student',

  state: {
    student_data:[],
    school_data:[],
    school_from_id:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *getStudentData({ payload }, { call, put,all }) {
      const [result, school]=yield all([
        call(getStudent),
        call(getSchool)
      ])
      const student_data=[]
      const {data}=result
      data.forEach(i=>{
        student_data.push({
          ...i,e_mail:i.email,school:i.school_id,
          account_status:i.status,
          key:'student_key_'+i.id,//统一加key
        })
      })
      const school_from_id={}
      school.data.forEach(i=>{
        school_from_id[i.id]={...i}
      })
      yield put({ type: 'setData',payload:{...result,student_data,get_data:true,school_data:school.data,school_from_id} });
    },
    *getStudentDataSingle({payload},{call,put}){
      const result=yield call(getStudent)
      const student_data=[]
      const {data}=result
      data.forEach(i=>{
        student_data.push({
          ...i,e_mail:i.email,school:i.school_id,
          account_status:i.status
        })
      })
      const school_from_id={}
      yield put({ type: 'setData',payload:{...result,student_data,} });
    }
  },

  reducers: {
    setData(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
