import React from "react";
import "./ClassifiedItem.scss";
const ClassifiedItem = props => {
  const { title, content, date } = props.children;
  const localDate = new Date(date).toLocaleString();

  return (
    <li className="classifieds__item">
      <article className="article">
        <div
          className="article__title-wrapper"
          onClick={e => {
            e.currentTarget.nextElementSibling.classList.toggle(
              "article__content-container--active"
            );
            e.currentTarget.lastChild.textContent =
              e.currentTarget.lastChild.textContent === "+" ? "-" : "+";
          }}
        >
          <h1 className="article__title">{title}</h1>
          <span className="article__show">+</span>
        </div>
        <div className="article__content-container">
          <p className="article__published">Dodano: {localDate}</p>
          <div
            className="article__content"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </article>
    </li>
  );
};

export default ClassifiedItem;
