import React, { useState } from "react";
import "./_ClassifiedItem.scss";
const ClassifiedItem = props => {
  const { title, content, date } = props.children;
  const localDate = new Date(date).toLocaleString();
  const [clicked, setClick] = useState(false);

  return (
    <li className="classifieds__item">
      <article className="article">
        <div
          className={`article__title-wrapper${
            clicked ? " article__title-wrapper--active" : ""
          }`}
          onClick={e => {
            setClick(!clicked);
          }}
        >
          <h1 className="article__title">{title}</h1>
          <span
            className={`article__show${
              clicked ? " article__show--active" : ""
            }`}
          ></span>
        </div>
        <div
          className={`article__content-container${
            clicked ? " article__content-container--active" : ""
          }`}
        >
          <p
            className={`article__published${
              clicked ? " article__published--show" : ""
            }`}
          >
            Dodano: {localDate}
          </p>
          <div
            className={`article__content${
              clicked ? " article__content--show" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </article>
    </li>
  );
};

export default ClassifiedItem;
