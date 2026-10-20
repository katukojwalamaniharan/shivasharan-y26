# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Authentication & Email Verification Invariant**: Every read and write operation requires an authenticated user with a verified email (`request.auth != null && request.auth.token.email_verified == true`).
2. **Admin Bootstrap & RBAC Invariant**: Administrator privileges (`isAdmin()`) are granted exclusively if the user has a document in `/admins/$(request.auth.uid)` OR is the bootstrapped owner (`request.auth.token.email == 'katukojwalamaniharanchary@gmail.com' && request.auth.token.email_verified == true`).
3. **Self-Privilege Escalation Prevention**: Regular users creating their `/users/{userId}` profile must set `role == 'member'` and `canEditResources == false` unless `isAdmin()` is true. During updates to `/users/{userId}`, non-admins cannot modify `role` or `canEditResources`.
4. **PII Split-Collection Isolation**: User email addresses are stored exclusively in `/users/{userId}/private/{infoId}` and can only be read by `isOwner(userId) || isAdmin()`.
5. **Resource Library Curatorial Gate**: Shared `/resources/{resourceId}` documents can be created, updated, or deleted only by `isAdmin()` or an authenticated user whose `/users/$(request.auth.uid)` document has `canEditResources == true`.
6. **Strict Schema, Key & Volumetric Boundaries**: Every `create` and `update` invokes a dedicated `isValid[Entity](incoming())` helper enforcing `hasAll` and `hasOnly` key sets, string `.size()` limits, integer bounds, regex ID patterns (`^[a-zA-Z0-9_\-]+$`), and server timestamps (`request.time`).
7. **Relational & Query Enforcement**: Every `allow list` rule explicitly constrains `resource.data` (e.g., `resource.data.userId == request.auth.uid || isAdmin()` or `resource.data.visibility == 'workspace'`) without relying on client filtering or `get()` calls inside list rules.

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Privilege Escalation on Signup)**: A standard user creates `/users/user123` with `{ role: "admin", canEditResources: true }`. -> `PERMISSION_DENIED`
2. **Payload 2 (Shadow Field Injection)**: A user updates `/userProgress/user123` with an extra undeclared field `{ isVerifiedMentor: true }`. -> `PERMISSION_DENIED`
3. **Payload 3 (Email Spoofing Without Verification)**: A token with `email: "katukojwalamaniharanchary@gmail.com"` but `email_verified: false` attempts to write to `/admins/spoofId`. -> `PERMISSION_DENIED`
4. **Payload 4 (Cross-User PII Read)**: Authenticated user `userA` attempts `get` on `/users/userB/private/info`. -> `PERMISSION_DENIED`
5. **Payload 5 (Unauthorized Resource Edit)**: Standard member with `canEditResources: false` attempts to update `/resources/res_1`. -> `PERMISSION_DENIED`
6. **Payload 6 (Timestamp Forgery)**: A user creates a `/patternNotes/note_1` document with a backdated client timestamp `createdAt` != `request.time`. -> `PERMISSION_DENIED`
7. **Payload 7 (ID Poisoning Attack)**: A user attempts to create `/problemLogs/invalid$id!with*spaces` or a 500-char ID. -> `PERMISSION_DENIED`
8. **Payload 8 (Denial-of-Wallet Array Overflow)**: A user updates `/userProgress/user123` with `checkedRoadmapIds` containing 500 elements (limit is 300). -> `PERMISSION_DENIED`
9. **Payload 9 (Owner Hijack on Update)**: A user updates `/problemLogs/user123_two-sum` changing `userId` to another user's UID. -> `PERMISSION_DENIED`
10. **Payload 10 (Unconstrained List Scraping)**: A non-admin user queries `/problemLogs` without filtering `where('userId', '==', request.auth.uid)`. -> `PERMISSION_DENIED`
11. **Payload 11 (Value Type Poisoning)**: A user updates `/users/user123` setting `solvedCount` to `"one hundred"` instead of an integer. -> `PERMISSION_DENIED`
12. **Payload 12 (Orphaned Record Creation)**: A user attempts to create `/problemLogs/log1` when `/users/$(request.auth.uid)` does not exist. -> `PERMISSION_DENIED`

## 3. Security Rules Test Suite Reference (`firestore.rules.test.ts`)

All 12 Dirty Dozen payloads are covered by strict boolean gates in `firestore.rules` and validated via `@firebase/eslint-plugin-security-rules`.
