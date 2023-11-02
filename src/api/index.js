import { http } from "./request"

export const getCourseList = (queries = {}) => {
  return http.post('/course/list', {
    pageNum: 1,
    pageSize: 20,
    ...queries
  })
}

export const getExamListByCourseId = (courseId) => {
  return http.post('/course/' + courseId + '/exam')
}

export const getQuestionListByExamId = (examId) => {
  return http.post('/exam/' + examId +'/question')
}

export const addCourseView = (examId) => {
  return http.get('/course/' + examId +'/view')
}

export const getStat = () => {
  return http.get('/stat')
}

export const addIndexPV = () => {
  return http.get('/stat/index/pv')
}