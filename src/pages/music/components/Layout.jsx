import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout } from 'antd';
import * as actions from '../actions';
import netease from '../services/netease';
import MusicSearchView from './MusicSearchView';

const { Header, Content } = Layout;

class LayoutView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
  }

  render() {
    const { searchSong, searchResult } = this.props;
    return (
      <Layout className="top-layout">
        <Header>search</Header>
        <Layout>
          <Content>
            <MusicSearchView
              searchSong={searchSong}
              searchResult={searchResult}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

LayoutView.propTypes = {
  searchResult: PropTypes.object,
  searchSong: PropTypes.func,
};

const mapStateToProps = (state) => {
  const root = state.music;
  return {
    searchResult: root.get('searchResult')
  };
};

const mapDispatchToProps = ({
  searchSong: actions.searchSong,
});


export default connect(mapStateToProps, mapDispatchToProps)(LayoutView);
