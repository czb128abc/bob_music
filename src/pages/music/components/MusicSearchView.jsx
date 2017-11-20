import React from 'react';
import PropTypes from 'prop-types';
import { Input, Tabs, Table, Row, Col, Icon, Alert, Tooltip } from 'antd';

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
    playNow: PropTypes.func.isRequired,
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
    const handleAddAllSongToMyPlayList = () => {
      this.props.addToMyPlayList(list);
    };
    const columns = [{
      title: (
        <span>
          歌曲
          {
            list.length > 0 ?
              (
                <span
                  className="add-all-search-songs"
                  onClick={handleAddAllSongToMyPlayList}
                >
                  <Icon type="folder-add" />全部添加
                </span>
              ) : null
          }
        </span>
      ),
      dataIndex: 'title',
      render: (text, record) => {
        const handleAddToMyPlayList = () => {
          this.props.addToMyPlayList([record]);
        };
        const handlePlayNow = () => {
          this.props.playNow(record);
        };
        return (
          <div>
            <Icon type="play-circle-o" onClick={handlePlayNow} />
            {text}
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
        <Alert message="waiting for search" description="等待您搜索!" type="warning" showIcon />
      );
    }
    return (
      <div>
        {
          this.rendSongList(searchResult.getIn(`${type}.list`.split('.')).toJS())
        }
      </div>
    );
  }

  rendSearchResult() {
    const typesKeys = Object.keys(types);
    const { searchResult } = this.props;
    return (
      <Tabs>
        {
          typesKeys.map((key) => {
            const songNum = searchResult.get(key) ? searchResult.get(key).toJS().list.length : 0;
            return (
              <TabPane
                tab={
                  <div>

                    ({
                      songNum === 0 ?
                        (<span>{`${types[key]}${songNum}`}</span>) :

                        <Tooltip title={`已为您搜索出歌曲数量:${songNum}`} >{`${types[key]}${songNum}`}</Tooltip>
                    })
                  </div>

                }
                key={key}
              >
                {this.rendSearchResultByType(key)}
              </TabPane>
            );
          })
        }

      </Tabs>
    );
  }

  render() {
    return (
      <div className="music-search-view" >
        <Row>
          <Col span={10}>
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
