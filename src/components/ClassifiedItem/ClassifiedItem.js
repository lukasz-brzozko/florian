import React, { useState, useMemo, useRef, useEffect } from "react";
import DiffMatchPatch from "diff-match-patch";
import "./_ClassifiedItem.scss";
import "../../common/Label/Label";
import Label from "../../common/Label/Label";
import AccordionContext from "../../common/contexts";

const ClassifiedItem = (props) => {
  const {
    title,
    content,
    date,
    updateDate,
    updatedContent,
    updatedTitle,
  } = props.children;

  const [isNewArtLblVis, setNewArtLblVis] = useState(false);
  const [localEditDate, setLocalEditDate] = useState(null);

  const pubDate = new Date(date);
  const localDate = pubDate.toLocaleString();
  const articleContent = useRef(content);

  const getDifferTimeFromNow = (eventTime) => {
    const now = new Date();
    const milisecondsDiffer = now.getTime() - eventTime.getTime();
    const daysDiffer = Math.floor(milisecondsDiffer / 1000 / 60 / 60 / 24);
    return daysDiffer;
  };

  useEffect(() => {
    if (updateDate) {
      const editDate = new Date(updateDate);
      setLocalEditDate(editDate.toLocaleString());
    }
  }, [updateDate]);

  useEffect(() => {
    const daysDiffer = getDifferTimeFromNow(pubDate);

    if (daysDiffer < 2) {
      setNewArtLblVis(true);
    }
  }, [pubDate]);

  useMemo(() => {
    if (updatedContent) {
      const dmp = new DiffMatchPatch();
      const diff = dmp.diff_main(content, updatedContent);
      let newContent = "";
      diff.forEach((el) => {
        if (el[0] === -1) {
          newContent += `<del>${el[1]}</del>`;
        } else if (el[0] === 1) {
          newContent += `<ins">${el[1]}</ins>`;
        } else {
          newContent += el[1];
        }
      });

      articleContent.current = newContent;
    }
  }, [content, updatedContent]);

  return (
    <AccordionContext.Consumer>
      {({ activePost, togglePost }) => (
        <li className="classifieds__item">
          <article className="article">
            <div
              className={`article__title-wrapper${
                activePost === props.id ? " article__title-wrapper--active" : ""
              }`}
              onClick={(e) => {
                togglePost(props.id);
              }}
            >
              <h1 className="article__title">{updatedTitle || title}</h1>
              <div className="article__icons-container">
                {isNewArtLblVis && (
                  <Label
                    type="new"
                    title="Nowe ogłoszenie"
                    mobileText="N"
                    desktopText="Nowe"
                  />
                )}
                {updateDate && (
                  <Label
                    type="update"
                    title="Ogłoszenie edytowane"
                    mobileText="E"
                    desktopText="Edytowane"
                  />
                )}
                <span
                  className={`article__show${
                    activePost === props.id ? " article__show--active" : ""
                  }`}
                ></span>
              </div>
            </div>
            <div
              className={`article__content-container${
                activePost === props.id
                  ? " article__content-container--active"
                  : ""
              }`}
            >
              <p
                className={`article__published${
                  activePost === props.id ? " article__published--show" : ""
                }`}
              >
                Dodano: {localDate}
                {localEditDate && (
                  <span className="article__updated">
                    Edytowano: {localEditDate}
                  </span>
                )}
              </p>
              <div
                className={`article__content${
                  activePost === props.id ? " article__content--show" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: articleContent.current }}
              ></div>
            </div>
          </article>
        </li>
      )}
    </AccordionContext.Consumer>
  );
};

export default ClassifiedItem;
