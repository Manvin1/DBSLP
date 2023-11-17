import * as math from "mathjs";
import { checkIntersection } from 'line-intersect';

import Rect from "./Rect";
import Vertex from "./Vertex";
import CanvasDetails from "./CanvasDetails";

/**
 * Enum que representa os tipos de figuras que podem participar de uma conexão.
 */
export const ConnectionTipsType = Object.freeze({
  entity: 'entity',
  relation: 'relation',
  attribute: 'attribute',
  generalization: 'generalization',
  table: 'table',
});

/**
 * Enum que representa os tipos de papéis em uma conexão.
 */
export const ConnectionRole = Object.freeze({
  origin: 'origin',
  target: 'target',
  none: 'none',
});

/**
 * Classe que representa um Segmento de Reta.
 */
export class Segment
{
  /**
   * Construir um Segmento a partir do seu vértice inicial e final.
   * 
   * @param {Vertex} start 
   * @param {Vertex} end 
   */
  constructor(start, end)
  {
    this.id = crypto.randomUUID();
    this.start = start;
    this.end = end;
  }

  id;
  start;
  end;
}

/**
 * Classe que representa uma extremidade de uma conexão para uma Figura.
 */
export class ConnectionTip
{
  /**
   * Construir uma extremidade de conexão para um tipo específico, com um certo id e posicionado num valor específico do seu perímetro.
   * 
   * @param {ConnectionTipsType} type 
   * @param {String} id 
   * @param {Number} perimeterOffset Número no intervalo [0,1]
   */
  constructor(type, id, perimeterOffset)
  {
    this.type = type;
    this.id = id;
    this.perimeterOffset = perimeterOffset;
  }

  id;
  type;
  perimeterOffset;
}

/**
 * Classe que representa uma conexão.
 * 
 * Uma conexão é um conjunto de segmentos de retas.
 */
export default class Connection
{
  /**
   * Construir uma conexão de uma origem para um alvo, especificando os seus boundingBoxes.
   * 
   * @param {ConnectionTip} origin 
   * @param {ConnectionTip} target 
   * @param {Rect[]} boxes Array dos boundings boxes da origem e do alvo.
   */
  constructor(origin, target, boxes)
  {
    this.origin = origin;
    this.target = target;
    this.id = crypto.randomUUID();

    if (boxes)
    {
      Connection.#initialize(this, boxes);
    }
  }

  /**
   * Obter o papel do objeto em uma conexão.
   * 
   * O objeto precisa ter uma propriedade 'id'.
   * 
   * @param {Connection} connection 
   * @param {Object} object 
   * 
   * @returns {ConnectionRole} O papel do objeto na conexão.
   */
  static role(connection, object)
  {
    if (connection.origin.id === object.id)
    {
      return ConnectionRole.origin;
    }

    if (connection.target.id === object.id)
    {
      return ConnectionRole.target;
    }

    return ConnectionRole.none;
  }

  /**
   * Remover todas as conexões em que os participantes são os argumentos passados.
   * 
   * @param {Connection} connections 
   * @param {String} lhsId 
   * @param {String} rhsId 
   */
  static removeConnectionsByTipsId(connections, lhsId, rhsId)
  {
    let i = 0;
    while(i < connections.length)
    {
      const connection = connections[i];

      if ((connection.origin.id === lhsId || connection.origin.id === rhsId) &&
            (connection.target.id === lhsId ||  connection.target.id === rhsId))
      {
        connections.splice(i, 1);
        continue;
      }
      ++i;
    }
  }

  /**
   * Remover todas as conexões cujo pelo menos um dos participantes é o do argumento passado.
   * 
   * @param {Connection} connections 
   * @param {String} id 
   */
  static removeConnectionsById(connections, id)
  {
    let i = 0;
    while(i < connections.length)
    {
      const connection = connections[i];

      if (connection.origin.id === id || connection.target.id === id)
      {
        connections.splice(i, 1);
        continue;
      }
      ++i;
    }
  }

