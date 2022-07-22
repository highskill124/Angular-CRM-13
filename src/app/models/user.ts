export interface IUser {
  admin: boolean;
  alternate_phone: number;
  cell_phone: number;
  created_on: string;
  email: string;
  email_alternate: string;
  f_name: string;
  fax_number: string;
  guid: string;
  l_name: string;
  loocked: boolean;
  m_name: string;
  office_phone: number;
  suffix: string;
  title: string;
  updated_on: string;
  user_name: string;
}

export class User {

  admin?: boolean;
  alternate_phone?: number;
  cell_phone?: number;
  created_on?: string;
  email?: string;
  email_alternate?: string;
  f_name?: string;
  fax_number?: string;
  guid?: string;
  l_name?: string;
  loocked?: boolean;
  m_name?: string;
  office_phone?: number;
  suffix?: string;
  title?: string;
  updated_on?: string;
  user_name?: string;

  constructor (user) {
    this.admin = user.admin === 1;
    this.alternate_phone = user.alternate_phone;
    this.cell_phone = user.cell_phone;
    this.created_on = user.created_on;
    this.email = user.email;
    this.email_alternate = user.email_alternate;
    this.f_name = user.f_name;
    this.fax_number = user.fax_number;
    this.guid = user.guid;
    this.l_name = user.l_name;
    this.loocked = user.loocked ? true : false;
    this.m_name = user.m_name;
    this.office_phone = user.office_phone;
    this.suffix = user.suffix;
    this.title = user.title;
    this.updated_on = user.updated_on;
    this.user_name = user.user_name;
  }

  getDisplayName() {
    return this.f_name + ' ' + this.m_name;
  }
  getFullName() {
    return this.f_name + ' ' + this.m_name + ' ' + this.l_name;
  }
}

export interface IUserList {
  f_name: string;
  l_name: string;
  guid: string;
  user_name: string;
}
