# Lab 6 - Task 1: Save to my yearbook

Every student card has a 44px heart button. Clicking it saves or removes that
student without opening their profile. The header shows the shared Saved count.

`SavedService` is provided at the application root. Its private writable signal
holds student IDs; `ids` exposes a read-only signal and `count` derives the total.
Cards and the header inject the same service, so their displays stay synchronized.
Updates create new arrays so signals notify their consumers.

Selections survive profile navigation because the root service outlives the page.
They reset on browser reload because this task deliberately uses memory only.
Local page state, such as search text, is recreated when the page is recreated.
Keeping the writable signal private prevents components from overwriting the
shared list or bypassing the service's update rules.

## Run and check

```sh
npm ci
npm start
```

Open http://localhost:4200. Save three students: the count becomes 3. Unsave one:
it becomes 2. Open a card's profile, then go back: two hearts remain selected.
Reload: all hearts and the count reset.

```sh
npm test -- --watch=false
npm run build
```

Task 2 (NgRx) is outside this submission.
