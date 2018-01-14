import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import s from './styles.css';

import { EndUsers } from '../../utils/data/EndUsers';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = "SW - AppMap";
  }

  render() {
    const userStatement = "User can see the status of their business user's experience and business service offerings status."

    return (
      <Layout
        className={s.content}
        userStatement={userStatement}>
        {
          EndUsers.map((eu, i) => {
            return (
              <div key={i} className={s.row}>
                <div className={s.left}>
                  <img className={s.icon} src="/images/icons/user.svg" />
                  <img className={s.status} src={`/images/icons/${eu.status}.svg`} />
                  <div className={s.location}>
                    {eu.location}
                  </div>
                </div>
                <div className={s.right}>
                  {
                    eu.applications.map((a, j) => {
                      return  <Button
                                key={j}
                                shape="hexagon"
                                size="medium"
                                icon={a.name} />
                    })
                  }
                </div>
              </div>
            )
          })
        }

        <div className={s.row}>
          <div className={s.left}>
            <Button
              classnames={s.addEu}
              shape="circle"
              size="small"
              icon="add" />
          </div>
          <div className={s.right} />
        </div>

      </Layout>
    );
  }
}

export default HomePage;
