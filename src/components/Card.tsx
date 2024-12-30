import { useCallback, useEffect, useMemo, useRef } from "react";
import "./Card.css";

interface ImageCoords {
  id: number;
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  lastX: number;
  lastY: number;
  newX: number;
  newY: number;
  centerX: number;
  centerY: number;
  tailCSSWidth: number;
}

interface CardProps {
  cols?: number;
  rows?: number;
  imgNum?: number;
  wantedForm?: string;
}

function between(point: number, min: number, max: number): boolean {
  const first: boolean = point > min;
  const second: boolean = point < max;
  const result: boolean = first && second;
  return result;
}

function Card(props: CardProps) {
  const imgRef = useRef(null);
  let dragImg: number = 0;
  let leftDif: number = 0;
  let topDif: number = 0;

  const coordsArr: ImageCoords[] = [];

  const media = [];

  let moving: boolean = false;

  const cols = props.cols;

  const rows = props.rows;

  const wantedForm = props.wantedForm;

  const imgNum = props.imgNum;

  let collageNum: number = 0;

  if (cols && rows) {
    collageNum = cols * rows;
  }

  if (imgNum) {
    collageNum = imgNum;
  }

  for (let i = 0; i < collageNum; i++) {
    if (cols && rows) {
      const col: number = (i % cols) + 1;
      const row: number = Math.floor(i / cols) + 1;
      media.push(
        <div
          className={`rounded-2xl p-2 relative`}
          style={{
            gridColumnStart: `${col}`,
            gridRowStart: `${row}`,
          }}
          ref={imgRef}
          key={i}
          id={`img-div${i}`}
        >
          <img
            className="object-cover rounded-2xl cursor-grab"
            style={{ width: "100%", height: "100%" }}
            src={`./images/${i + 1}.jpeg`}
            alt="card-img"
            draggable="false"
            id={`img${i}`}
          />
        </div>
      );
      coordsArr.push({
        id: i,
        colStart: col,
        colEnd: col + 1,
        rowStart: row,
        rowEnd: row + 1,
        lastX: 0,
        lastY: 0,
        newX: 0,
        newY: 0,
        centerX: 0,
        centerY: 0,
        tailCSSWidth: 40,
      });
    }
    if (imgNum) {
      if (Math.floor(i / 2) % 2 === 0) {
        const colStart: number = i % 2 === 0 ? 1 : 3;
        const colEnd: number = i % 2 === 0 ? 3 : 4;
        const rowStart: number = Math.floor(i / 2) + 1;
        media.push(
          <div
            className={`rounded-2xl p-2 relative`}
            style={{
              gridColumnStart: `${colStart}`,
              gridColumnEnd: `${colEnd}`,
              gridRowStart: `${rowStart}`,
            }}
            ref={imgRef}
            key={i}
            id={`img-div${i}`}
          >
            <img
              className="object-cover rounded-2xl cursor-grab"
              style={{ width: "100%", height: "100%" }}
              src={`./images/${i + 1}.jpeg`}
              alt="card-img"
              draggable="false"
              id={`img${i}`}
            />
          </div>
        );
        coordsArr.push({
          id: i,
          colStart: colStart,
          colEnd: colEnd,
          rowStart: rowStart,
          rowEnd: rowStart + 1,
          lastX: 0,
          lastY: 0,
          newX: 0,
          newY: 0,
          centerX: 0,
          centerY: 0,
          tailCSSWidth: 40,
        });
      }
      if (Math.floor(i / 2) % 2 === 1) {
        const colStart: number = i % 2 === 0 ? 1 : 2;
        const colEnd: number = i % 2 === 0 ? 2 : 4;
        const rowStart: number = Math.floor(i / 2) + 1;
        media.push(
          <div
            className={`rounded-2xl p-2 relative`}
            style={{
              gridColumnStart: `${colStart}`,
              gridColumnEnd: `${colEnd}`,
              gridRowStart: `${rowStart}`,
            }}
            ref={imgRef}
            key={i}
            id={`img-div${i}`}
          >
            <img
              className="object-cover rounded-2xl cursor-grab"
              style={{ width: "100%", height: "100%" }}
              src={`./images/${i + 1}.jpeg`}
              alt="card-img"
              draggable="false"
              id={`img${i}`}
            />
          </div>
        );
        coordsArr.push({
          id: i,
          colStart: colStart,
          colEnd: colEnd,
          rowStart: rowStart,
          rowEnd: rowStart + 1,
          lastX: 0,
          lastY: 0,
          newX: 0,
          newY: 0,
          centerX: 0,
          centerY: 0,
          tailCSSWidth: 40,
        });
      }
    }
  }

  const mouseDown = useCallback(
    (event: Event) => {
      const element = event.target as HTMLImageElement;
      const whichImg: number = Number(element.id.slice(3));
      dragImg = whichImg;
      const image = document.querySelector(`#img-div${dragImg}`);
      for (let i = 0; i < collageNum; i++) {
        const iImg = document.querySelector(`#img-div${i}`);
        coordsArr[i] = {
          ...coordsArr[i],
          centerX:
            (iImg as HTMLElement).offsetLeft +
            (iImg as HTMLElement).offsetWidth / 2,
          centerY:
            (iImg as HTMLElement).offsetTop +
            (iImg as HTMLElement).offsetHeight / 2,
        };
      }
      coordsArr[whichImg] = {
        ...coordsArr[whichImg],
        id: whichImg,
        lastX: (event as MouseEvent).clientX,
        lastY: (event as MouseEvent).clientY,
        newX: (event as MouseEvent).clientX,
        newY: (event as MouseEvent).clientY,
      };
      (image as HTMLElement).style.zIndex = "100";
      leftDif = (event as MouseEvent).clientX;
      topDif = (event as MouseEvent).clientY;
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    },
    [dragImg]
  );
  useEffect(() => {
    if (imgRef.current) {
      const images: NodeList = document.querySelectorAll("img");
      images.forEach((image) => {
        image.addEventListener("mousedown", mouseDown);
      });
    }
  }, [dragImg]);

  const mouseMove = useCallback(
    (event: Event) => {
      const image = document.querySelector(`#img-div${dragImg}`);
      for (let img = 0; img < collageNum; img++) {
        if (img === dragImg) {
          continue;
        } else {
          if (
            between(
              coordsArr[dragImg].centerX,
              coordsArr[img].centerX - 50,
              coordsArr[img].centerX + 50
            )
          ) {
            if (
              between(
                coordsArr[dragImg].centerY,
                coordsArr[img].centerY - 50,
                coordsArr[img].centerY + 50
              )
            ) {
              if (!moving) {
                moving = true;
                const newColStart: number = coordsArr[dragImg].colStart;
                coordsArr[dragImg].colStart = coordsArr[img].colStart;
                coordsArr[img].colStart = newColStart;
                const newRowStart: number = coordsArr[dragImg].rowStart;
                coordsArr[dragImg].rowStart = coordsArr[img].rowStart;
                coordsArr[img].rowStart = newRowStart;
                const newColEnd: number = coordsArr[dragImg].colEnd;
                coordsArr[dragImg].colEnd = coordsArr[img].colEnd;
                coordsArr[img].colEnd = newColEnd;
                const newRowEnd: number = coordsArr[dragImg].rowEnd;
                coordsArr[dragImg].rowEnd = coordsArr[img].rowEnd;
                coordsArr[img].rowEnd = newRowEnd;
                const intersectedImg = document.querySelector(
                  `#img-div${coordsArr[img].id}`
                );
                (
                  intersectedImg as HTMLElement
                ).style.gridColumnStart = `${coordsArr[img].colStart}`;
                (
                  image as HTMLElement
                ).style.gridColumnStart = `${coordsArr[dragImg].colStart}`;
                (
                  intersectedImg as HTMLElement
                ).style.gridColumnEnd = `${coordsArr[img].colEnd}`;
                (
                  image as HTMLElement
                ).style.gridColumnEnd = `${coordsArr[dragImg].colEnd}`;
                (
                  image as HTMLElement
                ).style.gridRowStart = `${coordsArr[dragImg].rowStart}`;
                (
                  intersectedImg as HTMLElement
                ).style.gridRowStart = `${coordsArr[img].rowStart}`;
                (
                  image as HTMLElement
                ).style.gridRowEnd = `${coordsArr[dragImg].rowEnd}`;
                (
                  intersectedImg as HTMLElement
                ).style.gridRowEnd = `${coordsArr[img].rowEnd}`;
                let translateFrom: number =
                  ((coordsArr[dragImg].colStart - coordsArr[img].colStart) *
                    ((intersectedImg as HTMLElement).offsetWidth >
                    (image as HTMLElement).offsetWidth
                      ? (image as HTMLElement).offsetWidth
                      : (intersectedImg as HTMLElement).offsetWidth)) /
                  (coordsArr[dragImg].colEnd - coordsArr[dragImg].colStart);

                (intersectedImg as HTMLElement).animate(
                  [
                    {
                      transform: `translate(${translateFrom}px, ${
                        (coordsArr[dragImg].rowStart -
                          coordsArr[img].rowStart) *
                        (image as HTMLElement).offsetHeight
                      }px)`,
                      width: `${(image as HTMLElement).offsetWidth}px`,
                    },
                    {
                      transform: `translate(0px, 0px)`,
                      width: `${(intersectedImg as HTMLElement).offsetWidth}px`,
                    },
                  ],
                  { duration: 200 }
                );
                (image as HTMLElement).animate(
                  [
                    {
                      width: `${(intersectedImg as HTMLElement).offsetWidth}px`,
                    },
                    {
                      width: `${(image as HTMLElement).offsetWidth}px`,
                    },
                  ],
                  { duration: 200 }
                );
                setTimeout(() => {
                  moving = false;
                }, 200);
                coordsArr[img].centerX =
                  (intersectedImg as HTMLElement).offsetLeft +
                  (intersectedImg as HTMLElement).offsetWidth / 2;
                coordsArr[img].centerY =
                  (intersectedImg as HTMLElement).offsetTop +
                  (intersectedImg as HTMLElement).offsetHeight / 2;
                if (cols && rows) {
                  leftDif -=
                    (coordsArr[img].colStart - coordsArr[dragImg].colStart) *
                    (image as HTMLElement).offsetWidth;
                  topDif -=
                    (coordsArr[img].rowStart - coordsArr[dragImg].rowStart) *
                    (image as HTMLElement).offsetHeight;
                }
                if (wantedForm === "ladder") {
                  leftDif = (event as MouseEvent).clientX;

                  topDif -=
                    (coordsArr[img].rowStart - coordsArr[dragImg].rowStart) *
                    (image as HTMLElement).offsetHeight;
                }
                break;
              }
            }
          }
        }
      }

      coordsArr[dragImg] = {
        ...coordsArr[dragImg],
        newX: (event as MouseEvent).clientX,
        newY: (event as MouseEvent).clientY,
        centerX:
          (image as HTMLElement).offsetLeft +
          (image as HTMLElement).offsetWidth / 2,
        centerY:
          (image as HTMLElement).offsetTop +
          (image as HTMLElement).offsetHeight / 2,
      };
      (image as HTMLElement).style.left = `${
        coordsArr[dragImg].newX - leftDif
      }px`;
      (image as HTMLElement).style.top = `${
        coordsArr[dragImg].newY - topDif
      }px`;
    },
    [dragImg]
  );

  const mouseUp = useCallback(() => {
    const image = document.querySelector(`#img-div${dragImg}`);
    (image as HTMLElement).style.gridColumnStart =
      coordsArr[dragImg].colStart.toString();
    (image as HTMLElement).style.gridRowStart =
      coordsArr[dragImg].rowStart.toString();
    (image as HTMLElement).style.transition = "all 0.5s linear";
    (image as HTMLElement).style.top = "0";
    (image as HTMLElement).style.left = "0";
    setTimeout(() => {
      (image as HTMLElement).style.transition = "";
      (image as HTMLElement).style.zIndex = "0";
    }, 500);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  }, [dragImg]);

  const wantedRows = useMemo(() => {
    if (wantedForm === "ladder") {
      return Math.floor((imgNum as number) / 2) + ((imgNum as number) % 2);
    }
  }, []);

  return (
    <article
      className={`bg-teal-400/40 rounded-2xl relative grid`}
      style={{
        gridTemplateColumns: `repeat(${
          cols || wantedForm === "ladder" ? 3 : undefined
        }, 10rem)`,
        gridTemplateRows: `repeat(${rows || wantedRows}, 10rem)`,
      }}
      id="card"
    >
      {media}
    </article>
  );
}

export default Card;
