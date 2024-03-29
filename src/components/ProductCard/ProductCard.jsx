/* eslint-disable react/jsx-no-bind */
import {
  Suspense, memo, useState,
} from 'react';
import { Await, Link, useFetcher } from 'react-router-dom';
import classNames from 'classnames';
import useFetcherLoad from '../../hooks/useFetcherLoad.jsx';
import beautifyNum from '../../utils/beautifyNum.js';
import Spinner from '../common/Spinner/Spinner.jsx';
import DynamicImage from '../common/DynamicImage/DynamicImage.jsx';
import Button from '../common/Button/Button.jsx';
import linkCls from '../../scss/_link.module.scss';
import productCls from './ProductCard.module.scss';
import Compare from '../../assets/images/icons/compare.svg';
import Favorite from '../../assets/images/icons/favorite.svg';
import Cart from '../../assets/images/icons/cart.svg';
import Mark from '../../assets/images/icons/mark.svg';

const ProductCard = memo(({
  name, categoryId, subcategoryId, productId, price, oldPrice, isShortCard,
}) => {
  const wishlistFetcher = useFetcher();
  const cartFetcher = useFetcher();

  const [imgSrc] = useState(() => import(`../../assets/images/productImgs/${productId}.webp`));
  const [productInWishlist, setProductInWishlist] = useState(false);
  const [productInCart, setProductInCart] = useState(false);

  useFetcherLoad(wishlistFetcher, '../wishlist');

  if (wishlistFetcher.data) {
    const productInWishlistFromFetcher = wishlistFetcher
      .data.wishlistIds.find(([cId, subcId, pId]) => (
        cId === categoryId && subcId === subcategoryId && pId === productId
      ));

    if (productInWishlistFromFetcher !== productInWishlist) {
      setProductInWishlist(productInWishlistFromFetcher);
    }
  }

  useFetcherLoad(cartFetcher, '../cart');

  if (cartFetcher.data) {
    const productInCartFromFetcher = cartFetcher.data.cartIds.find((cId) => (
      cId.categoryId === categoryId
        && cId.subcategoryId === subcategoryId && cId.productId === productId
    ));

    if (productInCartFromFetcher !== productInCart) {
      setProductInCart(productInCartFromFetcher);
    }
  }

  function wishlistButtonOnClick() {
    const data = JSON.stringify([categoryId, subcategoryId, productId]);

    if (!productInWishlist) {
      wishlistFetcher.submit(data, {
        action: '../wishlist',
        method: 'PATCH',
        encType: 'application/json',
      });
    } else {
      wishlistFetcher.submit(data, {
        action: '../wishlist',
        method: 'DELETE',
        encType: 'application/json',
      });
    }
  }

  function cartButtonOnClick() {
    const data = JSON.stringify([categoryId, subcategoryId, productId]);

    if (!productInCart) {
      cartFetcher.submit(data, {
        action: '../cart',
        method: 'PATCH',
        encType: 'application/json',
      });
    } else {
      cartFetcher.submit(data, {
        action: '../cart',
        method: 'DELETE',
        encType: 'application/json',
      });
    }
  }

  const productLink = `/${categoryId}/${subcategoryId}/${productId}`;

  if (isShortCard) {
    return (
      <div className={productCls.card}>
        <div className={productCls.iconButtonsBlock}>
          <button
            type="button"
            className={productCls.iconButton}
            aria-label={`Добавить ${name} в сравнение`}
          >
            <Compare className={productCls.icon} />
          </button>
          <button
            type="button"
            className={classNames(
              productCls.iconButton,
              productInWishlist && productCls.iconButton_active,
            )}
            aria-label={productInWishlist ? `Удалить ${name} из избранного` : `Добавить ${name} в избранное`}
            onClick={wishlistButtonOnClick}
          >
            <Favorite className={productCls.icon} />
          </button>
        </div>
        <Link
          className={productCls.imageLink}
          to={productLink}
          alt={name}
        >
          <Suspense
            fallback={<Spinner className={productCls.spinner} />}
          >
            <Await resolve={imgSrc}>
              <DynamicImage
                className={productCls.image}
                alt={name}
              />
            </Await>
          </Suspense>
        </Link>
        <Link
          className={classNames(linkCls.link, productCls.textLink)}
          to={productLink}
          alt={name}
        >
          {name}
        </Link>
        <div className={productCls.priceAndCartBlock}>
          <div className={productCls.priceBlock}>
            {oldPrice && (
            <p className={productCls.oldPrice}>
              {oldPrice}
              ₴/шт
            </p>
            )}
            <p className={productCls.price}>
              {beautifyNum(price)}
              <span className={productCls.priceSpan}>₴/шт</span>
            </p>
          </div>
          <Button
            className={productCls.cartButton}
            ariaLabel={!productInCart ? `Добавить ${name} в корзину` : `Удалить ${name} из корзины`}
            onClick={cartButtonOnClick}
          >
            {!productInCart ? (
              <Cart className={productCls.cartIcon} />
            ) : (
              <Mark className={productCls.cartIcon} />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={productCls.longCard}>
      <Link
        className={productCls.longImageLink}
        to={productLink}
        alt={name}
      >
        <Suspense
          fallback={<Spinner className={productCls.spinner} />}
        >
          <Await resolve={imgSrc}>
            <DynamicImage
              className={productCls.longImage}
              alt={name}
            />
          </Await>
        </Suspense>
      </Link>
      <div className={productCls.nameAndIconButtons}>
        <Link
          className={classNames(linkCls.link, productCls.longTextLink)}
          to={productLink}
          alt={name}
        >
          {name}
        </Link>
        <div className={productCls.longIconButtonsBlock}>
          <button
            type="button"
            className={productCls.iconButton}
            aria-label={`Добавить ${name} в сравнение`}
          >
            <Compare className={productCls.icon} />
          </button>
          <button
            type="button"
            className={classNames(
              productCls.iconButton,
              productInWishlist && productCls.iconButton_active,
            )}
            aria-label={productInWishlist ? `Удалить ${name} из избранного` : `Добавить ${name} в избранное`}
            onClick={wishlistButtonOnClick}
          >
            <Favorite className={productCls.icon} />
          </button>
        </div>
      </div>
      <div className={productCls.longPriceAndCartBlock}>
        <div className={productCls.priceBlock}>
          {oldPrice && (
            <p className={productCls.oldPrice}>
              {oldPrice}
              ₴/шт
            </p>
          )}
          <p className={productCls.price}>
            {beautifyNum(price)}
            <span className={productCls.priceSpan}>₴/шт</span>
          </p>
        </div>
        <Button
          className={productCls.longCartButton}
          ariaLabel={!productInCart ? `Добавить ${name} в корзину` : `Удалить ${name} из корзины`}
          onClick={cartButtonOnClick}
        >
          {!productInCart ? 'В корзину' : 'Удалить из корзины'}
        </Button>
      </div>
    </div>
  );
});

export default ProductCard;
