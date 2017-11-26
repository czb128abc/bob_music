import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Row, Col } from 'antd';
import moment from 'moment';

function getSliderValue(currentTime, duration) {
  const data = (currentTime / duration) * 100;
  if (isNaN(data)) {
    return 0;
  }
  return data;
}

function formatTimeInfo(currentTime, duration) {
  const zeroHover = '00:';
  let currentTimeStr = moment(0, 'HH').add(currentTime, 'second').format('HH:mm:ss');
  let durationStr = moment(0, 'HH').add(duration, 'second').format('HH:mm:ss');

  if (currentTimeStr.startsWith(zeroHover)) {
    currentTimeStr = currentTimeStr.replace(zeroHover, '');
  }

  if (durationStr.startsWith(zeroHover)) {
    durationStr = durationStr.replace(zeroHover, '');
  }

  return `[${currentTimeStr}/${durationStr}]`;
}

const SongInfo = ({ imgUrl, title }) => (
  <div className="song-info">
    <div className="img-wrapper">
      <img src={imgUrl} alt={title} />
    </div>
  </div>
);

SongInfo.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Timer = ({ currentTime, duration, onChange, playingSongInfo }) => {
  const formatter = value => `${value}%`;
  return (
    <div className="music-timer">
      <Row type="flex" justify="space-around" align="middle">
        <Col span={2}>
          {
            playingSongInfo ?
              (
                <SongInfo imgUrl={playingSongInfo.imgUrl} title={playingSongInfo.title} />
              )
              : null
          }
        </Col>
        <Col span={16}>
          <Slider
            tipFormatter={formatter}
            value={getSliderValue(currentTime, duration)}
            onChange={onChange}
          />
        </Col>
        <Col span={4}>
          {formatTimeInfo(currentTime, duration)}
        </Col>
      </Row>

    </div>
  );
};
Timer.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  playingSongInfo: PropTypes.object,
};
Timer.defaultProps = {
  playingSongInfo: null,
};
export default Timer;
