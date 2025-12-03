export type Task = {
  id: number;
  title: string;
  description?: string;
  done: boolean;
}

export type FormState = {
  title: string;
  description?: string;
}