import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout, Row, Col, message } from 'antd';
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
    this.searchSong = this.searchSong.bind(this);

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

  searchSong(keywords) {
    let isLegitimate = true;
    if (!keywords) {
      message.warn('请输入关键字,搜索歌曲');
      isLegitimate = false;
    }
    if (isLegitimate) {
      this.props.searchSong(keywords);
    }
  }

  render() {
    const { searchResult, addToMyPlayList, myPlayList, removeToMyPlayList } = this.props;
    return (
      <Layout className="music-top-layout">
        <Content>
          <Row gutter={16}>
            <Col span={10}>
              <MusicSearchView
                searchSong={this.searchSong}
                searchResult={searchResult}
                playNow={this.playNow}
                addToMyPlayList={addToMyPlayList}
              />
            </Col>
            <Col span={12}>
              <Player
                ref={(refs) => { this.player = refs; }}
                myPlayList={myPlayList}
                removeToMyPlayList={removeToMyPlayList}
              />
            </Col>
          </Row>

        </Content>
        <Footer />
      </Layout>
    );
  }
}

LayoutView.propTypes = {
  myPlayList: PropTypes.object.isRequired,
  searchResult: PropTypes.object.isRequired,

  searchSong: PropTypes.func.isRequired,
  addToMyPlayList: PropTypes.func.isRequired,
  removeToMyPlayList: PropTypes.func.isRequired,
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
  removeToMyPlayList: actions.removeToMyPlayList,
});


export default connect(mapStateToProps, mapDispatchToProps)(LayoutView);
