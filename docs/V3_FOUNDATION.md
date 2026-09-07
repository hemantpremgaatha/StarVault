# StarVault V3 Foundation

V3 moves StarVault from a dashboard prototype toward a protocol-backed product.

## Core trust model

```text
User
  |
  v
StarVault Identity -----> Public-key fingerprint / identity proof
  |
  v
Encrypted Vault --------> Envelope encryption contract
  |
  v
Consent Engine ----------> purpose + scope + expiry + revocation
  |
  v
Capability Gateway ------> scoped, time-limited access
  |
  v
Audit Service -----------> append-only access history
```

## Security rules

1. No API keys, encryption keys, passwords, or private keys in Git.
2. Consent is deny-by-default and must contain purpose, scope, subject, client and expiry.
3. Access requires an active consent and a valid capability token.
4. Revocation must invalidate future access immediately.
5. Vault encryption keys belong to the key-management layer, not application source code.
6. Audit events are append-only at the application contract level; production storage must enforce immutability and integrity controls.

## Production implementation order

1. OIDC/passkey authentication and account recovery.
2. PostgreSQL for identities, consent records and token metadata.
3. Object storage for encrypted vault blobs.
4. KMS/HSM-backed envelope encryption.
5. Signed capability tokens and key rotation.
6. Append-only audit storage with integrity verification.
7. API gateway, rate limits and abuse controls.
8. Security testing, threat modeling and privacy/compliance review.

V3 contracts are intentionally framework-light so services can evolve independently.
