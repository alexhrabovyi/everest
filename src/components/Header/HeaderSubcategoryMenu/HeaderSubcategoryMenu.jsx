import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
  memo, useRef, useEffect, useLayoutEffect,
} from 'react';
import containerCls from '../../../scss/_container.module.scss';
import subcategoryMenuCls from './HeaderSubcategoryMenu.module.scss';
import linkCls from '../../../scss/_link.module.scss';
import textCls from '../../../scss/_text.module.scss';
import Chevron from '../images/chevron.svg';
import findAllInteractiveElements from '../../../utils/findAllInteractiveElements.js';
import ArrowRight from '../images/arrow-right.svg';

const HeaderSubcategoryMenu = memo(({ isMenuOpen, category, backToCatalogOnClick }) => {
  const menuRef = useRef(null);
  const { subcategories } = category;

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const headerHeight = menu.offsetTop;
    const windowHeight = window.innerHeight;

    const maximumMenuHeight = windowHeight - headerHeight;
    const realMenuHeight = menu.scrollHeight;

    menu.style.overflowY = realMenuHeight > maximumMenuHeight && 'scroll';
    menu.style.height = `${maximumMenuHeight}px`;

    return () => {
      menu.style.height = '';
      menu.style.overflowY = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let menuElements;

    if (!isMenuOpen) {
      menuElements = findAllInteractiveElements(menuRef.current);
      menuElements.forEach((el) => {
        el.tabIndex = '-1';
        el.ariaHidden = true;
      });
    }

    return () => {
      if (!isMenuOpen) {
        menuElements.forEach((el) => {
          el.tabIndex = '';
          el.ariaHidden = false;
        });
      }
    };
  });

  useEffect(() => {
    if (isMenuOpen) menuRef.current.focus();
  }, [isMenuOpen]);

  return (
    <div
      ref={menuRef}
      className={classNames(
        containerCls.container,
        subcategoryMenuCls.menu,
        isMenuOpen && subcategoryMenuCls.menu_open,
      )}
      aria-hidden={!isMenuOpen}
      role="dialog"
      aria-modal
      aria-label={`Меню категории ${category.name}`}
      tabIndex={isMenuOpen ? '0' : '-1'}
    >
      <button
        type="button"
        className={subcategoryMenuCls.backButton}
        onClick={backToCatalogOnClick}
        aria-label="Вернуться в меню каталога"
        aria-haspopup="dialog"
      >
        <Chevron className={subcategoryMenuCls.backButtonChevron} />
        Каталог
      </button>
      <p className={classNames(
        subcategoryMenuCls.title,
        textCls.text,
        textCls.textFw800,
        textCls.text21px,
      )}
      >
        {category.name}
      </p>
      <nav className={subcategoryMenuCls.linkBlock}>
        <ul className={subcategoryMenuCls.linkList}>
          {subcategories.map((subC) => (
            <li key={subC.id}>
              <Link
                to={`${category.id}/${subC.id}`}
                className={classNames(linkCls.link, linkCls.link18px)}
                alt={subC.name}
              >
                {subC.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to={category.id} className={subcategoryMenuCls.allCategoriesLink} alt="Все категории">
              Все категории
              <ArrowRight className={subcategoryMenuCls.allCategoriesArrow} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
});

export default HeaderSubcategoryMenu;
