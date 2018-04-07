export class DcommentModel {
  constructor(
    public userId: string,
    public name: string,
    public eventId: string,
    public wishList: boolean,
    public numberWished?: number,
    public comments?: string,
    public _id?: string, // _id is present if editing or returning from DB
  ) { }
}
