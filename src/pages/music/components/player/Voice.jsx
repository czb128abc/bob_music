import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Icon, Popover } from 'antd';

const Voice = ({ value, onChange }) => (
  <Popover
    title={null}
    content={
      <div style={{ height: 80 }}>
        <Slider vertical value={value} onChange={onChange} />
      </div>
    }
  >
    <Icon type="sound" />
  </Popover>
);

Voice.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
export default Voice;
