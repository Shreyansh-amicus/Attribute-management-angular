# Task 12 – Deliberately Introduced and Fixed Bugs

This task demonstrates three common RxJS issues in Angular applications: subscription memory leaks, incorrect handling of concurrent HTTP requests, and missing previously emitted values when using a Subject.

## Bug A – Subscription Memory Leak

### Problem

![Subscription inside ngOnInit without unsubscribing](screenshots/Subscribe%20inside%20ngOnInit.png)

A subscription was created inside `ngOnInit()` using `interval()` without implementing any unsubscribe mechanism.

```ts
ngOnInit(): void {
  interval(2000).subscribe((count) => {
    console.log(`AttributeList instance is still running: ${count}`);
  });
}
```

### Steps to reproduce

1. Open the Attribute List page.
2. Open the browser console.
3. Navigate away from the Attribute List page.
4. Navigate back to it.
5. Repeat the navigation process five times.

### Observation

Multiple interval subscriptions continue logging messages even after navigating away from the component.

Each time the component is recreated, a new interval subscription is started. The subscriptions belonging to previously destroyed component instances continue running.

### Root cause

Angular destroys the component when navigating away, but manually created RxJS subscriptions are not automatically unsubscribed.

Since `interval()` is a long-running Observable, its subscription continues indefinitely unless explicitly stopped.

### Solution

Use `takeUntilDestroyed()` to automatically unsubscribe when the component is destroyed.

```ts
ngOnInit(): void {
  interval(2000)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((count) => {
      console.log(`AttributeList instance is running: ${count}`);
    });
}
```

### Conclusion

Subscriptions to long-running Observables must be cleaned up when their owning component is destroyed. `takeUntilDestroyed()` provides a convenient Angular solution.

Note: An ordinary HttpClient GET request completes after its response, so an uncleaned GET subscription alone does not necessarily demonstrate a persistent memory leak.

---

## Bug B – Using mergeMap Instead of switchMap

![Using mergeMap instead of switchMap](screenshots/mergeMap%20instead%20of%20switchMap.png)

### Problem

The search pipeline originally used `switchMap()` to process search requests. It was temporarily replaced with `mergeMap()`.

```ts
mergeMap((searchTerm) => {
  const request$ = searchTerm
    ? this.attributeService.searchAttributes(searchTerm)
    : this.attributeService.getAttributes();

  return request$;
})
```

### Steps to reproduce

1. Open the Attribute List page.
2. Enter a search term such as `Fin`.
3. Quickly change the search term to `Finance`.
4. Observe the Network tab and console.
5. Compare the results and request completion order.

### Observation

Multiple HTTP requests can execute concurrently.

If an older search request takes longer than a newer request, the newer results may appear first. The older request can subsequently complete and overwrite the latest results.

### Root cause

`mergeMap()` subscribes to multiple inner Observables concurrently. It does not cancel previous requests when a new search term arrives.

This can cause race conditions where outdated search results overwrite the latest results.

### Solution

Use `switchMap()` instead.

```ts
switchMap((searchTerm) => {
  const request$ = searchTerm
    ? this.attributeService.searchAttributes(searchTerm)
    : this.attributeService.getAttributes();

  return request$;
})
```

### Conclusion

`switchMap()` is appropriate for search functionality because it keeps the latest request relevant and unsubscribes from the previous inner Observable when a newer search term arrives.

`mergeMap()` is useful when multiple asynchronous operations should run concurrently and all their results are needed.

---

## Bug C – Using Subject Instead of BehaviorSubject

### Problem

A service was temporarily implemented using `Subject`.

```ts
private readonly selectedAttributeSubject = new Subject<string>();

readonly selectedAttribute$ =
  this.selectedAttributeSubject.asObservable();
```

A value was emitted before a component subscribed to the Observable.

```ts
this.selectedAttributeSubject.next('Cost Center Code');
```

### Steps to reproduce

1. Emit a value through the service.
2. Navigate to or initialize a component that subscribes afterward.
3. Observe the browser console.

### Observation

The component does not receive the previously emitted value.

### Root cause

A normal `Subject` does not store previous emissions. It only sends values to subscribers that are already subscribed when the value is emitted.

Therefore, subscribers that subscribe later do not receive earlier values.

### Solution

Replace `Subject` with `BehaviorSubject`.

```ts
private readonly selectedAttributeSubject =
  new BehaviorSubject<string | null>(null);

readonly selectedAttribute$ =
  this.selectedAttributeSubject.asObservable();
```

### Conclusion

`BehaviorSubject` stores the latest emitted value and immediately sends it to new subscribers.

It is useful for shared application state where components may subscribe at different times.

---

## Summary

| Bug | Root cause | Solution |
|---|---|---|
| Bug A | Subscription not cleaned up | takeUntilDestroyed() |
| Bug B | Concurrent search requests | switchMap() |
| Bug C | Subject does not replay values | BehaviorSubject |

## Overall Learning

These exercises demonstrate why subscription management, appropriate RxJS operators, and the correct type of Subject are important in Angular applications.

- Use `takeUntilDestroyed()` to prevent subscriptions from outliving their components.
- Use `switchMap()` when only the latest asynchronous request matters.
- Use `BehaviorSubject` when newly subscribing components need the latest application state.

These concepts are especially important when implementing centralized state management using a StoreService.