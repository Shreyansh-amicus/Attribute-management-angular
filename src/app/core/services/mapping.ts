import { Injectable } from '@angular/core';

import { IAttributeModel } from '../../shared/models/IAttribute.model';
import { AttributeDTO, CreateAttributeDTO } from '../../shared/models/attribute.dto';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  // API DTO -> Angular application model
  toAttribute(dto: AttributeDTO): IAttributeModel {
    return {
      AttributeId: dto.attribute_id,
      AttributeName: dto.attribute_name,
      BusinessUnitName: dto.business_unit_name,
      CompanyName: dto.company_name,
      CustomerLocationName: dto.customer_location_name,
      IsActive: dto.is_active,
      CreatedOn: new Date(dto.created_on),
      UpdatedOn: dto.updated_on ? new Date(dto.updated_on) : undefined,
      CreatedBy: dto.created_by,
      UpdatedBy: dto.updated_by,
    };
  }

  // Angular application model -> API DTO
  toDTO(attribute: IAttributeModel): AttributeDTO {
    return {
      attribute_id: attribute.AttributeId,
      attribute_name: attribute.AttributeName,
      business_unit_name: attribute.BusinessUnitName,
      company_name: attribute.CompanyName,
      customer_location_name: attribute.CustomerLocationName,
      is_active: attribute.IsActive,
      created_on: attribute.CreatedOn.toISOString(),
      created_by: attribute.CreatedBy,
      updated_on: attribute.UpdatedOn?.toISOString(),
      updated_by: attribute.UpdatedBy,
    };
  }

  // Create payload: the API generates attribute_id
  toCreateDTO(attribute: Omit<IAttributeModel, 'AttributeId'>): CreateAttributeDTO {
    return {
      attribute_name: attribute.AttributeName,
      business_unit_name: attribute.BusinessUnitName,
      company_name: attribute.CompanyName,
      customer_location_name: attribute.CustomerLocationName,
      is_active: attribute.IsActive,
      created_on: attribute.CreatedOn.toISOString(),
      created_by: attribute.CreatedBy,
      updated_on: attribute.UpdatedOn?.toISOString(),
      updated_by: attribute.UpdatedBy,
    };
  }

  toPartialDTO(changes: Partial<IAttributeModel>): Partial<AttributeDTO> {
    const dto: Partial<AttributeDTO> = {};

    if (changes.AttributeName !== undefined) {
      dto.attribute_name = changes.AttributeName;
    }

    if (changes.BusinessUnitName !== undefined) {
      dto.business_unit_name = changes.BusinessUnitName;
    }

    if (changes.CompanyName !== undefined) {
      dto.company_name = changes.CompanyName;
    }

    if (changes.CustomerLocationName !== undefined) {
      dto.customer_location_name = changes.CustomerLocationName;
    }

    if (changes.IsActive !== undefined) {
      dto.is_active = changes.IsActive;
    }

    if (changes.CreatedOn !== undefined) {
      dto.created_on = changes.CreatedOn.toISOString();
    }

    if (changes.CreatedBy !== undefined) {
      dto.created_by = changes.CreatedBy;
    }

    if (changes.UpdatedOn !== undefined) {
      dto.updated_on = changes.UpdatedOn?.toISOString();
    }

    if (changes.UpdatedBy !== undefined) {
      dto.updated_by = changes.UpdatedBy;
    }

    return dto;
  }
}
