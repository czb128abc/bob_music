import React from 'react';
import PropTypes from 'prop-types';
import { Input, Tabs, Table, Row, Col, Icon } from 'antd';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

const types = {
  netease: '网易',
  xiami: '虾米',
  qq: 'QQ音乐'
};


export default class MusicSearchView extends React.Component {
  static propTypes = {
    addToMyPlayList: PropTypes.func.isRequired,
    searchSong: PropTypes.func.isRequired,
    searchResult: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(value) {
    this.props.searchSong(value.trim());
  }

  rendSongList(list) {
    const columns = [{
      title: '歌曲',
      dataIndex: 'title',
      render: (text, record) => {
        const handleAddToMyPlayList = () => {
          this.props.addToMyPlayList([record]);
        };
        return (
          <div>
            <Icon type="play-circle-o" /> {text}
            <Icon type="plus" onClick={handleAddToMyPlayList} />
          </div>
        );
      }
    }, {
      title: '歌手',
      dataIndex: 'artistName',
    }, {
      title: '专辑',
      dataIndex: 'albumName',
    }, {
      title: '来源',
      dataIndex: 'source',
    }];
    const dataSource = list
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

  rendSearchResultByType(type) {
    const { searchResult } = this.props;
    if (!searchResult.get(type)) {
      return (
        <div>no data</div>
      );
    }
    return (
      <div style={{ backgroundColor: '#FFF' }}>
        {
          this.rendSongList(searchResult.getIn(`${type}.list`.split('.')).toJS())
        }
      </div>
    );
  }

  rendSearchResult() {
    const typesKeys = Object.keys(types);
    return (
      <Tabs
        type="card"
      >
        {
          typesKeys.map(key => (
            <TabPane
              tab={
                types[key]
              }
              key={key}
            >
              {this.rendSearchResultByType(key)}
            </TabPane>
          ))
        }

      </Tabs>
    );
  }

  render() {
    return (
      <div className="music-search-view" >
        <Row>
          <Col offset={10} span={4}>
            <Search
              placeholder="输入歌曲名，歌手或专辑"
              onSearch={this.handleSearch}
            />
          </Col>
        </Row>

        {
          this.rendSearchResult()
        }

      </div>
    );
  }
}
