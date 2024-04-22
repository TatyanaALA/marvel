import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelServices';
import './charList.scss';

import PropTypes from 'prop-types';

const CharList = (props) => {

  const [charList, setCharList] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRequest = (offset) => {
    onCharListLoading();
    marvelService.getAllCharacters(offset)
        .then(onCharListLoaded)
        .catch(onError)
  }

  const onCharListLoading = () => {
    setNewItemLoading(true);
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    
    setCharList(charList => [...charList, ...newCharList]);
    setloading(false);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  }

  const onError = () => {
    setloading(false);
    setError(true);
  }

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  function renderItems(arr) {
    const items = arr.map((item, i)=> {
      let imgStyle = {'objectFit' : 'cover'};
      if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
          imgStyle = {'objectFit' : 'contain'};
      }

      return (
        <li className="char__item"
            tabIndex={0}
            ref={el => itemRefs.current[i] = el}
            key={item.id}
            onClick={() => {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }}>
          <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
          <div className="char__name">{item.name}</div>
        </li>
    )
  });

    return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
          <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
            <div className="inner">load more</div>
          </button>
      </div>
    )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;