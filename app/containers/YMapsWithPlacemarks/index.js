/*
 * YMapsWithBaloons
 *
 * List all the features
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  YMaps,
  Map,
  ZoomControl,
  Placemark,
  ObjectManager,
  Button,
} from '@innodata/react-yandex-maps';
import { Row, Col, Button as AntButton } from 'antd';
import { useInjectReducer } from 'utils/injectReducer';
import { map, assign } from 'lodash';
import { generateRandomPoints } from '../../utils/geo';
import config from '../../config';
import reducer from './reducer';
import { changeData, deleteData, clearData } from './actions';

import ResultListComponent from './components/ResultsList';

const key = 'placemarks';
const mapOptions = {
  defaultState: { center: [55.749, 37.524], zoom: 14, controls: [] },
  width: '100%',
  height: 350,
};

const createCompetitors = coords =>
  map(
    generateRandomPoints(
      {
        lat: coords[0],
        lng: coords[1],
      },
      1000,
      10,
    ),
    (item, index) => {
      const id = ++index;
      return {
        id,
        data: {
          id,
          name: `Компания ${id}`,
          description: `Описание компании ${id}`,
        },
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.lat, item.lng],
        },
        properties: {},
        options: {
          preset: 'islands#circleIcon',
        },
      };
    },
  );

export default function YMapsWithPlacemarks() {
  useInjectReducer({ key, reducer });
  const dispatch = useDispatch();

  let yMapsInit = false;
  let yMapsInst = null;
  let clusterInit = false;
  let clearButtonInit = false;
  const [myPlacemarkInit, setMyPlacemarkInit] = useState(false);
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [myPlacemarkCoords, setMyPlacemarkCoords] = useState([]);
  const [myPlacemarkInst, setMyPlacemarkInst] = useState(null);

  const yMapsRef = inst => {
    if (inst && !yMapsInit) {
      yMapsInit = true;
      yMapsInst = inst;

      // Слушаем клик на карте.
      yMapsInst.events.add(['click'], function(e) {
        const coords = e.get('coords');
        setMyPlacemarkCoords(coords);

        if (showCompetitors) {
          setShowCompetitors(false);
          dispatch(clearData());
        }

        if (!myPlacemarkInit) {
          setMyPlacemarkInit(true);
        }
      });
    }
  };

  const placemarkRef = inst => {
    if (inst && !myPlacemarkInst) {
      setMyPlacemarkInit(true);
      setMyPlacemarkInst(inst);

      inst.events.add('dragend', e => {
        setMyPlacemarkCoords(e.get('target').geometry.getCoordinates());
      });

      inst.events.add('dragstart', e => {
        setShowCompetitors(false);
        dispatch(clearData());
      });
    }
  };

  const clusterRef = inst => {
    if (inst && !clusterInit) {
      clusterInit = true;

      inst.events.add(['click'], e => {
        const currentCollection = e.get('target');
        const objectId = e.get('objectId');

        if (objectId) {
          const currentObject = currentCollection.getById(objectId);
          const currentObjectData = currentObject.getData();
          const selected = !!(
            currentObjectData.properties &&
            currentObjectData.properties.selected
          );
          currentObject.setData(
            assign(currentObjectData, {
              properties: {
                iconCaption: selected ? '' : 'выбрано',
                iconContent: selected ? '' : currentObjectData.data.id,
                selected: !selected,
              },
            }),
          );

          if (!selected) {
            dispatch(
              changeData({
                [currentObjectData.data.id]: {
                  ...currentObjectData.data,
                },
              }),
            );
          } else {
            dispatch(deleteData(currentObjectData.data.id));
          }
        }
      });
    }
  };

  const clearButtonRef = inst => {
    if (inst && !clearButtonInit) {
      clearButtonInit = true;

      inst.events.add('click', () => {
        clusterInit = false;
        setShowCompetitors(false);
        setMyPlacemarkInit(false);
        setMyPlacemarkInst(null);
        setMyPlacemarkCoords([]);
        dispatch(clearData());
      });
    }
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col>
          <YMaps
            query={{
              apikey: config.apikey,
            }}
          >
            <Map
              defaultState={mapOptions.defaultState}
              width={mapOptions.width}
              height={mapOptions.height}
              instanceRef={yMapsRef}
              modules={['package.full']}
            >
              {myPlacemarkInit ? (
                <Placemark
                  geometry={myPlacemarkCoords}
                  options={{ draggable: true, iconColor: 'red' }}
                  instanceRef={placemarkRef}
                  properties={{
                    iconCaption: 'ИНТЕКО',
                    balloonContent: `Координаты: <br> ${myPlacemarkCoords}`,
                  }}
                />
              ) : null}
              {showCompetitors ? (
                <ObjectManager
                  options={{
                    clusterize: true,
                    gridSize: 32,
                  }}
                  objects={{
                    openBalloonOnClick: true,
                    preset: 'islands#redClusterIcon',
                  }}
                  clusters={{
                    preset: 'islands#redClusterIcons',
                  }}
                  features={createCompetitors(myPlacemarkCoords)}
                  modules={[
                    'objectManager.addon.objectsBalloon',
                    'objectManager.addon.objectsHint',
                  ]}
                  instanceRef={clusterRef}
                />
              ) : null}
              <Button
                options={{ maxWidth: 100, selectOnClick: false }}
                data={{ content: 'Очистить' }}
                defaultState={{ selected: false }}
                instanceRef={clearButtonRef}
              />
              <ZoomControl options={{ float: 'right' }} />
            </Map>
          </YMaps>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          {myPlacemarkInit && !showCompetitors ? (
            <AntButton type="primary" onClick={() => setShowCompetitors(true)}>
              Показать конкурентов на карте
            </AntButton>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col>
          <ResultListComponent />
        </Col>
      </Row>
    </div>
  );
}
