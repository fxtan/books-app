import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import catGif from '../images/catGif.gif';

import { useSelector, useDispatch } from 'react-redux';
import { setFullCart, setDeleteCart, setText } from '../redux/cartRendering/cartRenderingSlice';
import { setError, setErrorText, deleteInfo } from '../redux/requestSlices/requestSlices';

const FullCart = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const cart = useSelector((state) => state.cartRendering.cart);
  const text = useSelector((state) => state.cartRendering.text);
  const errorText = useSelector((state) => state.requestSlices.errorText);

  useEffect(() => {
    async function fetchCart() {
      try {
        const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        dispatch(setFullCart(data));
        dispatch(setText(data.volumeInfo.description));
      } catch (err) {
        dispatch(setError());
        dispatch(setErrorText(err.message));
      }
    }
    fetchCart();
  }, [id, dispatch]);

  if (cart.length === 0) {
    // Если cart пустой, показываем ошибку
    return (
      <div className="container">
        <div className="error__wrapper error__center">
          <img className="error__image" src={catGif} alt="" />
          <p className="text__error">{errorText}</p>
        </div>
      </div>
    );
  }

  const { volumeInfo } = cart;
  const imageSrc = volumeInfo.imageLinks?.thumbnail || 'cat';

  return (
    <div className="container">
      <div className="cart__wrapper">
        <Link to="/">
          <button
            className="close"
            onClick={() => {
              dispatch(setDeleteCart());
              dispatch(deleteInfo());
            }}
          >
            X
          </button>
        </Link>
        <div className="cart__left">
          <img className="cart__img" src={imageSrc} alt="not found" />
          <div className="cart__info">
            <p className="cart__authors">
              {volumeInfo.authors ? volumeInfo.authors.slice(0, 2).join(', ') : ''}
            </p>
            <p className="cart__title">{volumeInfo.title}</p>
            <div className="wrapper__bottom-content">
              <div className="bottom__wrapper">{/* Можно добавить содержимое тут */}</div>
            </div>
          </div>
        </div>
        <div className="cart__right">
          <h1 className="text__right">
            {text ? new DOMParser().parseFromString(text, 'text/html').body.textContent : 'Описание отсутствует :('}
          </h1>
        </div>
        <div className="wrapper__button">
          <a
            className="more__button"
            href={volumeInfo.previewLink}
            target="_blank"
            rel="noreferrer"
          >
            подробнее
          </a>
        </div>
      </div>
    </div>
  );
};

export default FullCart;
