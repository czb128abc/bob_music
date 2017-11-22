import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Table, Icon, Row, Col, message } from 'antd';
import services from '../../services';
import Controls from './Controls';
import Timer from './Timer';
import Voice from './Voice';
import Lyric from './Lyric';
import { playModeEnum } from '../../consts';
import './Player.less';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.playTheSong = this.playTheSong.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePlayNext = this.handlePlayNext.bind(this);
    this.handlePlayPre = this.handlePlayPre.bind(this);
    this.handleTimerChange = this.handleTimerChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);

    this.state = {
      url: null,
      lyric: null,
      playerSettings: {
        playMode: playModeEnum.SEQUENTIAL_PLAY,
        nowPlayingKey: null,
        volume: 1,
      },
      currentTime: 0,
      duration: 0,
      isPlaying: false,
    };
  }

  componentDidMount() {

  }

  getSongInfoByNowPlayingKey() {
    const index = this.findIndexNowPlayingKey();
    return this.props.myPlayList.toJS()[index];
  }

  findIndexNowPlayingKey() {
    const { nowPlayingKey } = this.state.playerSettings;
    const myPlayList = this.props.myPlayList.toJS();
    const index = myPlayList.findIndex(item => (nowPlayingKey === item.key));
    return index;
  }

  async playTheSong(activeSong) {
    if (!activeSong) {
      message.warn('播放列表暂无歌曲');
      return false;
    }
    const { playerSettings } = this.state;
    const songId = activeSong.id;
    const songObj = await services[activeSong.source].querySongInfo(songId, activeSong);
    const lyricObj = await services[activeSong.source].queryLyric(songId, activeSong);
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
    const { playMode } = this.state.playerSettings;
    if (playMode === playModeEnum.SINGLE_TUNE_CIRCULATION) {
      this.audioRef.currentTime = 0;
    }
    if (playMode === playModeEnum.SEQUENTIAL_PLAY) {
      this.handlePlayNext();
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
    const { nowPlayingKey } = this.state.playerSettings;
    if (nowPlayingKey) {
      this.setState({ isPlaying: true }, () => {
        this.audioRef.play();
      });
    } else {
      this.handlePlayNext();
    }
  }

  handlePause() {
    this.setState({ isPlaying: false }, () => {
      this.audioRef.pause();
    });
  }
  handlePlayPre() {
    const myPlayList = this.props.myPlayList.toJS();
    const index = this.findIndexNowPlayingKey();

    const song = index === 0 ? myPlayList[myPlayList.length - 1] : myPlayList[index - 1];

    this.playTheSong(song);
  }

  handlePlayNext() {
    const myPlayList = this.props.myPlayList.toJS();
    const index = this.findIndexNowPlayingKey();
    const song = myPlayList.length === index + 1 ? myPlayList[0] : myPlayList[index + 1];
    this.playTheSong(song);
  }

  handleTimerChange(value) {
    const { duration } = this.state;
    const newTime = (value * duration) / 100;
    this.audioRef.currentTime = newTime;
  }

  handleVolumeChange(value) {
    const { playerSettings } = this.state;
    playerSettings.volume = value / 100;
    this.setState({ playerSettings }, () => {
      this.audioRef.volume = playerSettings.volume;
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
    const { isPlaying, url, duration, currentTime, playerSettings, lyric, } = this.state;
    return (
      <div>
        <Row className="audio-container" type="flex" justify="space-around" align="middle">
          <Col span={6}>
            <Controls
              isPlaying={isPlaying}
              onPause={this.handlePause}
              onPlay={this.handlePlay}
              onPlayPre={this.handlePlayPre}
              onPlayNext={this.handlePlayNext}
            />
          </Col>
          <Col span={8}>
            <Timer
              currentTime={currentTime}
              duration={duration}
              onChange={this.handleTimerChange}
              playingSongInfo={this.getSongInfoByNowPlayingKey()}
            />
          </Col>
          <Col span={4}>
            <Voice
              value={playerSettings.volume * 100}
              onChange={this.handleVolumeChange}
            />
            <Popover
              title="播放列表"
              content={this.rendMyPlayList()}
            >
              <Icon type="idcard" />
            </Popover>
          </Col>
        </Row>
        {
          lyric && (<Lyric currentTime={currentTime} lyric={lyric} />)
        }

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
