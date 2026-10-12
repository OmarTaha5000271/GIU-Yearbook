/* =====================================================================
   FILE: src/app/models/student.model.ts
   WHAT: An INTERFACE describing the shape of one student.
   WHY:  TypeScript can then warn you if you misspell `student.nmae`.
         It is also a contract: the Laravel API will later have to return
         JSON with exactly these fields.

   STEP 1: Look at one student card in Figma. List what it shows:
           portrait, name, faculty, quote.
   STEP 2: Add the fields the app needs but the card does not show
           (id for the link, featured for sorting).
   TIP: An interface exists only while you write code. It disappears
        when the app is built, so it costs nothing at runtime.
   ===================================================================== */

// STEP 3: A union type limits a value to a fixed list of strings.
// Try typing 'Medicine' somewhere below and watch the editor complain.
export type Faculty = 'Engineering' | 'Informatics' | 'Design' | 'Business';

export interface Student {
  id: number;
  name: string;
  faculty: Faculty;
  classYear: number;
  quote: string;
  /** Path to the portrait, relative to the /public folder. */
  photo: string;
  /** Featured students are shown first when "Featured first" is selected. */
  featured: boolean;
}
