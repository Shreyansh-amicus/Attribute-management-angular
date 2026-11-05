import { Injectable } from '@angular/core';
import { BehaviorSubject, map, distinctUntilChanged } from 'rxjs';

import { IAttributeModel } from '../../shared/models/IAttribute.model';
import { IBusinessUnit } from '../../shared/models/IBusinessUnit.model';
import { ICompany } from '../../shared/models/ICompany.model';
import { ICustomerLocationLookUp } from '../../shared/models/ILookup.model';

// Describes the lookup data maintained by the application.
export interface AttributeLookups {
  businessUnits: IBusinessUnit[];
  companies: ICompany[];
  customerLocations: ICustomerLocationLookUp[];
}

// Defines the complete application state.
export interface AppState {
  attributes: IAttributeModel[];
  lookups: AttributeLookups;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
}

export type UserRole = 'Admin' | 'Viewer' | null;

// Initial application state.
const initialState: AppState = {
  attributes: [],
  lookups: {
    businessUnits: [],
    companies: [],
    customerLocations: [],
  },
  isLoading: false,
  isAuthenticated: false,
  role: null,
};

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // Private BehaviorSubject: only this service can update the state.
  private readonly stateSubject = new BehaviorSubject<AppState>(initialState);

  // Public read-only observable.
  readonly state$ = this.stateSubject.asObservable();

  readonly role$ = this.state$.pipe(
    map((state) => state.role),
    distinctUntilChanged(),
  );

  readonly isAdmin$ = this.role$.pipe(
    map((role) => role === 'Admin'),
    distinctUntilChanged(),
  );

  readonly isViewer$ = this.role$.pipe(
    map((role) => role === 'Viewer'),
    distinctUntilChanged(),
  );

  // Expose individual state slices.
  readonly attributes$ = this.state$.pipe(
    map((state) => state.attributes),
    distinctUntilChanged(),
  );

  readonly lookups$ = this.state$.pipe(
    map((state) => state.lookups),
    distinctUntilChanged(),
  );

  readonly isLoading$ = this.state$.pipe(
    map((state) => state.isLoading),
    distinctUntilChanged(),
  );

  readonly isAuthenticated$ = this.state$.pipe(
    map((state) => state.isAuthenticated),
    distinctUntilChanged(),
  );

  get role(): UserRole {
    return this.stateSubject.value.role;
  }

  setRole(role: UserRole): void {
    this.updateState({ role });
  }

  // Returns the current state synchronously.
  get snapshot(): AppState {
    return this.stateSubject.value;
  }

  // Central method for immutable state updates.
  private updateState(changes: Partial<AppState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...changes,
    });
  }

  // -------------------------
  // Attribute state methods
  // -------------------------

  setAttributes(attributes: IAttributeModel[]): void {
    this.updateState({
      attributes: [...attributes],
    });
  }

  addAttribute(attribute: IAttributeModel): void {
    this.updateState({
      attributes: [...this.snapshot.attributes, attribute],
    });
  }

  updateAttribute(updatedAttribute: IAttributeModel): void {
    this.updateState({
      attributes: this.snapshot.attributes.map((attribute) =>
        attribute.AttributeId === updatedAttribute.AttributeId ? updatedAttribute : attribute,
      ),
    });
  }

  removeAttribute(id: number): void {
    this.updateState({
      attributes: this.snapshot.attributes.filter((attribute) => attribute.AttributeId !== id),
    });
  }

  // -------------------------
  // Lookup state methods
  // -------------------------

  setLookups(lookups: AttributeLookups): void {
    this.updateState({
      lookups: {
        businessUnits: [...lookups.businessUnits],
        companies: [...lookups.companies],
        customerLocations: [...lookups.customerLocations],
      },
    });
  }

  // -------------------------
  // Application state methods
  // -------------------------

  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setAuthenticated(isAuthenticated: boolean): void {
    this.updateState({
      isAuthenticated,
      role: isAuthenticated ? this.snapshot.role : null,
    });
  }
}
