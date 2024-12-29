export type studentType = {
  id: number;
  username: string;
  password: string;
  grade: number;
  isBlocked: boolean;
  parent_phone: string;
  BlockReason: string;
};

export type homeworkType = {
  id: number;
  homework_name: string;
  grade: number;
  created_at: string;
  term_id: number;
  cover: File | null;
};

export type testType = {
  id: number;
  test_name: string;
  grade: number;
  created_at: string;
  expire_date: string;
  term_id: number;
  cover: File | null;
};

export type questionType = {
  id: number;
  question: string;
  grade_id: number;
  term_id: number;
  bank: boolean;
  image: File | null;
};

export type TermType = {
  id: number;
  term_name: string;
};

export type GradeType = {
  id: number;
  grade_name: string;
};

export type publictestType = {
  id: number;
  test_name: string;
  grade: number;
  created_at: string;
  expire_date: string;
  term_id: number;
};

export type HomeworkChartData = {
  result: string;
  month: string;
};

export type TestsChartData = {
  result: string;
  month: string;
};

export type videoType = {
  id?: number;
  title: string;
  link: string;
  grade_id: number;
  term_id: number;
};
