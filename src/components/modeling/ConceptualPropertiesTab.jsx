import React from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { useActor } from '@xstate/react';

import { useModelingContext } from '../../contexts/ModelingContext';
import { useAppContext } from '../../contexts/global/AppContext';
import AttributePropertiesTab from './AttributePropertiesTab';
import EntityPropertiesTab from './EntityPropertiesTab';
import GeneralizationPropertiesTab from './GeneralizationPropertiesTab';
import RelationPropertiesTab from './RelationPropertiesTab';
import { SelectionTypes, getSelectionTarget } from './state/conceptual/selection';
import Attribute, { AttributeOwnerTypes } from './types/Attribute';
import Connection, { ConnectionTip, ConnectionTipsType } from './types/Connection';
import Entity from './types/Entity';
import Relation from './types/Relation';

/**
 * Função de critério usada para ordenar objetos pelo nome.
 * 
 * @param {*} lhs 
 * @param {*} rhs 
 * @returns Se lhs for posicionado antes que rhs, -1. Se posicionado depois, 1. Senão, 0.
 */
function sortByName(lhs, rhs) {
  return lhs.name < rhs.name ? -1 : lhs.name === rhs.name ? 0 : 1;
}

/**
 * Componente que representa as propriedades específicas de uma Entidade, Atributo, Relação ou Generalização.
 */
function ConceptualPropertiesTab() {
  const {
    toolMachineServices
  } = useModelingContext();
  const {store} = useAppContext();

  const [state, send] = useActor(toolMachineServices);
  const selectedTarget = getSelectionTarget(state, store);

  if (!selectedTarget) {
    return (
      <Flex
        alignItems='center'
        justifyContent='center'>
        <Text> Nenhum alvo selecionado.</Text>
      </Flex>
    )
  }

  const target = selectedTarget.target;

  switch (true) {
    case selectedTarget.type === SelectionTypes.entity: {
      return (
        <EntityPropertiesTab
          entities={
            store.conceptual.entities.toSorted(sortByName)
          }
          relations={
            store.conceptual.relations.filter(relation => (
              relation.entitiesIds.find(id => id === target.id)
            )).toSorted(sortByName)
          }
          generalizations={
            store.conceptual.generalizations.filter(generalization => (
              generalization.derivedsIds.includes(target.id)
            )).toSorted(sortByName)
          }
          attributes={
            store.conceptual.attributes.filter(attribute => (
              attribute.owner?.id === target.id
            )).toSorted(sortByName)
          }
          store={store}
          entity={selectedTarget.target} />
      );
    }
    case selectedTarget.type === SelectionTypes.attribute: {
      const attribute = store.conceptual.attributes.find(attribute => attribute.id === target.id);

      return (
        <AttributePropertiesTab
          entities={
            store.conceptual.entities.toSorted(sortByName)
          }
          relations={
            store.conceptual.relations.toSorted(sortByName)
          }
          onOwnerChange={(details) => {
            Attribute.setOwner(attribute, details.id, details.type);
            Connection.removeConnectionsById(store.conceptual.connections, attribute.id);

            const attributeConnectionTip = new ConnectionTip(
              ConnectionTipsType.attribute,
              attribute.id,
              .25);
            const attributeBoundingBox = Attribute.getBoundingBox(attribute);

            switch (details.type) {
              case AttributeOwnerTypes.entity: {
                const entity = store.conceptual.entities.find(entity => entity.id === details.id);

                store.conceptual.connections.push(new Connection(
                  new ConnectionTip(
                    ConnectionTipsType.entity,
                    entity.id,
                    .25),
                  attributeConnectionTip,
                  [Entity.getBoundingBox(entity), attributeBoundingBox]
                ));
                break;
              }
              case AttributeOwnerTypes.relation: {
                const relation = store.conceptual.relations.find(relation => relation.id === details.id);

                store.conceptual.connections.push(new Connection(
                  new ConnectionTip(
                    ConnectionTipsType.relation,
                    relation.id,
                    .25),
                  attributeConnectionTip,
                  [Relation.getBoundingBox(relation), attributeBoundingBox]
                ));
                break;
              }
              default: throw error('Unknown type');
            }
          }}
          owner={Attribute.getOwnerByIdAndType(attribute, store)}
          attribute={attribute} />
      )
    }
    case selectedTarget.type === SelectionTypes.relation: {
      const relation = store.conceptual.relations.find(relation => relation.id === target.id);

      return (
        <RelationPropertiesTab
          attributes={
            store.conceptual.attributes.filter(attribute => (
              attribute.owner?.id === target.id
            )).toSorted(sortByName)
          }
          relation={relation}
          entities={
            store.conceptual.entities.filter(entity => relation.entitiesIds.includes(entity.id))
          }
          store={store}
        />
      )
    }
    case selectedTarget.type === SelectionTypes.generalization: {
      const generalization = store.conceptual.generalizations.find(generalization => generalization.id === target.id);

      return (
        <GeneralizationPropertiesTab
          generalization={generalization}
          baseEntity={store.conceptual.entities.find(entity => entity.id === generalization.baseId)}
          derivedEntities={
            store.conceptual.entities
              .filter(entity => generalization.derivedsIds.includes(entity.id))
              .toSorted(sortByName)
          }
          store={store}
          entities={
            store.conceptual.entities
              .filter(entity => (
                entity.id !== generalization.baseId 
                && !generalization.derivedsIds.includes(entity.id)
              ))
              .toSorted(sortByName)
          }
          />
      )
    }
    default: throw Error('Unexpected Type');
  }
}

export default ConceptualPropertiesTab