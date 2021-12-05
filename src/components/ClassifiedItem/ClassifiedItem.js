import DiffMatchPatch from "diff-match-patch";
import React, { useEffect, useMemo, useRef, useState } from "react";

import AccordionContext from "../../common/contexts";
import "../../common/Label/Label";
import Label from "../../common/Label/Label";

import "./_ClassifiedItem.scss";

const ClassifiedItem = (props) => {
  const { title, content, date, updateDate, updatedContent, updatedTitle } =
    props.children;

  const [isNewArtLblVis, setNewArtLblVis] = useState(false);
  const [localEditDate, setLocalEditDate] = useState(null);

  const refPublished = useRef(null);
  const refArticleContent = useRef(null);

  const pubDate = new Date(date);

  const pubDay = pubDate.getDate();
  const pubMonth = pubDate.getMonth() + 1;
  const pubYear = pubDate.getFullYear();
  const pubHours = pubDate.getHours();
  const pubMinutes = pubDate.getMinutes();
  const pubSeconds = pubDate.getSeconds();

  const pad = (n) => {
    return n < 10 ? "0" + n : n;
  };

  const localDate = `${pad(pubDay)}.${pad(pubMonth)}.${pad(pubYear)}, ${pad(
    pubHours
  )}:${pad(pubMinutes)}:${pad(pubSeconds)}`;

  const articleContent = useRef(content);

  const getDifferTimeFromNow = (eventTime) => {
    const now = new Date();
    const milisecondsDiffer = now.getTime() - eventTime.getTime();
    const daysDiffer = Math.floor(milisecondsDiffer / 1000 / 60 / 60 / 24);
    return daysDiffer;
  };

  const scrollToElement = (el) => {
    const mq = window.matchMedia("(min-width: 1200px)").matches;

    if (!mq) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    if (updateDate) {
      const editDate = new Date(updateDate);
      const editDay = editDate.getDate();
      const editMonth = editDate.getMonth() + 1;
      const editYear = editDate.getFullYear();
      const editHours = editDate.getHours();
      const editMinutes = editDate.getMinutes();
      const editSeconds = editDate.getSeconds();

      const editLocalDate = `${pad(editDay)}.${pad(editMonth)}.${pad(
        editYear
      )}, ${pad(editHours)}:${pad(editMinutes)}:${pad(editSeconds)}`;

      setLocalEditDate(editLocalDate);
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
          newContent += `<ins>${el[1]}</ins>`;
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
                const parentOfTarget = e.currentTarget.parentElement;

                togglePost(props.id);
                activePost !== props.id &&
                  setTimeout(() => scrollToElement(parentOfTarget), 530);
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
              style={{
                height:
                  activePost === props.id
                    ? `${
                        refPublished.current?.clientHeight +
                        refArticleContent.current?.clientHeight +
                        30
                      }px`
                    : "0px",
              }}
            >
              <p
                className={`article__published${
                  activePost === props.id ? " article__published--show" : ""
                }`}
                ref={refPublished}
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
                ref={refArticleContent}
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
