import React, { useEffect } from 'react';
import CartItem from './CartItem';
import axios from 'axios';
import cat from '../images/catGif.gif';
import catError from '../images/catError.gif';
import bookLogo from '../images/bookLogo.png';
import '../scss/styles.scss';
import { useSelector, useDispatch } from 'react-redux';

import {
  setLoading,
  setError,
  setErrorText,
  setCounterPagination,
  setBook,
  setValue,
} from '../redux/requestSlices/requestSlices';

const Header = () => {
  const {
    loading,
    error,
    errorText,
    counterPagination,
    value,
    book,
  } = useSelector((state) => state.requestSlices);
  const dispatch = useDispatch();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      searchBook();
    }
  };

  useEffect(() => {
    if (counterPagination !== 8) {
      searchBook();
    }
  }, [counterPagination]);

  const searchBook = async () => {
    dispatch(setLoading());
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${value}&${process.env.REACT_APP_key}&maxResults=40`
      );
      const items = response.data.items || [];
      const filteredItems = items.filter(
        (item) =>
          item.volumeInfo.imageLinks &&
          item.volumeInfo.authors &&
          item.volumeInfo.description
      ).slice(0, counterPagination);
      dispatch(setBook(filteredItems));
    } catch (err) {
      dispatch(setErrorText('Произошла ошибка... ' + err));
      dispatch(setError());
      dispatch(setValue(''));
      setTimeout(() => {
        dispatch(setError());
      }, 5000);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="header">
      {book.length > 0 && (
        <a href="/" onClick={() => dispatch(setLoading())} className=" ">
          <img className="book__logo" src={bookLogo} alt="" />
        </a>
      )}
      <div className="container">
        <div className={book.length > 0 ? 'header__top' : 'header__center'}>
          <div className="input__wrapper">
            <button
              className={value ? 'icon-clear block' : 'icon-clear none'}
              onClick={() => dispatch(setValue(''))}
            >
              ╳
            </button>
            <input
              className="search__input"
              type="text"
              placeholder="Введите название книги..."
              value={value}
              maxLength={20}
              onChange={(e) => dispatch(setValue(e.target.value))}
              onKeyPress={handleKeyPress}
            />
            <button
              className="search__button"
              onClick={searchBook}
              disabled={!value.trim()}
            >
              Поиск
            </button>
          </div>
        </div>

        <div className={book.length > 0 ? 'cart' : ''}>
          {loading ? (
            <img className="center" src={cat} alt="Loading..." />
          ) : error ? (
            <div className="error__wrapper">
              <img className="error__image" src={catError} alt="Error" />
              <p className="text__error">{errorText}</p>
            </div>
          ) : null}
          <div className="cart__inner">
            <CartItem book={book} />
          </div>
          {book.length > 0 && (
            <button
              className="more__button"
              onClick={() => dispatch(setCounterPagination())}
            >
              еще
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
