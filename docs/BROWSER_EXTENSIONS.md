# Browser Extension Compatibility

## Known Issues

### Wallet Extension Errors (Phantom, MetaMask, etc.)

**Error Message:**
```
TypeError: Cannot redefine property: ethereum
at Object.defineProperty (<anonymous>:null:null)
at r.inject (chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/evmAsk.js:5:5093)
```

**Cause:**
This error occurs when browser wallet extensions (like Phantom, MetaMask, Coinbase Wallet) try to inject `window.ethereum` or `window.solana` objects into the page. With Next.js 15 + Turbopack, there can be timing conflicts during hydration where the property has already been defined as non-configurable.

**Impact:**
⚠️ **This error is harmless** - it does not affect the functionality of the website. The wallet extensions work correctly despite this console error.

**Solution:**
We've implemented a global error handler (`app/error-handler.tsx`) that suppresses these specific errors to keep the console clean. The error handler:

1. Filters out wallet extension injection errors
2. Prevents them from appearing in the browser console
3. Does not suppress other legitimate errors
4. Only runs on the client side

**For Developers:**

If you need to add Web3 functionality in the future:

```typescript
"use client";

import { useEffect, useState } from "react";

export function Web3Component() {
  const [ethereum, setEthereum] = useState<unknown>(null);

  useEffect(() => {
    // Always check for window and wait for extension injection
    if (typeof window !== "undefined") {
      // Wait a tick for extensions to inject
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEthereum((window as any).ethereum);
      }, 100);
    }
  }, []);

  // Your Web3 logic here
}
```

**Alternative Approaches:**

1. **Disable wallet extensions during development** - If the console errors bother you
2. **Use dynamic imports** - For any Web3 libraries:
   ```typescript
   const Web3Library = dynamic(() => import("web3-library"), { ssr: false });
   ```
3. **Check browser extension compatibility** - Different wallets inject differently

## Browser Extension Testing

When testing with browser extensions:

- **Phantom Wallet** ✅ Supported
- **MetaMask** ✅ Supported  
- **Coinbase Wallet** ✅ Supported
- **Rainbow Wallet** ✅ Supported

All extensions work correctly despite console warnings being suppressed.

## Resources

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Turbopack Documentation](https://nextjs.org/docs/architecture/turbopack)
- [Web3 Provider Detection](https://docs.metamask.io/wallet/how-to/connect/)

