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