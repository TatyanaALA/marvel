import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

	const [comicsList, setcomicsList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [comicsEnded, setComicsEnded] = useState(false);

	const {loading, error, getAllComics} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicsListLoaded)
  }

	const onComicsListLoaded = (newComicsList) => {
		let ended = false;
		if (newComicsList.length < 8) {
			ended = true;
		}
		setcomicsList([...comicsList, ...newComicsList]);
		setNewItemLoading(false);
		setOffset(offset + 8);
		setComicsEnded(ended);
	}

	function renderItems (arr) {
		const items = arr.map((item, i) => {
			return (
				<li className="comics__item" key={i}>
					<Link to={`/comics/${item.id}`}>
						<img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
						<div className="comics__item-name">{item.titel}</div>
						<div className="comics__item-price">{item.price}</div>
					</Link>
			</li>
			)
		})

		return (
			<ul className="comics__grid">
				{items}
			</ul>
		)
	}

	const items = renderItems(comicsList);

	const errorMessage = error ? <ErrorMessage/> : null;
	const spinner = loading && !newItemLoading ? <Spinner/> : null;

	return (
		<div className="comics__list">
			{errorMessage}
			{spinner}
			{items}
			<button 
				disabled={newItemLoading}
				style={{'display' : comicsEnded ? 'none' : 'block'}} 
				className="button button__main button__long"
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default ComicsList;


