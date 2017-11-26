import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function getLyricList(lyricText) {
  const lyricTextList = lyricText.split('\n');
  const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
  const tagRegMap = {
    title: 'ti',
    artist: 'ar',
    album: 'al',
    offset: 'offset',
    by: 'by'
  };
  const lyricList = [];

  lyricTextList.forEach((item) => {
    if (timeExp.test(item)) {
      const timeText = item.match(timeExp)[0];
      const obj = {
        type: 'content',
        text: item.replace(timeText, ''),
        timeText: timeText.replace('[', '').replace(']', '')
      };
      if (obj.text) {
        lyricList.push(obj);
      }
    }
  });
  return {
    lyricList,
  };
}

function isCurrentLine(lineTime, nextLineTime, currentTime) {
  const currentTimeMoment = moment(0, 'HH').add(currentTime, 'second');
  const lineTimeMoment = moment(lineTime, 'mm:ss');
  const nextLineTimeMoment = moment(nextLineTime, 'mm:ss');
  return currentTimeMoment.isBetween(lineTimeMoment, nextLineTimeMoment);
}
class LyricRow extends React.Component {
  state = {
    isActive: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive !== this.props.isActive) {
      this.setState({ isActive: nextProps.isActive });
      if (nextProps.isActive) {
        this.domRef.scrollIntoViewIfNeeded();
      }
    }
  }

  render() {
    const { text } = this.props;
    const { isActive } = this.state;
    const itemClassNames = ['lyric-item'];
    if (isActive) {
      itemClassNames.push('active');
    }
    return (
      <div ref={(refs) => { this.domRef = refs; }} className={itemClassNames.join(' ')}>
        {`${text}`}
      </div>
    );
  }
}

LyricRow.propTypes = {
  isActive: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

const Lyric = ({ currentTime, lyric }) => {
  const { lyricList } = getLyricList(lyric);

  return (
    <div className="lyric-container" >
      <div className="lyric-list">
        {
          lyricList.map((item, index) => {
            const nextItem = (lyricList.length === index + 1)
              ? lyricList[index] : lyricList[index + 1];
            const result = isCurrentLine(item.timeText, nextItem.timeText, currentTime);
            return (
              <LyricRow
                key={index.toString()}
                isActive={result}
                timeText={item.timeText}
                text={item.text}
              />
            );
          })
        }
      </div>
    </div>
  );
};

Lyric.propTypes = {
  currentTime: PropTypes.number.isRequired,
  lyric: PropTypes.string.isRequired,
};
export default Lyric;
