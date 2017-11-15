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
  const currentTimeStr = moment(0, 'HH').add(currentTime, 'second').format('HH:mm:ss');
  const durationStr = moment(0, 'HH').add(duration, 'second').format('HH:mm:ss');
  return `[${currentTimeStr}/${durationStr}]`;
}


const Timer = ({ currentTime, duration }) => {
  const formatter = value => `${value}%`;
  return (
    <div className="music-timer">
      <Row>
        <Col span={16}>
          <Slider
            disabled
            tipFormatter={formatter}
            value={getSliderValue(currentTime, duration)}
            onChange={() => {}}
          />
        </Col>
        <Col span={8}>
          {formatTimeInfo(currentTime, duration)}
        </Col>
      </Row>

    </div>
  );
};
Timer.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};
export default Timer;
