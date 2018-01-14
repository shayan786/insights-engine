import React, { PropTypes } from 'react';
import s from './styles.css';
import cx from 'classnames';
import * as d3 from 'd3';
import d3plus from 'd3plus';
import * as followedBy from '../../utils/data/followed_by.json';
import { isIp } from '../../utils/helpers.js';
import uniq from 'lodash/uniq';

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
      let vData = [];

      pData = followedBy.data.map(d => {
                return {
                  time: new Date(d.result["_time"]),
                  user: d.result["Authentication.user"],
                  action: d.result["Authentication.action"],
                  count: parseInt(d.result["count"])
                }
              });

      vData = uniq(pData.map(d => d.user)).map(d => { return {user: d} });

      vData.forEach(u => {
        const entries = pData.filter(d => d.user === u.user).map(e => { return { time: e.time, action: e.action, count: e.count } });

        u.user = u.user,
        u.failureCount = entries.filter(e => e.action === "failure").length,
        u.entries = entries,
        u.entriesCount = entries.length,
        u.averageFailureAttempts = entries.filter(e => e.action === "failure").reduce((prev, curr) => { return prev + curr.count }, 0) / entries.filter(d => d.action === "failure").length
      });

      resolve(vData)  
    })
  }

  _renderViz ()  {
    const { data } = this.state;
    
    d3plus.viz()
            .container("#main")
            .data(data)
            .type("scatter")
            .id("user")
            .x("averageFailureAttempts")
            .y("failureCount")
            .size("entriesCount")
            .mouse({"click": function (d, viz) { console.log(d) } })
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
