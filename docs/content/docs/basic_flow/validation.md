---
summary: How set Adonis-2FA Basic flow validation
---

# Validation

This is the validation that we recommend to the basic flow.

:::codegroup

```ts
// title: app/validators/verify_otp.ts
import vine from '@vinejs/vine'

export const verifyOtpValidator = vine.compile(
  vine.object({
    otp: vine.string(),
  })
)
```

:::
