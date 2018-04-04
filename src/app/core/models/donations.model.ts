class DonationsModel {
    constructor(
    public itemName: string,
    public donatedBy: string,
    public category: string,
    public donatedDatetime: Date,
    public checkedOutDatetime: Date,
    public viewPublic: boolean,
    public description?: string,
    public _id?: string // _id is present if editing or returning from DB
  ) { }
}


class FormDonationsModel {
  constructor(
    public itemName: string,
    public donatedBy: string,
    public category: string,
    public donatedDatetime: string,
    public checkedOutDatetime: string,
    public viewPublic: boolean,
    public description?: string
  ) { }
}

export { DonationsModel, FormDonationsModel };
