import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAttributeModel } from '../../../../shared/models/IAttribute.model';
import { IBusinessUnit } from '../../../../shared/models/IBusinessUnit.model';
import { ICompany } from '../../../../shared/models/ICompany.model';
import { ICustomerLocationLookUp } from '../../../../shared/models/ILookup.model';
import { AttributeService } from '../../../../core/services/attribute-service';
import { Lookup } from '../../../../core/services/lookup';

@Component({
  selector: 'app-edit-attribute',
  imports: [FormsModule],
  templateUrl: './edit-attribute.html',
  styleUrl: './edit-attribute.css',
})
export class EditAttribute implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly attributeService = inject(AttributeService);
  private readonly lookupService = inject(Lookup);

  @ViewChild('editForm') editForm?: NgForm;

  businessUnits: IBusinessUnit[] = this.lookupService.getBusinessUnits();
  companies: ICompany[] = this.lookupService.getCompanies();
  allCustomerLocations: ICustomerLocationLookUp[] = this.lookupService.getCustomerLocation();

  filteredCustomerLocations: ICustomerLocationLookUp[] = [];

  originalAttribute?: IAttributeModel;
  submitted = false;
  successMessage = '';

  // This is the template-driven form's editable model.
  form = {
    AttributeName: '',
    BusinessUnitId: null as number | null,
    CustomerLocationId: null as number | null,
    CompanyId: null as number | null,
    IsActive: true,
  };

  cancel(): void {
    void this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // Get the attribute fetched by the resolver.
    this.originalAttribute = this.route.snapshot.data['attribute'] as IAttributeModel;

    const attribute = this.originalAttribute;

    // Convert the stored names back to dropdown IDs.
    this.form = {
      AttributeName: attribute.AttributeName,

      BusinessUnitId:
        this.businessUnits.find((unit) => unit.BusinessUnitName === attribute.BusinessUnitName)
          ?.BusinessUnitId ?? null,

      CustomerLocationId:
        this.allCustomerLocations.find(
          (location) => location.CustomerLocationName === attribute.CustomerLocationName,
        )?.CustomerLocationId ?? null,

      CompanyId:
        this.companies.find((company) => company.CompanyName === attribute.CompanyName)
          ?.CompanyId ?? null,

      IsActive: attribute.IsActive,
    };

    this.updateFilteredLocations();
  }

  onBusinessUnitChange(): void {
    // Clear a location that doesn't belong to the newly selected unit.
    this.form.CustomerLocationId = null;
    this.updateFilteredLocations();
  }

  private updateFilteredLocations(): void {
    this.filteredCustomerLocations =
      this.form.BusinessUnitId === null
        ? []
        : this.allCustomerLocations.filter(
            (location) => location.BusinessUnitId === this.form.BusinessUnitId,
          );
  }

  onSubmit(editForm: NgForm): void {
    this.submitted = true;
    this.successMessage = '';

    if (editForm.invalid || !this.originalAttribute) {
      editForm.control.markAllAsTouched();
      return;
    }

    const selectedBusinessUnit = this.businessUnits.find(
      (unit) => unit.BusinessUnitId === this.form.BusinessUnitId,
    );

    const selectedCompany = this.companies.find(
      (company) => company.CompanyId === this.form.CompanyId,
    );

    const selectedLocation = this.allCustomerLocations.find(
      (location) => location.CustomerLocationId === this.form.CustomerLocationId,
    );

    if (!selectedBusinessUnit || !selectedCompany || !selectedLocation) {
      return;
    }

    const updatedAttribute: IAttributeModel = {
      ...this.originalAttribute,
      AttributeName: this.form.AttributeName.trim(),
      BusinessUnitName: selectedBusinessUnit.BusinessUnitName,
      CompanyName: selectedCompany.CompanyName,
      CustomerLocationName: selectedLocation.CustomerLocationName,
      IsActive: this.form.IsActive,
      UpdatedOn: new Date(),
      UpdatedBy: 'Admin',
    };

    const updated = this.attributeService.updateAttribute(updatedAttribute);

    if (updated) {
      // Allow navigation because the changes have been saved.
      this.saved = true;
      void this.router.navigate(['/']);
    }
  }

  saved = false;

  canDeactivate(): boolean {
    // If changes have already been saved, allow navigation.
    if (this.saved) {
      return true;
    }

    // If the form is not dirty, there are no unsaved changes.
    if (!this.editForm?.dirty) {
      return true;
    }

    // Ask for confirmation before leaving.
    return confirm('You have unsaved changes. Do you want to leave this page?');
  }
}