  /**
   * Atualizar todas as conexões em que o objeto participa. 
   * 
   * Atualizar significa que a posição da conexão no canvas é definida para a posição esperada conforme a posição da figura e a porcentagem de perímetro associada a essa conexão. 
   * 
   * Toda invocação recalcula todas as posições mesmo que a conexão já estivesse na posição correta, o que pode afetar a performance.
   * 
   * @param {Connection[]} connections 
   * @param {*} object 
   */
  static updateConnections (connections, object) {
    const boundingBox = CanvasDetails.getBoundingBox(object.canvas);

    connections.forEach(connection => {
      switch(Connection.role(connection, object))
      {
        case ConnectionRole.origin: {
          Connection.updateStart(connection, boundingBox);
          break;
        }
        case ConnectionRole.target: {
          Connection.updateEnd(connection, boundingBox);
          break;
        }
        case ConnectionRole.none: {
          throw Error('Invalid role');
        }
      }
    });
  }

  /**
   * Atualizar a posição inicial de uma conexão.
   * 
   * Atualizar significa que a posição do vértice no canvas é definida para a posição esperada conforme a posição da figura e a porcentagem de perímetro associada a essa conexão. 
   * 
   * Toda invocação recalcula todas as posições mesmo que a conexão já estivesse na posição correta, o que pode afetar a performance.
   * 
   * @param {Connection} connection 
   * @param {Rect} boundingBox 
   */
  static updateStart(connection, boundingBox)
  {
    if (connection.segments.length)
    {
      const point = Connection.getVertexFromPerimeterOffset(boundingBox, connection.origin.perimeterOffset);
      connection.segments[0].start = point;
    }
  }

  /**
   * Atualizar a posição final de uma conexão.
   * 
   * Atualizar significa que a posição do vértice no canvas é definida para a posição esperada conforme a posição da figura e a porcentagem de perímetro associada a essa conexão. 
   * 
   * Toda invocação recalcula todas as posições mesmo que a conexão já estivesse na posição correta, o que pode afetar a performance.
   * 
   * @param {Connection} connection 
   * @param {Rect} boundingBox 
   */
  static updateEnd(connection, boundingBox)
  {
    if (connection.segments.length)
    {
      const point = Connection.getVertexFromPerimeterOffset(boundingBox, connection.target.perimeterOffset);
      connection.segments[0].end = point;
    }
  }

  /**
   * Atualizar a posição inicial de uma conexão para corresponder a melhor posição possível a partir da nova posição sugerida como argumento.
   * 
   * Atualizar significa que a posição do vértice no canvas é definida para a posição esperada conforme a posição da figura e a porcentagem de perímetro associada a essa conexão. 
   * 
   * A melhor posição é aquela que o segmento tem a mesma direção que teria caso o vértice inicial fosse o sugerido, contudo o vértice inicial necessariamente pertence ao perímetro do boundingBox e o segmento tem o menor comprimento possível.
   * 
   * @param {Connection} connection 
   * @param {Vertex} position A proposta de nova posição, que não necessariamente é a melhor.
   * @param {Rect} boundingBox 
   */
  static updateStartByPosition(connection, position, boundingBox)
  {
    if (connection.segments.length)
    {
      const point = Connection.getNearestPerimeterPointByEnd(boundingBox, new Segment(position, connection.segments[0].end));

      if (!point)
      {
        return;
      }

      const perimeter = Connection.getPerimeterOffsetFromVertex(boundingBox, point);

      connection.origin.perimeterOffset = perimeter;
      connection.segments[0].start = point;
    }
  }

  /**
   * Atualizar a posição final de uma conexão para corresponder a melhor posição possível a partir da nova posição sugerida como argumento.
   * 
   * Atualizar significa que a posição do vértice no canvas é definida para a posição esperada conforme a posição da figura e a porcentagem de perímetro associada a essa conexão. 
   * 
   * A melhor posição é aquela que o segmento tem a mesma direção que teria caso o vértice final fosse o sugerido, contudo o vértice final necessariamente pertence ao perímetro do boundingBox e o segmento tem o menor comprimento possível.
   * 
   * @param {Connection} connection 
   * @param {Vertex} position 
   * @param {Rect} boundingBox 
   */
  static updateEndByPosition(connection, position, boundingBox)
  {
    if (connection.segments.length)
    {
      const point = Connection.getNearestPerimeterPointByStart(boundingBox, new Segment(connection.segments[0].start, position));

      if (!point)
      {
        return;
      }
      
      const perimeter = Connection.getPerimeterOffsetFromVertex(boundingBox, point);

      connection.target.perimeterOffset = perimeter;
      connection.segments[0].end = point;
    }
  }

