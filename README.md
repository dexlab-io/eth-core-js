# ETH Core JS

ETH Core JS collection of ethereum classes by Dexlab.io

## Scripts

- `yarn dev` - starts the server with hot-reloading
- `yarn build` - build the code using Rollup
- `yarn web` - run's example web server
- `yarn lint` - fixes all the possible linting errors

## Usage

```
import {
  HDWallet,
  WatcherTx,
  xDAIHDWallet,
  ENSResolver,
  EthereumHDWallet,
  EthereumHDWalletKovan,
  EthereumHDWalletRopsten,
  LegacyWallet,
} from 'eth-core-js';
```

Have a look in `./examples` directory for usage examples.

`./src/main.js` take care of exporting all classes.

## License

[MIT](LICENSE)
