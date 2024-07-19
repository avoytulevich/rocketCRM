export interface IComposedLeadInfo {
  id: number;
  name: string;
  price: number;
  pipe: {
    id: number;
    name: string;
    statuses: Array<IStatus>;
  };
  created_at: number;
  updated_at: number;
  user: IUser;
}

export interface IStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  account_id: number;
}
export interface IUser {
  user_id: number;
  name: string;
}
