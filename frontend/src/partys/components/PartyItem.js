import React, { useState, useContext, useEffect } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PartyItem.css';

const PartyItem = props => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [creator, setCreator] = useState({});
  // var creator = {}
  const [loading, setLoading] = useState(false);
  const [showParty, setShowParty] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [showIsFull, setShowIsFull] = useState(false);
  const [showJoined, setShowJoined] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openPartyHandler = async () => {
    setShowParty(true)
    setLoading(true)
    try {

      for (const key in props.members) {
        const e = props.members[key];
        const responseUser = await sendRequest(
          `http://localhost:5000/api/users/${e}`
        );
        var user = responseUser.user
        setLoadedUsers(loadedUsers => [...loadedUsers, {
          image: user.image,
          name: user.name,
          id: user.id
        }])
      }

      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect( () => {
    async function getCreator() {
      const responseCreator = await sendRequest(
        `http://localhost:5000/api/users/${props.creator}`
      );
      var ct = responseCreator.user
    setCreator({
      image: ct.image,
      name: ct.name,
      id: ct.id
    })
    }
    getCreator()
  }, [])

  const closePartyHandler = () => {
    setShowParty(false);
    setLoadedUsers([])
  }

  const openJoinedHandler = () => setShowJoined(true);

  const closeJoinedHandler = () => setShowJoined(false);

  const openIsFullHandler = () => setShowIsFull(true);

  const closeIsFullHandler = () => setShowIsFull(false);

  const openShowJoinSuccess = () => setShowJoinSuccess(true);

  const closeShowJoinSuccess = () => window.location.reload();

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/partys/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) { }
  };

  const joinPartyHandler = async () => {
    try {
      if (props.members && props.members.length >= props.amount_platform) {
        openIsFullHandler()
      } else if (props.members && props.members.includes(auth.userId)) {
        openJoinedHandler();
      } else {
        await sendRequest(
          `http://localhost:5000/api/partys/join/${props.id}`,
          'PATCH',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        ).then(() => {
          closeJoinedHandler()
          openShowJoinSuccess()
        })
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showParty}
        onCancel={closePartyHandler}
        header={props.title}
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={joinPartyHandler}>JOIN</Button>
            <Button onClick={closePartyHandler}>CLOSE</Button>
          </React.Fragment>
        }
      >
        <div className="party-container">
          <p><b>รายละเอียด:</b> {props.description}</p>
          <p><b>Platform:</b> {props.platform}</p>
          {creator.image &&
            <div className="flex">
              <p><b>สร้างโดย</b></p>
              <img className="member-list-img" src={`http://localhost:5000/${creator.image}`} alt={creator.name} />
              <p><b>{creator.name}</b></p>
            </div>
          }

          <p><b>สมาชิกของปาร์ตี้:</b></p>
          <ul>
            {loadedUsers.length > 0 && loadedUsers.map(user => (
              isLoading ? <LoadingSpinner asOverlay /> :
                <div className="flex">
                  <img className="member-list-img" src={`http://localhost:5000/${user.image}`} alt={user.name} />
                  <p><b>{user.name}</b></p>
                </div>
            ))}
          </ul>
        </div>
      </Modal>
      <Modal
        show={showJoinSuccess}
        onCancel={closeShowJoinSuccess}
        header="Success"
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={<Button onClick={closeShowJoinSuccess}>CLOSE</Button>}
      >
        <div className="p-1">
          <p>You've joined this party!</p>
        </div>
      </Modal>
      <Modal
        show={showIsFull}
        onCancel={closePartyHandler}
        header="Can't join this party!"
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={<Button onClick={closeIsFullHandler}>CLOSE</Button>}
      >
        <div className="p-1">
          <p>This party is full, Please try again.</p>
        </div>
      </Modal>
      <Modal
        show={showJoined}
        onCancel={closeJoinedHandler}
        header="Can't join this party!"
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={<Button onClick={closeJoinedHandler}>CLOSE</Button>}
      >
        <div className="p-1">
          <p>You have joined this party. Please Try again.</p>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="party-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this party? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="party-item">
        <Card className="party-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="party-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="party-item__info">
            <h2>{props.title}</h2>
            <p>{props.platform}</p>
            <p><b>Amount: </b>{props.members.length}/{props.amount_platform}</p>
          </div>
          <div className="party-item__actions">
            <Button inverse onClick={openPartyHandler}>
              View
            </Button>
            {auth.userId === props.creator && !props.mainPage && (
              <Button to={`/partys/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creator && !props.mainPage && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PartyItem;
