import React, { useState, useContext } from 'react';
import { useParams } from 'react-router';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { AuthContext } from '../../shared/context/Auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './PlaceItem.css';

const PlaceItem = (props) => {
  const {
    id,
    image,
    title,
    address,
    description,
		location,
  } = props;

  const auth = useContext(AuthContext);
	const uid = useParams().uid;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showMap, setShowMap] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteModalHandler = () => {
    setShowDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowDeleteModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${id}`,
        'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
      );
      props.onDelete(id);
    } catch (err) {}
  }

  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </>
        }
      >
        <p>
          Do you want to delete this place?
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:5000/${image}`} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.isLoggedIn && auth.userId === uid && (
              <Button to={`/places/${id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.userId === uid && (
              <Button danger onClick={showDeleteModalHandler}>DELETE</Button>
            )}
          </div>
        </Card>
      </li>
    </>
  )
};

export default PlaceItem;