import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/utils/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/Auth-context';

import './NewPlace.css'

const NewPlace = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm({
		title: {
			value: '',
			isValid: false,
		},
		description: {
			value: '',
			isValid: false,
		},
		address: {
			value: '',
			isValid: false,
		},
		image: {
			value: null,
			isValid: false,
		}
	}, false);

	const formSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('title', formState.inputs.title.value);
			formData.append('description', formState.inputs.description.value);
			formData.append('address', formState.inputs.address.value);
			formData.append('image', formState.inputs.image.value);
			await sendRequest(
				'http://localhost:5000/api/places/',
				'POST',
				formData,
				{
					Authorization: 'Bearer ' + auth.token
				}
			);
			navigate('/');
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError}/>
			<form className="place-form" onSubmit={formSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id="title"
					element="input"
					type="text"
					label="Title"
					errorText={"Input valid value"}
					validators={[VALIDATOR_REQUIRE()]}
					onInput={inputHandler}
				/>
				<Input
					id="description"
					element="textarea"
					label="Description"
					errorText={"Enter valid value for description (5 chars min)"}
					validators={[VALIDATOR_MINLENGTH(5)]}
					onInput={inputHandler}
				/>
				<Input
					id="address"
					element="input"
					type="text"
					label="Address"
					errorText={"Input valid address"}
					validators={[VALIDATOR_REQUIRE()]}
					onInput={inputHandler}
				/>
				<ImageUpload id="image" center onInput={inputHandler} />
				<Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
			</form>
		</>
	);
};

export default NewPlace;