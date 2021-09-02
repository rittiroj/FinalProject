import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import PartyItem from './PartyItem';
import Button from '../../shared/components/FormElements/Button';
import './PartyList.css';

const PartyList = props => {
  if (props.items.length === 0) {
    return (
      <div className="party-list center">
        <Card>
          <h2>No partys found. Maybe create one?</h2>
          <Button to="/partys/new">Share Party</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="party-list">
      {props.mainPage && props.items.map(party => (
        party.platform === props.platform ?
        <PartyItem
          key={party.id}
          id={party.id}
          image={party.image}
          title={party.title}
          description={party.description}
          platform={party.platform}
          amount_platform={party.amount_platform}
          members={party.members}
          creatorId={party.creator.id}
          creator={party.creator}
          onDelete={props.onDeleteParty}
          mainPage
        /> : null
      ))}
      {props.myParty && props.items.map(party => (
        props.auth === party.creator ? 
        <PartyItem
          key={party.id}
          id={party.id}
          image={party.image}
          title={party.title}
          description={party.description}
          platform={party.platform}
          amount_platform={party.amount_platform}
          members={party.members}
          creatorId={party.creator.id}
          creator={party.creator}
          onDelete={props.onDeleteParty}
        /> : null
      ))}
      {props.joinedParty && props.items.map(party => (
        props.auth !== party.creator ?
        <PartyItem
          key={party.id}
          id={party.id}
          image={party.image}
          title={party.title}
          description={party.description}
          platform={party.platform}
          amount_platform={party.amount_platform}
          members={party.members}
          creatorId={party.creator.id}
          creator={party.creator}
          onDelete={props.onDeleteParty}
        /> : null
      ))}
      {!props.mainPage && !props.joinedParty && !props.myParty && props.items.map(party => (
        <PartyItem
          key={party.id}
          id={party.id}
          image={party.image}
          title={party.title}
          description={party.description}
          platform={party.platform}
          amount_platform={party.amount_platform}
          members={party.members}
          creatorId={party.creator.id}
          creator={party.creator}
          onDelete={props.onDeleteParty}
        />
      ))}
    </ul>
  );
};

export default PartyList;
