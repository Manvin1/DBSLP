import { getAllCombinations, getCombinations, getKeyFromRotules, getKeyFromValues, getValuesAssociation, isEquals, removeDuplicates, rotule } from "./combinations";

describe('a função isEquals', () => {
  
  it('deve distinguir tipos primitivos', () => {
    expect(isEquals(1, 1))
      .toBeTruthy();
    expect(isEquals('', ''))
      .toBeTruthy();
    expect(isEquals(null, null))
      .toBeTruthy();

    expect(isEquals(1, 2))
      .toBeFalsy();
    expect(isEquals('empty', 'nonEmpty'))
      .toBeFalsy();
    expect(isEquals(null, undefined))
      .toBeFalsy();
  });

  it('deve distinguir objetos/não-primitivos', () => {
    expect(isEquals({}, {}))
      .toBeTruthy();
    expect(isEquals({key:'1'}, {key:'1'}))
      .toBeTruthy();
    expect(isEquals([], []))
      .toBeTruthy();
    expect(isEquals([1], [1]))
      .toBeTruthy();
    expect(isEquals([[1]], [[1]]))
      .toBeTruthy();
    expect(isEquals([{}], [{}]))
      .toBeTruthy();

    expect(isEquals({key:'1'}, {key:'2'}))
      .toBeFalsy();
    expect(isEquals([], [1]))
      .toBeFalsy();
    expect(isEquals(null, {}))
      .toBeFalsy();
  });
});

describe('a função removeDuplicates', () => {

  it('deve remover duplicatas',()=>{

    expect(isEquals(removeDuplicates([1, 1, 2, 2, 3, 4, 4]), [1,2,3,4]))
      .toBeTruthy();

    expect(isEquals(removeDuplicates([{}, {}]), [{}]))
      .toBeTruthy();

    expect(isEquals(removeDuplicates([1, 2, 3]), [1,2,3]))
      .toBeTruthy();
  })
});

describe('a função getCombinations', () => {

  it('deve retornar as combinações',()=>{
    const arg1 = ['A', 'B'];
    const arg2 = ['A', 'B', 'C'];

    const expected1 = [[ [ 'A' ], 'B' ], [ [ 'B' ], 'A' ]];
    const expected2 = [ [ [ 'A', 'B' ], 'C' ], [ [ 'A', 'C' ], 'B' ], [ [ 'B', 'C' ], 'A' ] ];
    
    const result1 = getCombinations(arg1);
    const result2 = getCombinations(arg2);

    expect(isEquals(result1, expected1))
      .toBeTruthy();

    expect(isEquals(result2, expected2))
      .toBeTruthy();
  })
});

describe('a função getAllCombinations', () => {

  it('deve retornar todas as combinações',()=>{
    const arg1 = ['A', 'B'];
    const arg2 =  ['A', 'B', 'C', 'D'];

    const expected1 = [[ [ 'A' ], 'B' ], [ [ 'B' ], 'A' ]];
    const expected2 = [ [ [ 'A' ], 'B' ], [ [ 'B' ], 'A' ], [ [ 'A' ], 'C' ], [ [ 'C' ], 'A' ], [ [ 'B' ], 'C' ], [ [ 'C' ], 'B' ], [ [ 'A', 'B' ], 'C' ], [ [ 'A', 'C' ], 'B' ], [ [ 'B', 'C' ], 'A' ], [ [ 'A' ], 'D' ], [ [ 'D' ], 'A' ], [ [ 'B' ], 'D' ], [ [ 'D' ], 'B' ], [ [ 'A', 'B' ], 'D' ], [ [ 'A', 'D' ], 'B' ], [ [ 'B', 'D' ], 'A' ], [ [ 'C' ], 'D' ], [ [ 'D' ], 'C' ], [ [ 'A', 'C' ], 'D' ], [ [ 'A', 'D' ], 'C' ], [ [ 'C', 'D' ], 'A' ], [ [ 'B', 'C' ], 'D' ], [ [ 'B', 'D' ], 'C' ], [ [ 'C', 'D' ], 'B' ], [ [ 'A', 'B', 'C' ], 'D' ], [ [ 'A', 'B', 'D' ], 'C' ], [ [ 'A', 'C', 'D' ], 'B' ], [ [ 'B', 'C', 'D' ], 'A' ] ];
    
    const result1 = getAllCombinations(arg1);
    const result2 = getAllCombinations(arg2);

    expect(isEquals(result1, expected1))
      .toBeTruthy();

    expect(isEquals(result2, expected2))
      .toBeTruthy();
  })
});

describe('a função rotule', () => {
  it('deve rotular os elementos', ()=>{
    const labels = ['a', 'b', 'c'];
    const arr1 = [1, 2, 3];

    const result1 = rotule(arr1, labels);

    result1.forEach((result,index) => {
      expect(result.value === arr1[index])
        .toBeTruthy();
      expect(result.rotule === labels[index])
        .toBeTruthy();
    });
  })
});

describe('a função getKeyFromRotules', () => {
  it('deve retornar uma chave a partir do rotulo de um objeto', ()=>{
    expect('A' === getKeyFromRotules({value: 1, rotule:'A'}))
      .toBeTruthy();
  })

  it('deve retornar uma chave a partir dos rotulos dos elementos de um array de objetos', ()=>{
    expect('A, B' === getKeyFromRotules([
        {value: 1, rotule:'A'}, 
        {value: 2, rotule:'B'}
      ])
    )
      .toBeTruthy();
  })
});

describe('a função getKeyFromValues', () => {
  it('deve retornar uma chave a partir do valor de um objeto', ()=>{
    expect('1' === getKeyFromValues({value: 1, rotule:'A'}))
      .toBeTruthy();
  })

  it('deve retornar uma chave a partir dos valores dos elementos de um array de objetos', ()=>{
    expect('1, 2' === getKeyFromValues([
        {value: 1, rotule:'A'}, 
        {value: 2, rotule:'B'}
      ])
    )
      .toBeTruthy();
  })
});

describe('a função getValuesAssociation', () => {
  it('deve associar os valores das linhas', ()=>{
    const result = getValuesAssociation(['A', 'B'], [ [1, 2], [1, 2] ]);
    const expected = new Map(
      [
        ['A', new Map([['1', new Map([['B', new Map([[2, 2], ['__total', 2]])]])]])], 
        ['B', new Map([['2', new Map([['A', new Map([[1, 2], ['__total', 2]])]])]])]
      ]
    );

    expect(isEquals(result, expected))
      .toBeTruthy();

  })
});


