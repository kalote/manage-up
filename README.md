# UP! Management console

This is a test project to start interacting with the Universal Profile of LUKSO blockchain. Expected features:

- _manage profile picture, banner, description, tags, links_ (can be done in the UP! wallet)
- manage key manager permissions
- manage universal receiver (automation on receive assets)
- manage vaults

## Notes

### Global

- in Lukso docs, sync all "web3 or ethers" code block
- use ethers v5.7.2, not the latest 6.x release
- use "0xb0c" when using window.ethereum chainId. Use "2828" when using ethers' signer.getChainId().
- `eth.chainId` instead of `eth.networkVersion` to check L16 chain (window.ethereum)

### @erc725/erc725.js

- in the doc about [schemas](https://docs.lukso.tech/tools/erc725js/schemas), the instantiation code block is wrong (`new ERC725(` instead of `new ERC725js(`)
- schemas importing contains all the necessary schema, not only 1, so it might be called

```
import LSP3schemas from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import LSP5schemas from '@erc725/erc725.js/schemas/LSP5ReceivedAssets.json';
```

instead of

```
import LSP3 from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import LSP5 from '@erc725/erc725.js/schemas/LSP5ReceivedAssets.json';
```

- `LSP3schemas` are not recognized as type `ERC725JSONSchema[]` and it need to be forced
