export interface IAttributeModel{
    AttributeId : number;
    AttributeName : string;
    BusinessUnitName : string;
    CustomerLocationName ?: string;
    CompanyName ?: string;
    IsActive : boolean;
    CreatedOn : Date;
    CreatedBy ?: string;
    UpdatedOn ?: Date;
    UpdatedBy ?: string;
};