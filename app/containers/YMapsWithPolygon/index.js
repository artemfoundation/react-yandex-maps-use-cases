/*
 * YMapsWithPolygon
 *
 * List all the features
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  YMaps,
  Map,
  ZoomControl,
  Polygon,
  ObjectManager,
  Button,
} from '@innodata/react-yandex-maps';
import { Row, Col, Button as AntButton } from 'antd';
import { getCenterOfBounds } from 'geolib';
import { map, assign } from 'lodash';
import { useInjectReducer } from 'utils/injectReducer';
import { generateRandomPoints } from '../../utils/geo';
import config from '../../config';
import reducer from './reducer';
import { changeData, deleteData, clearData } from './actions';

import PolygonResultListComponent from './components/ResultsList';

const key = 'polygon';
const mapOptions = {
  defaultState: { center: [55.749, 37.524], zoom: 14, controls: [] },
  width: '100%',
  height: 350,
};

const createCompetitors = coords => {
  const centerOfBounds = getCenterOfBounds(
    map(coords[0], coord => ({ latitude: coord[0], longitude: coord[1] })),
  );
  const randomPoints = generateRandomPoints(
    { lat: centerOfBounds.latitude, lng: centerOfBounds.longitude },
    1500,
    5,
  );
  const randomPolygon = map(randomPoints, randomPoint =>
    generateRandomPoints(
      { lat: randomPoint.lat, lng: randomPoint.lng },
      500,
      4,
    ),
  );

  const competitors = map(randomPolygon, (item, index) => {
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
        type: 'Polygon',
        coordinates: [map(item, i => [i.lat, i.lng])],
      },
      properties: {},
      options: {
        opacity: 0.4,
        strokeWidth: 1,
        fillColor: '#00FF00',
      },
    };
  });

  return competitors;
};

export default function YMapsWithPolygon() {
  useInjectReducer({ key, reducer });
  const dispatch = useDispatch();

  let clusterInit = false;
  let clearButtonInit = false;
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);

  let polygonEditorInit = false;

  const draw = inst => {
    if (inst && !polygonEditorInit) {
      polygonEditorInit = true;
      inst.editor.startDrawing();

      inst.editor.events.add(['drawingstop', 'vertexdragend'], e => {
        const coords = inst.geometry.getCoordinates();
        setPolygonCoordinates(coords);
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
                selected: !selected,
              },
            }),
          );

          if (!selected) {
            currentObject.options.set('opacity', 1);
            dispatch(
              changeData({
                [currentObjectData.data.id]: {
                  ...currentObjectData.data,
                },
              }),
            );
          } else {
            currentObject.options.set('opacity', 0.4);
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
        setPolygonCoordinates([]);
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
              modules={['package.full']}
            >
              <Polygon
                geometry={polygonCoordinates}
                options={{
                  // Курсор в режиме добавления новых вершин.
                  editorDrawingCursor: 'crosshair',
                  // Максимально допустимое количество вершин.
                  editorMaxPoints: 5,
                  // Цвет заливки.
                  fillColor: '#FA867E',
                  // Цвет обводки.
                  strokeColor: '#B30000',
                  // Ширина обводки.
                  strokeWidth: 2,
                  opacity: 0.5,
                }}
                instanceRef={ref => ref && draw(ref)}
              />
              {showCompetitors ? (
                <ObjectManager
                  options={{
                    clusterize: false,
                  }}
                  objects={{}}
                  clusters={{
                    preset: 'islands#redClusterIcons',
                  }}
                  features={createCompetitors(polygonCoordinates)}
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
          {polygonCoordinates &&
          polygonCoordinates.length &&
          !showCompetitors ? (
              <AntButton type="primary" onClick={() => setShowCompetitors(true)}>
              Показать конкурентов на карте
              </AntButton>
            ) : null}
        </Col>
      </Row>
      <Row>
        <Col>
          <PolygonResultListComponent />
        </Col>
      </Row>
    </div>
  );
}
