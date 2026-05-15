# Security Specification - Nebula Studio

## Data Invariants
1. A project must belong to a valid user.
2. Only the owner of a project can edit or delete it.
3. Templates are read-only for public access, but can only be modified by admins.
4. Public designs are read-only for everyone.
5. User profile data is private to the owner.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a project with `ownerId` of another user.
2. **Resource Poisoning**: Attempt to set a project `id` with a 1MB string of junk characters.
3. **Template Hijacking**: Attempt to update a public template as a regular user.
4. **Shadow Update**: Attempt to inject `isAdmin: true` into a user profile.
5. **Orphaned Write**: Attempt to create a project with a non-existent `workspaceId`.
6. **State Shortcutting**: Attempt to change project `type` from 'personal' to 'enterprise' without verification.
7. **Recursive Write**: Attempt to nest objects too deeply in `canvasData`.
8. **Malicious Thumbnail**: Attempt to set a 10MB data string as a thumbnail.
9. **Unauthorized List**: Attempt to query all projects without filtering by `ownerId`.
10. **Immutable Field Attack**: Attempt to change `createdAt` timestamp.
11. **PII Leak**: Attempt to read another user's email via user profile collection.
12. **Denial of Wallet**: Attempt to flood the `projects` collection with thousands of 0.5MB documents rapidly.

## Test Runner (Conceptual)
All "Dirty Dozen" payloads must return `PERMISSION_DENIED`.
