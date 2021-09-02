import React, { useEffect, useState } from 'react';

import PartyList from "../../partys/components/PartyList";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Users.css'

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPartys, setLoadedPartys] = useState();

  useEffect(() => {
    const fetchPartys = async () => {
      try {
        var responseData = await sendRequest(
          'http://localhost:5000/api/partys'
        );
        // debugger
        setLoadedPartys(responseData.parties);
      } catch (err) { }
    };
    fetchPartys();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPartys &&
        <React.Fragment>
          <p className="platform-header">Youtube Premium</p>
          <PartyList mainPage items={loadedPartys} platform="Youtube Premium" />
        </React.Fragment>
      }
      {!isLoading && loadedPartys &&
        <React.Fragment>
          <p className="platform-header">Spotify Premium</p>
          <PartyList mainPage items={loadedPartys} platform="Spotify Premium" />
        </React.Fragment>
      }
      {!isLoading && loadedPartys &&
        <React.Fragment>
          <p className="platform-header">Netflix</p>
          <PartyList mainPage items={loadedPartys} platform="Netflix" />
        </React.Fragment>
      }
    </React.Fragment>
  );
};

export default Users;
