import ErrorState from './ErrorState';
import LoadingState from './LoadingState';
import ReadyState from './ReadyState';

/**
 * Componente que renderiza um componente descendente específico a depender do estado passado como atributo.
 * 
 * É usado em conjunto com {@link ErrorState}, {@link LoadingState} e {@link ReadyState}
 */
function LoadingAware({children, state}) {
  return (
    state === 'loading'? (
      children.find(element => element.type === LoadingState)
    ) : state === 'ready'? (
      children.find(element => element.type === ReadyState)
    ) : state === 'error'? (
      children.find(element => element.type === ErrorState)
    ) : undefined
  );
}

export default LoadingAware