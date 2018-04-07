class DonationsModel {
    constructor(
    public itemName: string,
    public donatedBy: string,
    public category: string,
    public donatedDatetime: string,
    public description: string,
    public viewPublic: Boolean,
    public _id?: string, // _id is present if editing or returning from DB
  ) { }
}


class FormDonationsModel {
  constructor(
    public itemName: string,
    public donatedBy: string,
    public category: string,
    public donatedDatetime: string,
    public description: string,
    public viewPublic: Boolean
  ) { }
}

export { DonationsModel, FormDonationsModel };
