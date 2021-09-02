import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PartyForm.css';
import {  } from "./../../shared/components/FormElements/Input.css";

const NewParty = () => {
  const auth = useContext(AuthContext);
  // var creator = ''
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState({ value: '' })
  const [creator, setCreator] = useState('')
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      platform: {
        value: '',
        isValid: false
      },
      amount_platform: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      },
    },
    false
  );

  const history = useHistory();

  const platform = [
    { value: 'Youtube Premium', label: 'Youtube Premium' },
    { value: 'Netflix', label: 'Netflix' },
    { value: 'Spotify Premium', label: 'Spotify Premium' }
  ]

  // async function getCreator() {
  //   const responseCreator = await sendRequest(
  //     `http://localhost:5000/api/users/${auth.userId}`
  //   );
  //   var ct = responseCreator.user
  //   creator = ct.name
  // }

  useEffect( () => {
    setLoading(true)
    try {
      async function getCreator() {
      const responseCreator = await sendRequest(
        `http://localhost:5000/api/users/${auth.userId}`
      );
      var ct = responseCreator.user
      setCreator(ct.name)
      // creator = ct.name
      // creator = {
      //   image: ct.image,
      //   name: ct.name,
      //   id: ct.id
      // }
    }
    getCreator().then(() => setLoading(false))
    } catch (error) {
      console.log(error);
    }
    
  }, [])

  const partySubmitHandler = async event => {
    setLoading(true)
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('platform', formState.inputs.platform.value);
      formData.append('amount_platform', formState.inputs.amount_platform.value);
      // alert(formData.get('title'),formData.get('description'),formData.get('image'),formData.get('platform'),formData.get('amount_platform'))
      await sendRequest('http://localhost:5000/api/partys', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      }).then(() => {
        setLoading(false)
        setShowSuccessModal(true)
      }
)
      // history.push('/');
    } catch (err) { console.log(err); }
  };

  const handleChange = e => {
    const { name, value } = e.target
    setSelected(value)
    inputHandler(name, value, true)
    if (value === 'Youtube Premium') {
      inputHandler('amount_platform', 5, true)
    } else if (value === 'Netflix') {
      inputHandler('amount_platform', 4, true)
    } else {
      inputHandler('amount_platform', 6, true)
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="party-form" onSubmit={partySubmitHandler}>
        {loading && <LoadingSpinner asOverlay />}
        <div className="form-control false">
          {/* <label><b>Platform</b><br/></label> */}
          <label>Creator</label>
          <input 
          value={creator}
          disabled
          />
        </div>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <div className="form-control false">
          {/* <label><b>Platform</b><br/></label> */}
          <label>Platform</label>
          <select name="platform" id="platform" onChange={handleChange}> 
          <option disabled selected>Please select...</option>
            {platform.map((e, i) => (
              <option key={i} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* <Select options={platform} value={platform.value} onChange={}/> */}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PARTY
        </Button>
      </form>
      <Modal
        show={showSuccessModal}
        // onCancel={window.location.reload()}
        header="Success"
        contentClass="party-item__modal-content"
        footerClass="party-item__modal-actions"
        footer={<Button href={ `/${auth.userId}/partys`}>CLOSE</Button>}
      >
        <div className="p-1">
          <p>You've created this party!</p>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default NewParty;
