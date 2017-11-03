import React from 'react';
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

export default class LayoutView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  onSiderCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    return (
      <Layout className="top-layout">
        <Header>search</Header>
        <Layout>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onSiderCollapse}
          >
            Sider
          </Sider>
          <Content>
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}
