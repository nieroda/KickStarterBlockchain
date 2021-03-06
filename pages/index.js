import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/layout';
//import 'semantic-ui-css/semantic.min.css'

class CampaignIndex extends Component {

  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }


  renderCampaigns() {
    const items = this.props.campaigns.map(addr => {
      return {
        header: addr,
        description: <a>View Campaign</a>,
        fluid: true
      }
    });

    return <Card.Group items={items} />
  }

  render() {
    //console.log(factory);
      return (
        <Layout>
          <div>
            <h3> Open Campaigns </h3>
            <Button
              content="Create Campaign"
              icon="add circle"
              floated="right"
              primary
            />
            {this.renderCampaigns()}
          </div>
        </Layout>
      )
  }
}

export default CampaignIndex;
