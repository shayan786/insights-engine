import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Header from '../../components/Layout/Header';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner/Spinner';
import Search from '../../components/Search/Search';
import StatusHover from '../../components/StatusHover/StatusHover';
import s from './styles.css';
import * as d3 from 'd3';
import cx from 'classnames';
import { exchange, orion, orionNoRecs, orionComplete, orionMockRecs} from '../../utils/data/Application';
// import { admOrion } from '../../utils/data/adm';
import map from 'lodash/map';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { truncateText, abbreviateText, wrap, randomTime, getStatusColor, getPercentColor, isIp } from '../../utils/helpers';

const IMAGE_SIZE = 24;

class IndexPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      applications: [exchange, orionMockRecs],
      hoverNode: null,
      hoverNodeX: null,
      noverNodeY: null
    }
  }

  componentDidMount() {
    
  }

  _renderSubHeader () {
    return (
      <div className={s.subheader}>
        <a
          href="/draw-1"
          className={cx("btn", s.subheader__createMap)}>
          <img src="/images/icons/add.svg" />
          CREATE NEW MAP
        </a>
        <div style={{width: '20%'}}>
          <Search
            placeholder="Find an application..." />
        </div>
      </div>
    );
  }

  _renderList () {
    const { applications } = this.state;

    return (
      <div className={s.list}>
        <div className={s.list__item}>
          <div className={s.list__item_status}>
            Status
          </div>
          <div className={s.list__item_name}>
            Application Name
          </div>
          <div className={s.list__item_servers}>
            Servers
          </div>
          <div className={s.list__item_volumes}>
            Volumes
          </div>
        </div>
        {
          applications.map((a, key) => {
            return (
              <div className={s.list__item} key={key}>
                <div className={s.list__item_status} style={{textAlign: 'center'}}>
                  <img src={`/images/icons/${a.status}.svg`} />
                </div>
                <div className={s.list__item_name}>
                  {a.name}
                </div>
                <div className={s.list__item_servers}>
                  {
                    a.nodes.filter(n => n.pillar === 'Server').map((n, key) => {
                      return <img
                                key={key}
                                src={`/images/icons/${n.status}.svg`}
                                onMouseOver={e => this.setState({ hoverNode: n, hoverNodeX: e.clientX, hoverNodeY: e.clientY })}
                                onMouseOut={e => this.setState({ hoverNode: null })} />
                    })
                  }
                </div>
                <div className={s.list__item_volumes}>
                  {
                    a.nodes.filter(n => n.pillar === 'Storage').map((n, key) => {
                      return <img 
                                key={key}
                                src={`/images/icons/${n.status}.svg`}
                                onMouseOver={e => this.setState({ hoverNode: n, hoverNodeX: e.clientX, hoverNodeY: e.clientY })}
                                onMouseOut={e => this.setState({ hoverNode: null })} />
                    })
                  }
                </div>
                <div className={s.list__item_btns}>
                  <div className={s.list__item_btns_btn} >
                    <img src="/images/icons/network-path.svg" />
                    <div className={s.tooltip}>
                      Map
                    </div>
                  </div>
                  <div className={s.list__item_btns_btn} >
                    <img src="/images/icons/details.svg" />
                    <div className={s.tooltip}>
                      Details
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    )
  }

  render() {
    const { hoverNode, hoverNodeX, hoverNodeY } = this.state;

    return (
      <div>
        <Header />
        <h5 className={s.title}> All Application Maps </h5>
        { this._renderSubHeader() }
        { this._renderList() }
        { hoverNode &&
          <StatusHover
            top={hoverNodeY}
            left={hoverNodeX}
            node={hoverNode} />
        }
      </div>
    );
  }
}

export default IndexPage;
