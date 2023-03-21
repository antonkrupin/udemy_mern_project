import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/utils/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UpdatePlace = () => {
  const pid = useParams().pid;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ place, setPlace ] = useState();

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    }
  }, false);

  useEffect(() => {
    const fetchPlace = async () => {
      const responseData = await sendRequest(`http://localhost:5000/api/places/${pid}`);
      setPlace(responseData.place);
      setFormData({
        title: {
          value: place.title,
          isValid: true,
        },
        description: {
          value: place.description,
          isValid: true,
        }
      }, true);
      console.log('responseData', responseData.place);
      console.log('formState', formState);
    }
    fetchPlace();
    /* setFormData({
      title: {
        value: place.title,
        isValid: true,
      },
      description: {
        value: place.description,
        isValid: true,
      }
    }, true); */
    /* if (place) {
      setFormData({
        title: {
          value: place.title,
          isValid: true,
        },
        description: {
          value: place.description,
          isValid: true,
        }
      }, true)
    } */
    // setIsLoading(false);
  }, [sendRequest, pid, setFormData]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    await sendRequest(
      `http://localhost:5000/api/places/${pid}`,
      'PATCH',
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      }),
      {
        'Content-Type': 'application/json'
      },
    );
  };

  /* if (!place) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  } */

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && !place && (
        <div className="center">
          <Card>
            <h2>Could not find place!</h2>
          </Card>
        </div>
      )}
      <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description. 5 chars min."
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid} >UPDATE PLACE</Button>
      </form>
    </>
  )
};

export default UpdatePlace;