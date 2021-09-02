import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PartyList from '../components/PartyList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPartys = () => {
  const [loadedPartys, setLoadedPartys] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPartys = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/partys/user/${userId}`
        );
        setLoadedPartys(responseData.partys);
      } catch (err) { }
    };
    fetchPartys();
  }, [sendRequest, userId]);

  const partyDeletedHandler = deletedPartyId => {
    setLoadedPartys(prevPartys =>
      prevPartys.filter(party => party.id !== deletedPartyId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedPartys && (
        <React.Fragment>
          <p className="my-party-header">My created parties</p>
          <PartyList myParty auth={userId} items={loadedPartys} onDeleteParty={partyDeletedHandler} />
          <p className="my-party-header">My joined parties</p>
          <PartyList joinedParty auth={userId} items={loadedPartys} onDeleteParty={partyDeletedHandler} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserPartys;
