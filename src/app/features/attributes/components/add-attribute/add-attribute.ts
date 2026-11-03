import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IBusinessUnit } from '../../../../shared/models/IBusinessUnit.model';
import { ICompany } from '../../../../shared/models/ICompany.model';
import { ICustomerLocationLookUp } from '../../../../shared/models/ILookup.model';
import { IAttributeModel } from '../../../../shared/models/IAttribute.model';

import { attributeNameValidator } from '../../../../shared/validator/attribute-name.validator';
import { AttributeService } from '../../../../core/services/attribute-service';
import { Lookup } from '../../../../core/services/lookup';

@Component({
  selector: 'app-add-attribute-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './add-attribute.css',
  templateUrl: './add-attribute.html',
})
export class AddAttributePage implements OnInit {
  private readonly lookupService = inject(Lookup);
  private readonly destroyRef = inject(DestroyRef);
  private readonly attributeService = inject(AttributeService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  businessUnits: IBusinessUnit[] = [];
  allCustomerLocations: ICustomerLocationLookUp[] = [];
  filteredCustomerLocations: ICustomerLocationLookUp[] = [];
  companies: ICompany[] = [];

  submitted = false;
  isLoadingLookups = true;
  lookupsLoaded = false;
  isSaving = false;

  successMessage = '';
  errorMessage = '';

  attributeForm = new FormGroup({
    AttributeName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), attributeNameValidator()],
    }),

    BusinessUnitId: new FormControl<number | null>(null, Validators.required),

    CustomerLocationId: new FormControl<number | null>(
      { value: null, disabled: true },
      Validators.required,
    ),

    CompanyId: new FormControl<number | null>(null, Validators.required),

    IsActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadLookups();
    this.setupBusinessUnitListener();
  }

  // Fetch all lookup data from the API.

  private loadLookups(): void {
    this.isLoadingLookups = true;
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

          this.businessUnits = response.businessUnits;
          this.companies = response.companies;
          this.allCustomerLocations = response.customerLocations;

          this.lookupsLoaded = true;
          this.isLoadingLookups = false;

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load lookup data:', error);

          this.errorMessage = 'Unable to load form data. Please refresh the page and try again.';

          this.isLoadingLookups = false;
          this.cdr.markForCheck();
        },
      });
  }

  // React when the selected Business Unit changes.
  private setupBusinessUnitListener(): void {
    this.attributeForm.controls.BusinessUnitId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((businessUnitId) => {
        const locationControl = this.attributeForm.controls.CustomerLocationId;

        locationControl.reset(null);

        this.filteredCustomerLocations =
          businessUnitId === null
            ? []
            : this.allCustomerLocations.filter(
                (location) => location.BusinessUnitId === businessUnitId,
              );

        if (businessUnitId === null) {
          locationControl.disable();
        } else {
          locationControl.enable();
        }
      });
  }

  showError(controlName: keyof typeof this.attributeForm.controls): boolean {
    const control = this.attributeForm.controls[controlName];

    return control.invalid && (control.touched || this.submitted);
  }

  // POST: Create a new attribute.
  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.attributeForm.invalid || this.isSaving) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const formValue = this.attributeForm.getRawValue();

    const selectedBusinessUnit = this.businessUnits.find(
      (unit) => unit.BusinessUnitId === formValue.BusinessUnitId,
    );

    const selectedCompany = this.companies.find(
      (company) => company.CompanyId === formValue.CompanyId,
    );

    const selectedLocation = this.allCustomerLocations.find(
      (location) => location.CustomerLocationId === formValue.CustomerLocationId,
    );

    if (!selectedBusinessUnit || !selectedCompany || !selectedLocation) {
      this.errorMessage =
        'Please select valid Business Unit, Company and Customer Location values.';
      return;
    }

    // Do not generate AttributeId here.
    // json-server generates the ID for the new record.
    const newAttribute: Omit<IAttributeModel, 'AttributeId'> = {
      AttributeName: formValue.AttributeName.trim(),
      BusinessUnitName: selectedBusinessUnit.BusinessUnitName,
      CompanyName: selectedCompany.CompanyName,
      CustomerLocationName: selectedLocation.CustomerLocationName,
      IsActive: formValue.IsActive,
      CreatedOn: new Date(),
      CreatedBy: 'Admin',
    };

    this.isSaving = true;

    this.attributeService
      .createAttribute(newAttribute)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdAttribute) => {
          this.isSaving = false;

          this.successMessage = 'Attribute added successfully!';

          console.log('Attribute created through API:', createdAttribute);

          // Navigate only after the API confirms successful creation.
          void this.router.navigate(['/attributes']);
        },
        error: (error) => {
          console.error('Failed to create attribute:', error);

          this.isSaving = false;
          this.errorMessage = 'Unable to create the attribute. Please try again.';
        },
      });
  }
}
