import { Component, DestroyRef, inject } from '@angular/core';
import { Lookup } from '../../services/lookup';
import { IBusinessUnit } from '../../models/IBusinessUnit.model';
import { ICompany } from '../../models/ICompany.model';
import { ICustomerLocationLookUp } from '../../models/ILookup.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { attributeNameValidator } from '../../validator/attribute-name.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttributeService } from '../../services/attribute-service';
import { IAttributeModel } from '../../models/IAttribute.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-attribute-page',
  styleUrl: './add-attribute.css',
  templateUrl: './add-attribute.html',
})
export class AddAttributePage {
  private readonly lookupService = inject(Lookup);
  private readonly destroyRef = inject(DestroyRef);
  private readonly attributeService = inject(AttributeService);

  businessUnits: IBusinessUnit[] = this.lookupService.getBusinessUnits();
  allCustomerLocations: ICustomerLocationLookUp[] = this.lookupService.getCustomerLocation();
  filteredCustomerLocations: ICustomerLocationLookUp[] = [];
  companies: ICompany[] = this.lookupService.getCompanies();

  submitted = false;
  successMessage = '';

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

  constructor() {
    console.log('Business units:', this.businessUnits);
    console.log('Companies:', this.companies);
    this.attributeForm.controls.BusinessUnitId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((businessUnitId) => {
        this.attributeForm.controls.CustomerLocationId.reset(null);

        this.filteredCustomerLocations =
          businessUnitId === null
            ? []
            : this.allCustomerLocations.filter(
                (location) => location.BusinessUnitId === businessUnitId,
              );

        if (businessUnitId === null) {
          this.attributeForm.controls.CustomerLocationId.disable();
        } else {
          this.attributeForm.controls.CustomerLocationId.enable();
        }
      });
  }

  showError(controlName: keyof typeof this.attributeForm.controls): boolean {
    const control = this.attributeForm.controls[controlName];

    return control.invalid && (control.touched || this.submitted);
  }

  onSubmit(): void {
    console.count('onSubmit called');
    this.submitted = true;
    this.successMessage = '';

    if (this.attributeForm.invalid) {
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
      this.successMessage = '';
      return;
    }

    const newAttribute: IAttributeModel = {
      AttributeId:
        Math.max(
          0,
          ...this.attributeService.mockAttributes.map((attribute) => attribute.AttributeId),
        ) + 1,

      AttributeName: formValue.AttributeName.trim(),
      BusinessUnitName: selectedBusinessUnit.BusinessUnitName,
      CompanyName: selectedCompany.CompanyName,
      CustomerLocationName: selectedLocation.CustomerLocationName,
      IsActive: formValue.IsActive,
      CreatedOn: new Date(),
      CreatedBy: 'Admin',
    };

    console.log('FORM service ID:', this.attributeService.debugInstanceId);

    this.attributeService.addAttribute(newAttribute);

    this.attributeService.addAttribute(newAttribute);

    console.log('Form page sees:', this.attributeService.mockAttributes);

    this.successMessage = 'Attribute added successfully!';

    console.log('Attribute created:', newAttribute);

    this.attributeForm.reset({
      AttributeName: '',
      BusinessUnitId: null,
      CustomerLocationId: { value: null, disabled: true } as never,
      CompanyId: null,
      IsActive: true,
    });

    this.filteredCustomerLocations = [];
    this.submitted = false;
  }
}
