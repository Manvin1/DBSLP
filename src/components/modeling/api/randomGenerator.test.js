import { getRandomAnimal } from "./randomGenerator";

describe('a função getRandomAnimal', () => {
  it('deve gerar um nome', ()=>{
    expect(typeof getRandomAnimal())
      .toBe("string");
  })});