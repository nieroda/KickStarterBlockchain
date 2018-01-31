import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignNew extends React.Component {

  state = {
    minimumContribution: ''
  }

  onSubmit = async event => {
    console.log('called');
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
      .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        })
    } catch (e) {
      console.log(e);
    }

  }



  render() {
    return (
      <Layout>
        <h3> Create A Campaign </h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label='wei'
              labelPosition='right'
              value={this.state.minimumContribution}
              onChange={event => this.setState({ minimumContribution: event.target.value })}
              />
          </Form.Field>
          <Button primary> Create! </Button>
        </Form>
      </Layout>
    )
  }
}

export default CampaignNew;
