import React from 'react';

import Tree, { TreeNode } from 'rc-tree';

import "rc-tree/assets/index.css";
import { useAppContext } from '../../contexts/global/AppContext';

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
 * Componente que representa a hierarquia dos participantes da Cena do Modelo Entidade-Relacionamento.
 * 
 * Essa hierarquia apresenta as Entidades, seus atributos, suas generalizações/especializações e as suas relações.
 */
function ConceptualSceneTab() {
  const {store} = useAppContext();

  const entities = store.conceptual.entities
    .map(entity => {
      const attributes = store.conceptual.attributes
        .filter(attribute => attribute.owner?.id === entity.id)
        .toSorted(sortByName);
      const generalizations = store.conceptual.generalizations
        .filter(generalization => generalization.derivedsIds.includes(entity.id))
        .map(generalization => store.conceptual.entities.find(entity => entity.id === generalization.baseId))
        .toSorted(sortByName);

      return {
        ...entity,
        attributes,
        generalizations,
      }
    })
    .toSorted(sortByName);

  const relations = store.conceptual.relations
    .map(relation => {
      const attributes = store.conceptual.attributes
        .filter(attribute => attribute.owner?.id === relation.id)
        .toSorted(sortByName);
      const entities = relation.entitiesIds
        .map(id => store.conceptual.entities.find(entity => entity.id === id))
        .toSorted(sortByName);

      return {
        ...relation,
        attributes,
        entities
      }
    })
    .toSorted(sortByName);

  return (
    <Tree 
      onSelect={(selectedKeys, e) => {
        //nothing
      }}
      showIcon={false} 
      defaultExpandAll >
      <TreeNode title='Cena' key='Cena'>
        <TreeNode title='Entidades' key='entidades'>
          {
            entities.map(entity => (
              <TreeNode title={entity.name} key={entity.id}>
                <TreeNode title='Atributos' key={`${entity.id}_attributes`}>
                  {
                    entity.attributes.map(attribute => (
                      <TreeNode key={attribute.name} title={attribute.name} />
                    ))
                  }
                </TreeNode>

                <TreeNode title='Generalizações' key={`${entity.id}_generalizations`}>
                  {
                    entity.generalizations.map(baseEntity => (
                      <TreeNode key={`${entity.id}_${baseEntity.id}`} title={baseEntity.name} />
                    ))
                  }
                </TreeNode>
              </TreeNode>
            ))
          }
        </TreeNode>
        <TreeNode title='Relações' key='relações'>
          {
            relations.map(relation => (
              <TreeNode title={relation.name} key={relation.id}>
                <TreeNode title='Atributos' key={`${relation.id}_attributes`}>
                  {
                    relation.attributes.map(attribute => (
                      <TreeNode key={`${relation.id}_${attribute.id}`} title={attribute.name}>
                      </TreeNode>
                    ))
                  }
                </TreeNode>

                <TreeNode title='Participantes' key={`${relation.id}_participants`}>
                  {
                    relation.entities.map(entity => (
                      <TreeNode key={`${relation.id}_${entity.id}`} title={entity.name}>
                      </TreeNode>
                    ))
                  }
                </TreeNode>
              </TreeNode>
            ))
          }
        </TreeNode>
      </TreeNode>
    </Tree>
  )
}

export default ConceptualSceneTab