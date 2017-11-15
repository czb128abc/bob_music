import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';

const Controls = ({ isPlaying, onPause, onPlay }) => (
  <div className="controls">
    <Icon type="left-circle-o" />
    {
      isPlaying ?
        (
          <Tooltip title="暂停">
            <Icon type="pause-circle-o" onClick={onPause} title="暂停" />
          </Tooltip>
        )
        :
        (
          <Tooltip title="播放">
            <Icon type="play-circle-o" onClick={onPlay} title="播放" />
          </Tooltip>
        )
    }
    <Icon type="right-circle-o" />
  </div>
);
Controls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPause: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};
export default Controls;

