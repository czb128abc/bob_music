/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout } from 'antd';
import * as actions from '../actions';
import netease from '../services/netease';

const { Header, Content } = Layout;

class LayoutView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
    this.props.searchSong('jay', 10, 1);
    netease.search('周杰伦');
  }

  render() {
    return (
      <Layout className="top-layout">
        <Header>search</Header>
        <Layout>
          <Content>
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

LayoutView.propsTypes = {
  searchSong: PropTypes.func,
};

// const mapStateToProps = (state) => {
//   const root = state.pages.setting.store.printer.documentStyleTemplet.edit;
//   const systemLoading = state.__system__.loading;
//   return {
//     systemComponentsData: root.get('systemComponentsData'),
//     previewComponentsData: root.get('previewComponentsData'),
//     editData: root.get('editData'),
//     systemLoading,
//   };
// };

const mapDispatchToProps = ({
  searchSong: actions.searchSong,
});


export default connect(null, mapDispatchToProps)(LayoutView);
