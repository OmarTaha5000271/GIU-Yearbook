/* =====================================================================
   FILE: src/environments/environment.ts
   WHY:  One place for settings that change between "now" (fake data)
         and "later" (the Laravel backend).

   HOW THE SWITCH WORKS
   - useMockApi: true  -> services read JSON files from /public/mock-api
   - useMockApi: false -> services call the real Laravel API at apiUrl

   STEP 1: Keep useMockApi = true during the frontend phase.
   STEP 2 (later, backend phase): start Laravel with `php artisan serve`,
           set useMockApi to false and check that apiUrl matches.
   ===================================================================== */
export const environment = {
  useMockApi: true,
  apiUrl: 'http://localhost:8000/api',
};
