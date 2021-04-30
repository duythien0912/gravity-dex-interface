import { defaultBech32Config } from "@chainapsis/cosmosjs/core/bech32Config";

export const currencies = [
  {
    coinDenom: "AKT",
    coinMinimalDenom: "uakt",
    coinDecimals: 6
  },
  {
    coinDenom: "ATOM",
    coinMinimalDenom: "uatom",
    coinDecimals: 6
  },
  {
    coinDenom: "BTSG",
    coinMinimalDenom: "ubtsg",
    coinDecimals: 6
  },
  {
    coinDenom: "DVPN",
    coinMinimalDenom: "udvpn",
    coinDecimals: 6
  },
  {
    coinDenom: "GCYB",
    coinMinimalDenom: "ugcyb",
    coinDecimals: 6
  },
  {
    coinDenom: "IRIS",
    coinMinimalDenom: "uiris",
    coinDecimals: 6
  },
  {
    coinDenom: "LUNA",
    coinMinimalDenom: "uluna",
    coinDecimals: 6
  },
  {
    coinDenom: "NGM",
    coinMinimalDenom: "ungm",
    coinDecimals: 6
  },
  {
    coinDenom: "XPRT",
    coinMinimalDenom: "uxprt",
    coinDecimals: 6
  },
  // {
  //   coinDenom: "XRN",
  //   coinMinimalDenom: "uxrn",
  //   coinDecimals: 6
  // },
  {
    coinDenom: "RUN",
    coinMinimalDenom: "xrun",
    coinDecimals: 6
  },

  {
    coinDenom: "REGEN",
    coinMinimalDenom: "uregen",
    coinDecimals: 6
  },
  {
    coinDenom: "COM",
    coinMinimalDenom: "ucom",
    coinDecimals: 6
  },
  {
    coinDenom: "DSM",
    coinMinimalDenom: "udsm",
    coinDecimals: 6
  }
]

export const stakingCurrency = {
  coinDenom: "ATOM",
  coinMinimalDenom: "uatom",
  coinDecimals: 6
};

export const chainInfo = {



  // rpc: "https://competition.bharvest.io",
  // rest: "https://competition.bharvest.io:1317",
  rpc: "https://rpc.gravity.bharvest.io",
  rest: "https://api.gravity.bharvest.io",
  chainId: "swap-testnet-2005",
  chainName: "swap-testnet-2005",
  stakeCurrency: stakingCurrency,
  bip44: {
    coinType: 118
  },
  bech32Config: defaultBech32Config("cosmos"),
  currencies: [stakingCurrency].concat(currencies),
  feeCurrencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6
    }
  ],
  features: ["stargate"]
};
