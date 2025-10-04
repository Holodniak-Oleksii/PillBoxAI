export interface ITimeStamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  ts: ITimeStamp;
}
