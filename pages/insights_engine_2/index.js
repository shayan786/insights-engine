import React, { PropTypes } from 'react';
import s from './styles.css';
import cx from 'classnames';
import * as d3 from 'd3';
import d3plus from 'd3plus';
import * as time from '../../utils/data/time.json';
import { isIp } from '../../utils/helpers.js';

class InsightsEnginePage extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      data: []
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
      let pData = [];

      time.data.forEach(d => {
        Object.keys(d.result).forEach(k => {
          isIp(k) &&
            pData.push(
              {
                time: new Date(d.result["_time"]),
                ip: k,
                bytes: parseInt(d.result[k])
              }
            )
        })
      })

      resolve(pData)
    })
  }

  _renderViz ()  {
    const { data } = this.state;

    d3plus.viz()
            .container("#main")
            .data(data)
            .type('bar')
            .id('ip')
            .x("time")
            .y({"stacked": true, "value": "bytes"})
            .tooltip(['dest', 'src'])
            .time("time")
            .draw();
  }

  render() {
    return (
      <section>
        <div id="main" style={{width:"100%", height: `${window.innerHeight}px`}} />
      </section>
    );
  }
}

export default InsightsEnginePage;
