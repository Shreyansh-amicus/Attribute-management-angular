# Angular assignment - Attribute management

## Assignment - 1

### Task 1 - Create a new angular application

- Project initialization       
![Project initialization](screenshots/Initialize%20the%20project.png)

- Why does Angular offer both approaches?      
Angular offers both approaches because the ngModule approach has been present since a very long time and a lot of enterprise applications and packages are written in ngModule, whereas the standalone approach has been the default since Angular 17 making it backward compatible and easier to learn and use Angular.

- In what kind of project would you pick standalone over NgModule?      
Standalone has been the default approach that Angular has opted since Angular 17 because it reduces a lot of boilerplate code and makes development easier and faster as compared to NgModules. I would prefer standalone over NgModules in almost every situation where we don't have to explicity use the rigid, heavy modular approach provided by the NgModules.

### Task 2 - Create TypeScript interfaces

![Interfaces](screenshots/Interfaces.png)

### Task 3 - Create Attribute Service

- Create AttributeService
![Create AttributeService](screenshots/Create%20AttribueService.png)

- In-memory array of at least 8 diverse Attribute records
![In-memory array of at least 8 diverse Attribute records](screenshots/Mock%20attributes.png)

- What would change if you provided this service at component level? When would you choose that?             
If this service was provided at a component level, then we would have to describe the in memory attribute array and all the related methods to the attribute array in each and every component where it is used, whereas with the service AttributeService we have a global store through which all the components can share the data instead of repeating the same code at multiple places. I would choose the component level definition of the array and methods where only that specific component uses the data and methods of the service.

### Task 4 - Create AttributeListComponent

- Create AttributeListComponent
![Create AttributeListComponent](screenshots/Create%20AttributeList%20component.png)