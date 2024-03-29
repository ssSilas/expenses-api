export interface LoginData {
  email: string;
  password: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface DataUserModel {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface DataUserExist {
  id?: number;
  email: string;
  password: string;
}
