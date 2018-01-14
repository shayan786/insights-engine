import React, { PropTypes } from 'react';
import s from './styles.css';
import cx from 'classnames';
import * as d3 from 'd3';
import d3plus from 'd3plus';
import * as trafficBytes from '../../utils/data/traffic_bytes.json';

class InsightsEnginePage extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      data: [],
      selectedBy: 'dest'
    }
  }

  componentDidMount() {
    this._processData()
          .then(result => { 
            this.setState({ 
              data: result
            }, () => {
              this._renderViz();
            }) 
          })
  }

  _processData () {
    return new Promise ((resolve, reject) => {
      resolve(trafficBytes.data.map(d => {
        return {
          dest: d.result["All_Traffic.dest"],
          src: d.result["All_Traffic.src"],
          sumBytes: parseInt(d.result.sum_bytes)
        }
      }))
    })

    function getMin (data) {
      return data.reduce((min, curr) => min < curr ? min : curr, data[0]);
    }

    function getMax (data) {
      return data.reduce((max, curr) => max > curr ? max : curr, data[0]);
    }
  }

  _renderViz ()  {
    const { data, selectedBy } = this.state;

    d3.select('#main').selectAll("*").remove();

    d3plus.viz()
            .container("#main")
            .data(data)
            .type('tree_map')
            .id(selectedBy)
            .size("sumBytes")
            .tooltip(['dest', 'src'])
            .draw();
  }

  _renderHeader () {
    const { selectedBy } = this.state;

    return (
      <header className={s.header} ref="header">
        <div 
          className={cx(s.btn, selectedBy === 'dest' && s.selected)}
          onClick={this._handleBtnClick.bind(this, 'dest')}>
          Sum Bytes by Dest IP
        </div>
        <div 
          className={cx(s.btn, selectedBy === 'src' && s.selected)}
          onClick={this._handleBtnClick.bind(this, 'src')}>
          Sum Bytes by Src IP
        </div>
      </header>
    )
  }

  _handleBtnClick (sb) {
    const { selectedBy } = this.state;

    if (selectedBy == sb)
      return;

    this.setState(prevState => {
      return {
        selectedBy: prevState.selectedBy === 'dest' ? 'src' : 'dest'
      }
    }, () => {
      this._renderViz()
    })
  }

  render() {
    const headerHeight = this.refs.header && this.refs.header.clientHeight || 0;

    return (
      <section>
        { this._renderHeader() }
        <div id="main" style={{width:"100%", height: `${window.innerHeight - headerHeight - 3}px`}} />
      </section>
    );
  }
}

export default InsightsEnginePage;