  /**
   * Obter um vértice que pertence ao perímetro da figura e que pertence ao segmento passado como argumento.
   * 
   * O vértice obtido é aquele cujo segmento que o tem como vértice final e tem como vértice inicial o mesmo que o passado como argumento tem o menor comprimento.
   * 
   * Se o segmento não tiver intersecção com o retângulo, null é retornado.
   * 
   * @param {Rect} box 
   * @param {Segment} segment 
   * @returns {Vertex | null}
   */
  static getNearestPerimeterPointByStart(box, segment)
  {
    const intersections = Connection.getIntersections(box, segment);

    if (!intersections.length)
    {
      return null;
    }

    const startVertex = [segment.start.x, segment.start.y];

    const best = intersections.reduce((best, current) => {
      const bestVectorPosition = [
        best[0] - startVertex[0], 
        best[1] - startVertex[1]
      ]
      const currentVectorPosition = [
        current[0] - startVertex[0], 
        current[1] - startVertex[1]
      ];

      if (math.norm(currentVectorPosition) < math.norm(bestVectorPosition))
      {
        return current;
      }

      return best;
    });
    
    return new Vertex(best[0], best[1]);
  }

  /**
   * Obter um vértice que pertence ao perímetro da figura e que pertence ao segmento passado como argumento.
   * 
   * O vértice obtido é aquele cujo segmento que o tem como vértice inicial e tem como vértice final o mesmo que o passado como argumento tem o menor comprimento.
   * 
   * Se o segmento não tiver intersecção com o retângulo, null é retornado.
   * 
   * @param {Rect} box 
   * @param {Segment} segment 
   * @returns {Vertex | null}
   */
  static getNearestPerimeterPointByEnd(box, segment)
  {
    const intersections = Connection.getIntersections(box, segment);

    if (!intersections.length)
    {
      return null;
    }

    const endVertex = [segment.end.x, segment.end.y];

    const best = intersections.reduce((best, current) => {
      const bestVectorPosition = [
        endVertex[0] - best[0], 
        endVertex[1] - best[1] 
      ]
      const currentVectorPosition = [
        endVertex[0] - current[0], 
        endVertex[1] - current[1]
      ];

      if (math.norm(currentVectorPosition) < math.norm(bestVectorPosition))
      {
        return current;
      }

      return best;
    });
    
    return new Vertex(best[0], best[1]);
  }

  /**
   * Obter as intersecções entre uma caixa e um segmento de reta.
   * 
   * Uma intersecção é um Array cujo elementos são as posições x,y de um vértice. Assim, é retornado um Array de intersecções.
   * 
   * @param {Rect} box 
   * @param {Segment} segment 
   * @returns {Number[][]}
   */
  static getIntersections(box, segment)
  {
    const top = new Segment(Rect.getV1(box), Rect.getV2(box));
    const right = new Segment(Rect.getV2(box), Rect.getV3(box));
    const bottom = new Segment(Rect.getV3(box), Rect.getV4(box));
    const left = new Segment(Rect.getV4(box), Rect.getV1(box));

    const topintersection = Connection.#getIntersection(segment, top);
    const rightIntersection = Connection.#getIntersection(segment, right);
    const bottomIntersection = Connection.#getIntersection(segment, bottom);
    const leftIntersection = Connection.#getIntersection(segment, left);

    const intersections = [];

    if (topintersection)
    {
      intersections.push(topintersection);
    }

    if (rightIntersection)
    {
      intersections.push(rightIntersection);
    }

    if (bottomIntersection)
    {
      intersections.push(bottomIntersection);
    }

    if (leftIntersection)
    {
      intersections.push(leftIntersection);
    }

    return intersections;
  }

