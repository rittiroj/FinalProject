import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';

const UsersList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No partys found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          title={user.title}
          platform={user.platform}
          creator={user.creator}
          amount_member={user.amount_member}
          description={user.description}
        // partyCount={user.partys.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
