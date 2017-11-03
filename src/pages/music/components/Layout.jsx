import React from 'react';
import { Layout, Icon } from 'antd';

const { Header, Content, Footer } = Layout;

export default class LayoutView extends React.Component {
  render() {
    return (
      <Layout>
        <Header>header</Header>
        <Layout>
          <Content>
            main content
            <Icon type="link" />
          </Content>
        </Layout>
        <Footer>footer</Footer>
      </Layout>
    );
  }
}
