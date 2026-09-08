Commits:
342a6f3 fix(auth): prevent email data leak and enforce zod validation

Stat summary:
 package-lock.json  | 10 +++++-----
 package.json       |  3 ++-
 src/app/actions.ts | 42 +++++++++++++++++++++++++++++++++++-------
 test-actions.ts    | 24 ++++++++++++++++++++++++
 4 files changed, 66 insertions(+), 13 deletions(-)

Diff:
diff --git a/package-lock.json b/package-lock.json
index 480b820..38d85d7 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -11,21 +11,22 @@
         "@supabase/ssr": "^0.12.6",
         "@supabase/supabase-js": "^2.112.4",
         "canvas-confetti": "^1.9.4",
         "clsx": "^2.1.1",
         "framer-motion": "^13.1.1",
         "lucide-react": "^1.37.0",
         "next": "16.3.3",
         "react": "19.2.8",
         "react-dom": "19.2.8",
         "tailwind-merge": "^3.6.0",
-        "youtube-sr": "^4.3.12"
+        "youtube-sr": "^4.3.12",
+        "zod": "^4.5.4"
       },
       "devDependencies": {
         "@tailwindcss/postcss": "^4",
         "@types/canvas-confetti": "^1.9.0",
         "@types/node": "^20",
         "@types/react": "^19",
         "@types/react-dom": "^19",
         "eslint": "^9",
         "eslint-config-next": "16.3.3",
         "tailwindcss": "^4",
@@ -7087,24 +7088,23 @@
         "url": "https://github.com/sponsors/sindresorhus"
       }
     },
     "node_modules/youtube-sr": {
       "version": "4.3.12",
       "resolved": "https://registry.npmjs.org/youtube-sr/-/youtube-sr-4.3.12.tgz",
       "integrity": "sha512-pAuh5FjCJ6q062lMw6ajr6j9IHKMXk/AZsEo/5xLhJcoO1gN/M2kxwfAwi3d9QLHMPg2DMdBL1DsuWbAsfc5HA==",
       "license": "Apache-2.0"
     },
     "node_modules/zod": {
-      "version": "4.5.2",
-      "resolved": "https://registry.npmjs.org/zod/-/zod-4.5.2.tgz",
-      "integrity": "sha512-XkYXCol10+ba/6F/cueWV+TezUeOqXW0hdeJt5CdXjTYeAgAQg5N03RQdJ80mhfFE72+pblvYMW4wy2Qp4Qbrg==",
-      "dev": true,
+      "version": "4.5.4",
+      "resolved": "https://registry.npmjs.org/zod/-/zod-4.5.4.tgz",
+      "integrity": "sha512-sC95tT5iHHH9gtpj6A81kh+NEaRAUFN+qlUPDUbRfOMvNf5QCBqsb3WgvnpVtK5Y+4UfA6KqufotuTvMGiTlsA==",
       "license": "MIT",
       "funding": {
         "url": "https://github.com/sponsors/colinhacks"
       }
     },
     "node_modules/zod-validation-error": {
       "version": "4.0.2",
       "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
       "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
       "dev": true,
diff --git a/package.json b/package.json
index 459b152..ce4cf46 100644
--- a/package.json
+++ b/package.json
@@ -12,21 +12,22 @@
     "@supabase/ssr": "^0.12.6",
     "@supabase/supabase-js": "^2.112.4",
     "canvas-confetti": "^1.9.4",
     "clsx": "^2.1.1",
     "framer-motion": "^13.1.1",
     "lucide-react": "^1.37.0",
     "next": "16.3.3",
     "react": "19.2.8",
     "react-dom": "19.2.8",
     "tailwind-merge": "^3.6.0",
-    "youtube-sr": "^4.3.12"
+    "youtube-sr": "^4.3.12",
+    "zod": "^4.5.4"
   },
   "devDependencies": {
     "@tailwindcss/postcss": "^4",
     "@types/canvas-confetti": "^1.9.0",
     "@types/node": "^20",
     "@types/react": "^19",
     "@types/react-dom": "^19",
     "eslint": "^9",
     "eslint-config-next": "16.3.3",
     "tailwindcss": "^4",
diff --git a/src/app/actions.ts b/src/app/actions.ts
index f2ef2a5..0cf5c81 100644
--- a/src/app/actions.ts
+++ b/src/app/actions.ts
@@ -1,57 +1,85 @@
 'use server'
 
 import { revalidatePath } from 'next/cache'
 import { redirect } from 'next/navigation'
 import { createClient } from '@/lib/supabase/server'
+import { createClient as createAdminClient } from '@supabase/supabase-js'
 import { detectCountryCode } from '@/lib/geo'
+import { z } from 'zod'
+
+const signupSchema = z.object({
+  email: z.string().email('Correo inv├ílido.'),
+  player_name: z.string()
+    .min(3, 'El apodo debe tener al menos 3 caracteres.')
+    .max(20, 'El apodo no puede tener m├ís de 20 caracteres.')
+    .regex(/^[a-zA-Z0-9_]+$/, 'El apodo solo puede contener letras, n├║meros y guiones bajos.'),
+  password: z.string().min(6, 'La contrase├▒a debe tener al menos 6 caracteres.'),
+})
+
+const loginSchema = z.object({
+  player_name: z.string().min(1, 'El apodo es requerido.'),
+  password: z.string().min(1, 'La contrase├▒a es requerida.'),
+})
 
 export async function login(formData: FormData) {
-  const supabase = await createClient()
-
   const playerName = formData.get('player_name') as string
   const password = formData.get('password') as string
 
+  const parsed = loginSchema.safeParse({ player_name: playerName, password })
+  if (!parsed.success) {
+    return { error: parsed.error.issues[0].message }
+  }
+
+  // Use service role key to create admin client for RPC
+  const adminSupabase = createAdminClient(
+    process.env.NEXT_PUBLIC_SUPABASE_URL!,
+    process.env.SUPABASE_SERVICE_ROLE_KEY!
+  )
+
   // Get email by username via secure RPC
-  const { data: email, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: playerName })
+  const { data: email, error: rpcError } = await adminSupabase.rpc('get_email_by_username', { p_username: playerName })
 
   if (rpcError || !email) {
     return { error: 'Apodo o contrase├▒a incorrectos.' }
   }
 
+  const supabase = await createClient()
+
   const { error } = await supabase.auth.signInWithPassword({
     email,
     password,
   })
 
   if (error) {
     if (error.message.includes('Invalid login credentials')) {
       return { error: 'Apodo o contrase├▒a incorrectos.' }
     }
     return { error: error.message }
   }
 
   revalidatePath('/', 'layout')
   redirect('/')
 }
 
 export async function signup(formData: FormData) {
-  const supabase = await createClient()
-
   const email = formData.get('email') as string
   const playerName = formData.get('player_name') as string
   const password = formData.get('password') as string
 
-  if (playerName.trim().length < 3) {
-    return { error: 'El apodo debe tener al menos 3 caracteres.' }
+  const parsed = signupSchema.safeParse({ email, player_name: playerName, password })
+  if (!parsed.success) {
+    return { error: parsed.error.issues[0].message }
   }
 
+  const supabase = await createClient()
+
   // Comprobar si el apodo ya existe antes de crear la cuenta
   const { data: existingProfile } = await supabase.from('profiles').select('id').eq('player_name', playerName).single()
   if (existingProfile) {
     return { error: 'Ese apodo ya est├í en uso. Por favor, elige otro.' }
   }
 
   const { data: authData, error } = await supabase.auth.signUp({
     email,
     password,
   })
diff --git a/test-actions.ts b/test-actions.ts
new file mode 100644
index 0000000..af79fb7
--- /dev/null
+++ b/test-actions.ts
@@ -0,0 +1,24 @@
+import test from 'node:test';
+import assert from 'node:assert';
+import { login, signup } from './src/app/actions.js';
+
+test('login requires valid player_name and password', async () => {
+  const formData = new FormData();
+  formData.append('player_name', '');
+  formData.append('password', '');
+  
+  const result = await login(formData);
+  // It should return an error immediately, before trying to call createClient
+  assert.ok(result && result.error);
+  assert.match(result.error, /requerid/i);
+});
+
+test('signup requires valid email, player_name, and password', async () => {
+  const formData = new FormData();
+  formData.append('email', 'not-an-email');
+  formData.append('player_name', 'ab'); // Too short
+  formData.append('password', '123'); // Too short
+  
+  const result = await signup(formData);
+  assert.ok(result && result.error);
+});

