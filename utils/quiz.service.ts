import { AxiosResponse } from "axios";
import request from "./api";

export const deleteQuizQuestion = (questionId: string) => {
  return request("DELETE", `/quizzes/questions/${questionId}`);
};
