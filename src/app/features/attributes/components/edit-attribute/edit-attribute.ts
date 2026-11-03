import { AsyncPipe } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

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
import { StoreService } from '../../../../core/services/store';

@Component({
  selector: 'app-edit-attribute',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './edit-attribute.html',
  styleUrl: './edit-attribute.css',
})
export class EditAttribute implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly attributeService = inject(AttributeService);
  private readonly lookupService = inject(Lookup);
  private readonly store = inject(StoreService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('editForm') editForm?: NgForm;

  // Observable containing centralized lookup data.
  readonly lookups$ = this.store.lookups$;

  // Locations filtered according to the selected Business Unit.
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
    this.originalAttribute =
      this.route.snapshot.data['attribute'] as
        | IAttributeModel
        | undefined;

    if (!this.originalAttribute) {
      this.isLoading = false;
      this.errorMessage =
        'The requested attribute could not be loaded.';

      return;
    }

    this.loadLookups();
  }

  // Fetch lookup data and save it in centralized application state.
  private loadLookups(): void {
    this.isLoading = true;
    this.lookupsLoaded = false;
    this.errorMessage = '';

    forkJoin({
      businessUnits: this.lookupService.getBusinessUnits(),
      companies: this.lookupService.getCompanies(),
      customerLocations: this.lookupService.getCustomerLocation(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Lookup data received:', response);

          // Update centralized lookup state.
          this.store.setLookups(response);

          this.lookupsLoaded = true;
          this.isLoading = false;

          // Populate the form after lookup data is available.
          this.populateForm();

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to load edit form lookup data:',
            error,
          );

          this.errorMessage =
            'Unable to load the form data. Please try again later.';

          this.isLoading = false;
          this.lookupsLoaded = false;

          this.cdr.markForCheck();
        },
      });
  }

  // Convert stored lookup names into dropdown IDs.
  private populateForm(): void {
    if (!this.originalAttribute) {
      return;
    }

    const attribute = this.originalAttribute;
    const lookups = this.store.snapshot.lookups;

    const businessUnitId =
      lookups.businessUnits.find(
        (unit: IBusinessUnit) =>
          unit.BusinessUnitName === attribute.BusinessUnitName,
      )?.BusinessUnitId ?? null;

    const companyId =
      lookups.companies.find(
        (company: ICompany) =>
          company.CompanyName === attribute.CompanyName,
      )?.CompanyId ?? null;

    // First filter locations using the original Business Unit.
    const locations =
      businessUnitId === null
        ? []
        : lookups.customerLocations.filter(
            (location: ICustomerLocationLookUp) =>
              location.BusinessUnitId === businessUnitId,
          );

    // Find the original location only within that Business Unit.
    const customerLocationId =
      locations.find(
        (location) =>
          location.CustomerLocationName ===
          attribute.CustomerLocationName,
      )?.CustomerLocationId ?? null;

    this.form = {
      AttributeName: attribute.AttributeName,
      BusinessUnitId: businessUnitId,
      CustomerLocationId: customerLocationId,
      CompanyId: companyId,
      IsActive: attribute.IsActive,
    };

    this.filteredCustomerLocations = locations;
  }

  // Navigate back to the Attribute List.
  cancel(): void {
    void this.router.navigate(['/attributes']);
  }

  // Handle Business Unit changes.
  onBusinessUnitChange(businessUnitId: number | null): void {
    // Clear the previously selected location.
    this.form.CustomerLocationId = null;

    const allCustomerLocations =
      this.store.snapshot.lookups.customerLocations;

    // Filter locations belonging to the selected Business Unit.
    this.filteredCustomerLocations =
      businessUnitId === null
        ? []
        : allCustomerLocations.filter(
            (location: ICustomerLocationLookUp) =>
              location.BusinessUnitId === businessUnitId,
          );

    this.cdr.markForCheck();
  }

  // PUT: Update an existing attribute.
  onSubmit(editForm: NgForm): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.lookupsLoaded || this.isLoading) {
      this.errorMessage =
        'Please wait until the lookup data has loaded.';

      return;
    }

    if (editForm.invalid || !this.originalAttribute || this.isSaving) {
      editForm.control.markAllAsTouched();
      return;
    }

    // Read the latest lookup records from the store.
    const lookups = this.store.snapshot.lookups;

    const selectedBusinessUnit = lookups.businessUnits.find(
      (unit: IBusinessUnit) =>
        unit.BusinessUnitId === this.form.BusinessUnitId,
    );

    const selectedCompany = lookups.companies.find(
      (company: ICompany) =>
        company.CompanyId === this.form.CompanyId,
    );

    const selectedLocation = lookups.customerLocations.find(
      (location: ICustomerLocationLookUp) =>
        location.CustomerLocationId ===
          this.form.CustomerLocationId &&
        location.BusinessUnitId === this.form.BusinessUnitId,
    );

    // Validate selected lookup records.
    if (
      !selectedBusinessUnit ||
      !selectedCompany ||
      !selectedLocation
    ) {
      this.errorMessage =
        'Please select valid Business Unit, Company and Customer Location values.';

      return;
    }

    // Prepare the updated attribute.
    const updatedAttribute: IAttributeModel = {
      ...this.originalAttribute,

      AttributeName: this.form.AttributeName.trim(),

      BusinessUnitName: selectedBusinessUnit.BusinessUnitName,

      CompanyName: selectedCompany.CompanyName,

      CustomerLocationName:
        selectedLocation.CustomerLocationName,

      IsActive: this.form.IsActive,

      UpdatedOn: new Date(),

      UpdatedBy: 'Admin',
    };

    this.isSaving = true;

    this.attributeService
      .updateAttribute(
        this.originalAttribute.AttributeId,
        updatedAttribute,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          console.log(
            'Attribute updated and store synchronized:',
            updated,
          );

          this.isSaving = false;
          this.saved = true;

          this.successMessage =
            'Attribute updated successfully!';

          this.cdr.markForCheck();

          // Navigate only after successful API update.
          void this.router.navigate(['/attributes']);
        },

        error: (error) => {
          console.error('Failed to update attribute:', error);

          this.isSaving = false;

          this.errorMessage =
            'Unable to update the attribute. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  // Used by the CanDeactivate guard.
  canDeactivate(): boolean {
    if (this.saved || !this.editForm?.dirty) {
      return true;
    }

    return confirm(
      'You have unsaved changes. Do you want to leave this page?',
    );
  }
}