import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}`}>
          <div className="user-item__info">
            <h2>{props.title}</h2>
            <h3>Platform: {props.platform}</h3>
            <h3>Creator: {props.creator}</h3>
            <h3>
              {props.amount_member}
              {/* {props.partyCount} {props.partyCount === 1 ? 'Party' : 'Party'} */}
            </h3>
            <p>{props.description}</p>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
