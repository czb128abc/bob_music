import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout } from 'antd';
import * as actions from '../actions';
import MusicSearchView from './MusicSearchView';
import Player from './player/Player';

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
    const { searchSong, searchResult, addToMyPlayList, myPlayList } = this.props;
    return (
      <Layout className="top-layout">
        <Header>search</Header>
        <Layout>
          <Content>
            <MusicSearchView
              searchSong={searchSong}
              addToMyPlayList={addToMyPlayList}
              searchResult={searchResult}
            />
            <Player
              myPlayList={myPlayList}
              handlePlayTheSong={() => {}}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

LayoutView.propTypes = {
  myPlayList: PropTypes.object.isRequired,
  searchResult: PropTypes.object.isRequired,

  searchSong: PropTypes.func.isRequired,
  addToMyPlayList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const root = state.music;
  return {
    searchResult: root.get('searchResult'),
    myPlayList: root.get('myPlayList')
  };
};

const mapDispatchToProps = ({
  searchSong: actions.searchSong,
  addToMyPlayList: actions.addToMyPlayList,
});


export default connect(mapStateToProps, mapDispatchToProps)(LayoutView);
