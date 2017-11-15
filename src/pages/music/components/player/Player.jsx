import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Table, Icon } from 'antd';
import netease from '../../services/netease';
import './Player.less';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSong: null,
      url: null,
      lyric: null,
    };
  }

  async playTheSong(activeSong) {
    const songId = activeSong.id;
    const songObj = await netease.querySongInfo(songId);
    const lyricObj = await netease.queryLyric(songId);
    this.setState({
      activeSong,
      url: songObj.url,
      lyric: lyricObj.lyric,
    });
  }

  rendMyPlayList() {
    const { myPlayList } = this.props;
    const columns = [{
      title: '歌曲',
      dataIndex: 'title',
      render: (text, record) => {
        const handlePlayTheSong = () => {
          const activeSong = record;
          this.playTheSong(activeSong);
        };
        return (
          <div onClick={handlePlayTheSong}>
            {text}
          </div>
        );
      }
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        const handleDelToMyPlayList = () => {
        };
        return (
          <div>
            <Icon type="delete" onClick={handleDelToMyPlayList} />
          </div>
        );
      }
    }, {
      title: '歌手',
      dataIndex: 'artistName',
    }];
    const dataSource = myPlayList.toJS()
      .map(item => ({ ...item, key: `${item.source}${item.id}` }));
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={false}
      />
    );
  }

  rendAudio() {
    const { activeSong, url } = this.state;
    return (
      <div className="audio-container">
        <div className="controls">
          <Icon type="left-circle-o" />
          <Icon type="play-circle-o" />
          <Icon type="pause-circle-o" />
          <Icon type="right-circle-o" />
        </div>
        <audio ref={(refs) => { this.audioRef = refs; }} src={url} />
      </div>
    );
  }

  render() {
    return (
      <div className="music-player">
        {this.rendAudio()}
        <Popover
          title="播放列表"
          content={this.rendMyPlayList()}
        >
          播放列表
        </Popover>
      </div>
    );
  }
}

Player.propTypes = {
  myPlayList: PropTypes.object.isRequired,
};
