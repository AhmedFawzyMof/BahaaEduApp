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

export type TermType = {
  id: number;
  term_name: string;
};

export type GradeType = {
  id: number;
  grade_name: string;
};
