import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IAttributeModel } from '../../../../shared/models/IAttribute.model';
import { IBusinessUnit } from '../../../../shared/models/IBusinessUnit.model';
import { ICompany } from '../../../../shared/models/ICompany.model';
import { ICustomerLocationLookUp } from '../../../../shared/models/ILookup.model';

import { AttributeService } from '../../../../core/services/attribute-service';
import { Lookup } from '../../../../core/services/lookup';

@Component({
  selector: 'app-edit-attribute',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-attribute.html',
  styleUrl: './edit-attribute.css',
})
export class EditAttribute implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly attributeService = inject(AttributeService);
  private readonly lookupService = inject(Lookup);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('editForm') editForm?: NgForm;

  businessUnits: IBusinessUnit[] = [];
  companies: ICompany[] = [];
  allCustomerLocations: ICustomerLocationLookUp[] = [];
  filteredCustomerLocations: ICustomerLocationLookUp[] = [];

  originalAttribute?: IAttributeModel;

  submitted = false;
  saved = false;
  isLoading = true;
  isSaving = false;
  lookupsLoaded = false;

  successMessage = '';
  errorMessage = '';

  // Editable model used by the template-driven form.
  form = {
    AttributeName: '',
    BusinessUnitId: null as number | null,
    CustomerLocationId: null as number | null,
    CompanyId: null as number | null,
    IsActive: true,
  };

  ngOnInit(): void {
    // The resolver supplies this attribute before the component loads.
    this.originalAttribute = this.route.snapshot.data['attribute'] as IAttributeModel | undefined;

    if (!this.originalAttribute) {
      this.isLoading = false;
      this.errorMessage = 'The requested attribute could not be loaded.';
      return;
    }

    this.loadLookups();
  }

  // Load all dropdown data from the API.
  private loadLookups(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.lookupsLoaded = false;

    forkJoin({
      businessUnits: this.lookupService.getBusinessUnits(),
      companies: this.lookupService.getCompanies(),
      customerLocations: this.lookupService.getCustomerLocation(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Business Units:', response.businessUnits);
          console.log('Companies:', response.companies);
          console.log('Customer Locations:', response.customerLocations);

          this.businessUnits = response.businessUnits;
          this.companies = response.companies;
          this.allCustomerLocations = response.customerLocations;

          this.populateForm();

          this.lookupsLoaded = true;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load edit form lookup data:', error);

          this.errorMessage = 'Unable to load the form data. Please try again later.';

          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  // Convert the attribute's stored names into dropdown IDs.
  private populateForm(): void {
    if (!this.originalAttribute) {
      return;
    }

    const attribute = this.originalAttribute;

    const businessUnitId =
      this.businessUnits.find((unit) => unit.BusinessUnitName === attribute.BusinessUnitName)
        ?.BusinessUnitId ?? null;

    this.form = {
      AttributeName: attribute.AttributeName,

      BusinessUnitId: businessUnitId,

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

  cancel(): void {
    void this.router.navigate(['/attributes']);
  }

  onBusinessUnitChange(): void {
    // Clear the previous location when the Business Unit changes.
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

  // PUT: Update an existing attribute.
  onSubmit(editForm: NgForm): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (editForm.invalid || !this.originalAttribute || this.isSaving) {
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
      this.errorMessage = 'Please select valid dropdown values.';
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

    this.isSaving = true;

    this.attributeService
      .updateAttribute(this.originalAttribute.AttributeId, updatedAttribute)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          console.log('Attribute updated through API:', updated);

          this.isSaving = false;
          this.saved = true;
          this.successMessage = 'Attribute updated successfully!';

          this.cdr.markForCheck();

          void this.router.navigate(['/attributes']);
        },
        error: (error) => {
          console.error('Failed to update attribute:', error);

          this.isSaving = false;
          this.errorMessage = 'Unable to update the attribute. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  // Used by the CanDeactivate guard.
  canDeactivate(): boolean {
    if (this.saved || !this.editForm?.dirty) {
      return true;
    }

    return confirm('You have unsaved changes. Do you want to leave this page?');
  }
}
