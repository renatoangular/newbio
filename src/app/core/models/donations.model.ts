class DonationsModel {
    constructor(
    public itemName: string,
    public donatedBy: string,
    public quantity: string,
    public MT: string,
    public category: String,
    public donatedDatetime: String,
    public description: string,
    public viewPublic: Boolean,
    public _id?: string, // _id is present if editing or returning from DB
  ) { }
}


class FormDonationsModel {
  constructor(
    public itemName: String,
    public donatedBy: String,
    public quantity: string,
    public MT: string,
    public category: String,
    public donatedDatetime: String,
    public description: String,
    public viewPublic: Boolean
  ) { }
}

export { DonationsModel, FormDonationsModel };
