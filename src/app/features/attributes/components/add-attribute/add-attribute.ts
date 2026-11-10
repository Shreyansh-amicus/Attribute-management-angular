import {
  AsyncPipe,
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
import { StoreService } from '../../../../core/services/store';

@Component({
  selector: 'app-add-attribute-page',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  styleUrl: './add-attribute.css',
  templateUrl: './add-attribute.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAttributePage implements OnInit {
  private readonly lookupService = inject(Lookup);
  private readonly attributeService = inject(AttributeService);
  private readonly store = inject(StoreService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Observable containing centralized lookup data.
  readonly lookups$ = this.store.lookups$;

  // Customer locations filtered by the selected Business Unit.
  filteredCustomerLocations: ICustomerLocationLookUp[] = [];

  submitted = false;
  isLoadingLookups = true;
  lookupsLoaded = false;
  isSaving = false;

  successMessage = '';
  errorMessage = '';

  // Reactive form.
  attributeForm = new FormGroup({
    AttributeName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        attributeNameValidator(),
      ],
    }),

    BusinessUnitId: new FormControl<number | null>(
      null,
      Validators.required,
    ),

    CustomerLocationId: new FormControl<number | null>(
      { value: null, disabled: true },
      Validators.required,
    ),

    CompanyId: new FormControl<number | null>(
      null,
      Validators.required,
    ),

    IsActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadLookups();
    this.setupBusinessUnitListener();
  }

  // Fetch lookup data and store it centrally.
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

          // Update centralized application state.
          this.store.setLookups(response);

          this.lookupsLoaded = true;
          this.isLoadingLookups = false;

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Failed to load lookup data:', error);

          this.errorMessage =
            'Unable to load form data. Please refresh the page and try again.';

          this.isLoadingLookups = false;
          this.lookupsLoaded = false;

          this.cdr.markForCheck();
        },
      });
  }

  // React when the selected Business Unit changes.
  private setupBusinessUnitListener(): void {
    this.attributeForm.controls.BusinessUnitId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((businessUnitId) => {
        const locationControl =
          this.attributeForm.controls.CustomerLocationId;

        // Reset previously selected location.
        locationControl.reset(null);

        // Read the latest lookup state.
        const allCustomerLocations =
          this.store.snapshot.lookups.customerLocations;

        // Filter locations based on selected Business Unit.
        this.filteredCustomerLocations =
          businessUnitId === null
            ? []
            : allCustomerLocations.filter(
                (location) =>
                  location.BusinessUnitId === businessUnitId,
              );

        // Enable or disable the location dropdown.
        if (businessUnitId === null) {
          locationControl.disable();
        } else {
          locationControl.enable();
        }

        this.cdr.markForCheck();
      });
  }

  // Check whether a form control should display validation errors.
  showError(
    controlName: keyof typeof this.attributeForm.controls,
  ): boolean {
    const control = this.attributeForm.controls[controlName];

    return control.invalid && (control.touched || this.submitted);
  }

  // POST: Create a new attribute.
  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Prevent submission before lookup data is available.
    if (!this.lookupsLoaded || this.isLoadingLookups) {
      this.errorMessage =
        'Please wait until the lookup data has loaded.';

      return;
    }

    // Prevent invalid or duplicate submissions.
    if (this.attributeForm.invalid || this.isSaving) {
      this.attributeForm.markAllAsTouched();
      return;
    }

    const formValue = this.attributeForm.getRawValue();

    // Get the latest lookup data from the store.
    const lookups = this.store.snapshot.lookups;

    const selectedBusinessUnit = lookups.businessUnits.find(
      (unit: IBusinessUnit) =>
        unit.BusinessUnitId === formValue.BusinessUnitId,
    );

    const selectedCompany = lookups.companies.find(
      (company: ICompany) =>
        company.CompanyId === formValue.CompanyId,
    );

    const selectedLocation = lookups.customerLocations.find(
      (location: ICustomerLocationLookUp) =>
        location.CustomerLocationId === formValue.CustomerLocationId,
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

    // Create the new attribute object.
    // AttributeId is generated by JSON Server.
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

          console.log(
            'Attribute created and added to store:',
            createdAttribute,
          );

          // The AttributeService already updates the store.
          // Navigate after successful API creation.
          void this.router.navigate(['/attributes']);
        },

        error: (error) => {
          console.error('Failed to create attribute:', error);

          this.isSaving = false;

          this.errorMessage =
            'Unable to create the attribute. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }
}