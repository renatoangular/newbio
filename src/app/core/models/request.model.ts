export class RequestModel {
  constructor(
    public userId: string,
    public name: string,
    public donationsID: string,
    public wishList: boolean,
    public quantity?: number,
    public comments?: string,
    public _id?: string, // _id is present if editing or returning from DB
  ) { }
}
