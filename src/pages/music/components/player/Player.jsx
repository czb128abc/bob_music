import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Table, Icon, Row, Col, Slider } from 'antd';
import netease from '../../services/netease';
import Controls from './Controls';
import Timer from './Timer';
import { playModeEnum } from '../../consts';
import './Player.less';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.state = {
      url: null,
      lyric: null,
      playerSettings: {
        playMode: playModeEnum.SEQUENTIAL_PLAY,
        nowPlayingKey: null,
        volume: 0.8,
      },
      currentTime: 0,
      duration: 0,
      isPlaying: false,
    };
  }

  componentDidMount() {

  }

  async playTheSong(activeSong) {
    const { playerSettings } = this.state;
    const songId = activeSong.id;
    const songObj = await netease.querySongInfo(songId);
    const lyricObj = await netease.queryLyric(songId);
    playerSettings.nowPlayingKey = `${activeSong.id}_${activeSong.source}`;
    this.setState({
      url: songObj.url,
      lyric: lyricObj.lyric,
      playerSettings
    }, () => {
      this.handlePlay();
    });
  }

  whenAudioIsEnded() {
    const { playMode, nowPlayingKey } = this.state.playerSettings;
    const myPlayList = this.props.myPlayList.toJS();
    if (playMode === playModeEnum.SINGLE_TUNE_CIRCULATION) {
      this.audioRef.currentTime = 0;
    }
    if (playMode === playModeEnum.SEQUENTIAL_PLAY) {
      const index = myPlayList.findIndex(item => (nowPlayingKey === `${item.id}_${item.source}`));
      const nextSong = myPlayList.length === index + 1 ? myPlayList[0] : myPlayList[index + 1];
      this.playTheSong(nextSong);
    }
  }

  handleTimeUpdate(e) {
    const audioDom = e.target;
    const { currentTime, duration, ended } = audioDom;
    this.setState({ currentTime, duration });
    if (ended) {
      this.whenAudioIsEnded();
    }
  }

  handlePlay() {
    this.setState({ isPlaying: true }, () => {
      this.audioRef.play();
    });
  }

  handlePause() {
    this.setState({ isPlaying: false }, () => {
      this.audioRef.pause();
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
    const { isPlaying, url, duration, currentTime } = this.state;
    return (
      <div className="audio-container">
        <Row type="flex" justify="space-around" align="middle">
          <Col span={6}>
            <Controls
              isPlaying={isPlaying}
              onPause={this.handlePause}
              onPlay={this.handlePlay}
            />
          </Col>
          <Col span={8}>
            <Timer
              currentTime={currentTime}
              duration={duration}
            />
          </Col>
          <Col span={4}>
            <Popover
              title={null}
              content={
                <div style={{ height: 80 }}>
                  <Slider vertical defaultValue={30} />
                </div>
              }
            >
              <Icon type="sound" />
            </Popover>
            <Popover
              title="播放列表"
              content={this.rendMyPlayList()}
            >
              <Icon type="idcard" />
            </Popover>
          </Col>
        </Row>

        <audio
          ref={(refs) => { this.audioRef = refs; }}
          src={url}
          onTimeUpdate={this.handleTimeUpdate}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="music-player">
        {this.rendAudio()}
      </div>
    );
  }
}

Player.propTypes = {
  myPlayList: PropTypes.object.isRequired,
};
