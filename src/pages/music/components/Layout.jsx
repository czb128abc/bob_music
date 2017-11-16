import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout, Row, Col } from 'antd';
import * as actions from '../actions';
import MusicSearchView from './MusicSearchView';
import Player from './player/Player';

import './Layout.less';

const Footer = Layout.Footer;
const Content = Layout.Content;

class LayoutView extends React.Component {
  constructor(props) {
    super(props);

    this.playNow = this.playNow.bind(this);

    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
  }

  playNow(record) {
    this.props.addToMyPlayList([record]);
    this.player.playTheSong(record);
  }

  render() {
    const { searchSong, searchResult, addToMyPlayList, myPlayList } = this.props;
    return (
      <Layout className="music-top-layout">
        <Content>
          <Row gutter={16}>
            <Col span={10}>
              <MusicSearchView
                searchSong={searchSong}
                searchResult={searchResult}
                playNow={this.playNow}
                addToMyPlayList={addToMyPlayList}
              />
            </Col>
            <Col span={12}>
              <Player
                ref={(refs) => { this.player = refs; }}
                myPlayList={myPlayList}
                handlePlayTheSong={() => {}}
              />
            </Col>
          </Row>

        </Content>
        <Footer>

        </Footer>
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
