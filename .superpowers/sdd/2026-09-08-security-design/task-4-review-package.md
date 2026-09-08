Commits:
060ecb2 chore(security): configure strict HTTP security headers in next.config.ts

Stat summary:
 next.config.ts | 34 +++++++++++++++++++++++++++++++++-
 1 file changed, 33 insertions(+), 1 deletion(-)

Diff:
diff --git a/next.config.ts b/next.config.ts
index e9ffa30..ab52d6f 100644
--- a/next.config.ts
+++ b/next.config.ts
@@ -1,7 +1,39 @@
 import type { NextConfig } from "next";
 
 const nextConfig: NextConfig = {
-  /* config options here */
+  async headers() {
+    return [
+      {
+        source: "/(.*)",
+        headers: [
+          {
+            key: "X-DNS-Prefetch-Control",
+            value: "on",
+          },
+          {
+            key: "Strict-Transport-Security",
+            value: "max-age=63072000; includeSubDomains; preload",
+          },
+          {
+            key: "X-Frame-Options",
+            value: "SAMEORIGIN",
+          },
+          {
+            key: "X-Content-Type-Options",
+            value: "nosniff",
+          },
+          {
+            key: "Referrer-Policy",
+            value: "origin-when-cross-origin",
+          },
+          {
+            key: "Content-Security-Policy",
+            value: "default-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com; frame-src 'self' https://www.youtube.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
+          },
+        ],
+      },
+    ];
+  },
 };
 
 export default nextConfig;