  /**
   * Obter a quantidade de perímetro associada a um vértice que pertence ao perímetro do retângulo.
   * 
   * Se o vértice não pertence ao perímetro, o resultado é não-especificado (unspecified).
   * 
   * @param {Rect} box 
   * @param {Vertex} vertex 
   * @returns {Number}
   */
  static getPerimeterOffsetFromVertex(box, vertex)
  {
    let position = new Vertex(box.x, box.y);
    let traveled = 0;

    if (Vertex.equals(position, vertex))
    {
      return traveled;
    }

    const perimeter = Connection.#getBoxPerimeter(box);

    if (position.y === vertex.y)
    {
      traveled += vertex.x - position.x;
      return traveled/perimeter;
    }

    traveled += box.w;
    position.x += box.w;
    
    if (position.x === vertex.x)
    {
      traveled += vertex.y - position.y;
      return traveled/perimeter;
    }

    traveled += box.h;
    position.y += box.h;

    if (position.y === vertex.y)
    {
      traveled += position.x - vertex.x;
      return traveled/perimeter;
    }

    traveled += box.w;
    position.x -= box.w;

    traveled += position.y - vertex.y;
    return traveled/perimeter;
  }

  /**
   * Obter um vértice que pertence ao perímetro do retângulo a partir do seu perimterOffset nesse retângulo.
   * 
   * @param {Rect} box 
   * @param {Number} perimeterOffset  Número no intervalo [0,1]
   * @returns {Vertex}
   */
  static getVertexFromPerimeterOffset(box, perimeterOffset)
  {
    let position = new Vertex(box.x, box.y);

    if (perimeterOffset <= 0 || perimeterOffset >= 1)
    {
      return position;
    }

    const perimeter = Connection.#getBoxPerimeter(box);
    const target = perimeter * perimeterOffset;
    let traveled = 0;

    if (target <= box.w)
    {
      position.x += target;
      return position;
    }

    traveled += box.w;
    position.x += box.w;
    
    if (target <= box.w + box.h)
    {
      position.y += target - traveled;
      return position;
    }

    traveled += box.h;
    position.y += box.h;

    if (target <= 2 * box.w + box.h)
    {
      position.x -= target - traveled;
      return position;
    }

    traveled += box.w;
    position.x -= box.w;

    position.y -= target - traveled;
    return position;
  } 

  /**
   * Inicializar uma conexão. 
   * 
   * Inicializar significa que as posições dos vértices da conexão serão computados apartir do perimeterOffset e os seus segmentos serão definidos.
   * 
   * @param {Connection} connection 
   * @param {Rect[]} boxes 
   */
  static #initialize(connection, boxes)
  {
    const startVertex = Connection.getVertexFromPerimeterOffset(boxes[0], connection.origin.perimeterOffset);
    const endVertex = Connection.getVertexFromPerimeterOffset(boxes[1], connection.target.perimeterOffset);

    connection.segments = [new Segment(startVertex, endVertex)];
  }

  /**
   * Obter a intersecção entre dois segmentos, se alguma.
   * 
   * Se não houver intersecção, null é retornado.
   * 
   * @param {Segment} lhs 
   * @param {Segment} rhs 
   * @returns {Number[] | null}
   */
  static #getIntersection(lhs, rhs)
  {
    const result = checkIntersection(
      lhs.start.x, lhs.start.y, lhs.end.x, lhs.end.y,
      rhs.start.x, rhs.start.y, rhs.end.x, rhs.end.y
    );

    if (result.type === 'intersecting')
    {
      return [result.point.x, result.point.y];
    }

    return null;
  }

  /**
   * Obter o perímetro de um retângulo.
   * 
   * @param {Rect} box 
   * @returns {Number} O perímetro
   */
  static #getBoxPerimeter(box)
  {
    return box.w * 2 + box.h * 2;
  }

  name;
  segments = [];
  origin;
  target;
}