const HDWalletProvider        = require('truffle-hdwallet-provider'),
      Web3                    = require('web3'),
      compiledFactory         = require('./build/CampaignFactory.json');



const provider = new HDWalletProvider(
  'redacted',
  'https://rinkeby.infura.io/gITLmDVd0GNhDNQ9sUeo'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });


  console.log(`Contract deployed to`, result.options.address);
};

deploy();


//0xc5ea0120b26c4F94e8bdCf60edEa7161474651F5
