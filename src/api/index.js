import { http } from "./request"

export const getCourseList = (queries = {}) => {
  return http.post('/course/list', {
    pageNum: 1,
    pageSize: 20,
    ...queries
  })
}

export const getExamListByCourseId = (courseId) => {
  return http.get('/exam/course/' + courseId)
}

export const getQuestionListByExamId = (examId) => {
  return http.get('/question/exam/' + examId)
}