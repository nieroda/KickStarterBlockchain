import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xc5ea0120b26c4F94e8bdCf60edEa7161474651F5"
);

export default instance;
