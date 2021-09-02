import React, { useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import "./Profile.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';


const Profiles = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [creator, setCreator] = useState("");
  const [creatorImage, setCreatorImage] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const history = useHistory();

  const openShowJoinSuccess = () => setShowJoinSuccess(true);

  const closeShowJoinSuccess = () => window.location.reload();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const profileUpdateSubmitHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/users/${auth.userId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      ).then(() => {
        closeEditModalHandler()
        if (showEditModal) {
          openShowJoinSuccess()
        }
      })
      // history.push('/' + auth.userId + '/user');
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModalHandler = async () => {
    setShowEditModal(true);
  }

  const closeEditModalHandler = () => {
    setShowEditModal(false);
  }

  useEffect(() => {
    async function getCreator() {
      const responseCreator = await sendRequest(
        `http://localhost:5000/api/users/${auth.userId}`
      );
      var ct = responseCreator.user;
      setCreator(ct.name);
      setCreatorImage(ct.image);
      setCreatorEmail(ct.email);
      setFormData(
        {
          name: {
            value: ct.name,
            isValid: true
          },
          email: {
            value: ct.email,
            isValid: true
          }
        },
        true
      );
    }
    getCreator();
  }, []);

  return (
    <React.Fragment>
      <div className="profile">
        <h2>ข้อมูลส่วนตัว</h2>
        <div className="image-container">
          <img className="profile-img" src={`http://localhost:5000/${creatorImage}`} alt={creator} />
        </div>
        <p className="center"><b>Name: </b>{creator}</p>
        <p className="center"><b>Email: </b>{creatorEmail}</p>
        <div className="center">
          <Button inverse onClick={openEditModalHandler}>EDIT</Button>
        </div>
      </div>
      <Modal
        show={showEditModal}
        onCancel={closeEditModalHandler}
        header="Edit Profile"
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={
          <React.Fragment>
            <Button type="submit" onClick={profileUpdateSubmitHandler}>UPDATE</Button>
            <Button onClick={closeEditModalHandler}>CLOSE</Button>
          </React.Fragment>
        }
      >
        <form className="edit-form" onSubmit={profileUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={creator}
            initialValid={true}
          />
          <Input
            id="email"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
            initialValue={creatorEmail}
            initialValid={true}
          />
        </form>
      </Modal>
      <Modal
        show={showJoinSuccess}
        onCancel={closeShowJoinSuccess}
        header="Success"
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={<Button href="/">CLOSE</Button>}
      >
        <div className="p-1">
          <p>Update profile successfully.</p>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Profiles;
