# Lab 7: Student login and profile drafts

## Run

```sh
npm ci
npm start
```

Open http://localhost:4200. Use `mock.user@student.giu-uni.de` with `password123`.
The supplied Express practice API runs with Angular; no separate backend is needed.

## Task 1

- The login page uses a reactive form with required/email validation and an eight-character minimum password.
- Errors appear after touching a field or submitting. The password eye button changes visibility.
- The supplied server sets an HttpOnly `giu_session` cookie. Remember me gives it a seven-day lifetime; otherwise it is a session cookie.
- AuthService exposes a read-only user signal. The header switches to My Profile after login.
- The app restores the session after a reload, and the profile guard checks the server before redirecting a signed-out visitor.

## Task 2

- The profile starts with the signed-in student's directory data, then restores their saved draft if present.
- Quote, story, moment and next-step limits are 160, 1,000, 200 and 120 characters.
- `toSignal` connects form changes to the live preview and counters.
- StoryDraftService saves JSON under `giu:story-draft:<studentId>` and catches storage errors. Malformed drafts are ignored.
- Saving allows incomplete forms. Signing out leaves saved drafts in place.
- Navigation, sign-out and closing the tab warn about unsaved edits.

The supplied Task 2 instructions leave Publish profile disabled. The provided API has no publishing endpoint. Photo upload is listed as an optional challenge, so the current directory photo is displayed without offering a non-working upload control.

## Verification

```sh
npm run build -- --configuration development
npm test -- --watch=false
```

Browser checklist:

1. Submit empty fields, then try an invalid email and a short password.
2. Try a wrong password: the server message appears and no cookie is created.
3. Sign in with and without Remember me; inspect the cookie's HttpOnly flag and lifetime.
4. Reload `/profile`: it stays signed in. Delete the cookie and reload: it redirects to `/login`.
5. Edit the quote: the counter, preview and unsaved status update immediately.
6. Save an incomplete draft, reload and open a second tab: the draft and timestamp return.
7. Sign out and back in: the saved draft remains.
8. Put invalid JSON in the draft key and reload: the page falls back to directory data.
9. Try leaving with unsaved edits: Cancel keeps the form; Leave discards only the unsaved changes.

## Explaining the choices

The server needs the login cookie to identify the session. The draft belongs in local storage because it must survive closing a tab and does not need to travel with requests. Session storage would disappear when its tab closes. HttpOnly prevents JavaScript from reading the cookie; the browser still sends it to the server. The signal is only the current UI state, so `/mock-api/me` restores it after a reload.

`touched` means a field has lost focus; `dirty` means the user changed it. Drafts may be unfinished, which is why Save draft does not check form validity. Student-specific keys avoid mixing drafts, but local storage is not private on a shared computer: another person using the same browser can inspect it.
