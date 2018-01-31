const assert = require('assert'),
    ganache  = require('ganache-cli'),
    Web3     = require('web3'),
    provider = ganache.provider(),
    web3     = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json'),
      compiledCampaign = require('../ethereum/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;



beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //No address specified as we are deploying new version of contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
          .deploy({ data: compiledFactory.bytecode })
          .send({ from: accounts[0], gas: '1000000' });

  factory.setProvider(provider)

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [ campaignAddress ] = await factory.methods.getDeployedCampaigns().call();
  //Already deployed contract and want to notify web3 about deployed contract
  //Interface as first argument, then address of already deployed version as second arg
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )

})

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('the factory is able to deploy more than one contract', async () => {
    for (let i = 0; i < 9; i++) {
      await factory.methods.createCampaign('100').send({
        from: accounts[i + 1],
        gas: '1000000'
      });
    }
    const adr = await factory.methods.getDeployedCampaigns().call();
    assert(adr.length === 10);

  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert(manager, accounts[0]);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContribute = await campaign.methods.approvers(accounts[1]).call();
    assert(isContribute);
  });

  it('the minimum contribution limit works', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '50',
        from: accounts[0]
      });
      assert(false);
    } catch(e) {
      assert(true);
    }
  });

  it('accepts a contribution over the min amount', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '101',
        from: accounts[0]
      });
      assert(true);
    } catch (e) {
      assert(false);
    }
  });

  it('one address can deploy multiple campaigns', async () => {
    try {
      for (let i = 0; i < 5; i++) {
        await factory.methods.createCampaign('100').send({
          from: accounts[0],
          gas: '1000000'
        });
      }
      assert(true);
    } catch(e) {
      assert(false);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign
            .methods
            .createRequest('Free Cash', '100', accounts[1])
            .send({ from: accounts[0], gas: '1000000' });
    const request = await campaign.methods.requests(0).call();
    assert.equal('Free Cash', request.description);

  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    })

    await campaign
            .methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas:' 1000000' });

    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' })

    let bal = await web3.eth.getBalance( accounts[1] );
    bal = parseFloat(web3.utils.fromWei(bal, 'ether'));

    assert(bal > 4);
  });

});
