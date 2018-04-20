class RegisterModel {
  constructor(
    public email: string,
    public name: string,
    public password: string,
    public isadmin: boolean,
    public getnewsletter: boolean,
    public _id?: string, // _id is present if editing or returning from DB
  ) { }
}

 class FormRegisterModel {
  constructor(
    public email: string,
    public name: string,
    public password: string,
    public isadmin: boolean,
    public getnewsletter: boolean

  ) { }
}

export { RegisterModel, FormRegisterModel };
