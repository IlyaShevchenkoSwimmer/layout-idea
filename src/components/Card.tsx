import { useCallback, useEffect, useRef } from "react";
import "./Card.css";

interface ImageCoords {
  id: number;
  col: number;
  row: number;
  lastX: number;
  lastY: number;
  newX: number;
  newY: number;
  centerX: number;
  centerY: number;
}

interface CardProps {
  cols: number;
  rows: number;
}

function Card(props: CardProps) {
  const imgRef = useRef(null);
  let dragImg: number = 0;
  let leftDif: number = 0;
  let topDif: number = 0;

  const coordsArr: ImageCoords[] = [];

  const media = [];

  const cols = props.cols;

  const rows = props.rows;

  const collageNum: number = cols * rows;

  for (let i = 0; i < collageNum; i++) {
    const col: number = (i % cols) + 1;
    const row: number = Math.floor(i / cols) + 1;
    media.push(
      <div
        className={`w-40 h-40 rounded-2xl p-2 relative`}
        style={{
          gridColumnStart: `${col}`,
          gridRowStart: `${row}`,
        }}
        ref={imgRef}
        key={i}
        id={`img-div${i}`}
      >
        <img
          className="object-cover w-36 h-36 rounded-2xl cursor-grab"
          src={`./images/${i + 1}.jpeg`}
          alt="card-img"
          draggable="false"
          id={`img${i}`}
        />
      </div>
    );
    coordsArr.push({
      id: i,
      col: col,
      row: row,
      lastX: 0,
      lastY: 0,
      newX: 0,
      newY: 0,
      centerX: 0,
      centerY: 0,
    });
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
      leftDif =
        (event as MouseEvent).clientX -
        (image as HTMLElement).clientLeft +
        (dragImg % cols) * (image as HTMLElement).offsetWidth;
      topDif =
        (event as MouseEvent).clientY -
        (image as HTMLElement).clientTop +
        Math.floor(dragImg / cols) * (image as HTMLElement).offsetHeight;
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
      console.log((image as HTMLElement).offsetLeft);
      console.log(leftDif);
      coordsArr.forEach((img, index) => {
        if (index === dragImg) {
          return;
        }
        if (
          img.centerX - 20 < coordsArr[dragImg].centerX &&
          img.centerX + 20 > coordsArr[dragImg].centerX
        ) {
          if (
            img.centerY - 20 < coordsArr[dragImg].centerY &&
            img.centerY + 20 > coordsArr[dragImg].centerY
          ) {
            const newCol: number = coordsArr[dragImg].col;
            coordsArr[dragImg].col = img.col;
            img.col = newCol;
            const newRow: number = coordsArr[dragImg].row;
            coordsArr[dragImg].row = img.row;
            img.row = newRow;
            const intersectedImg = document.querySelector(`#img-div${img.id}`);
            (
              intersectedImg as HTMLElement
            ).style.gridColumnStart = `${img.col}`;
            (
              image as HTMLElement
            ).style.gridColumnStart = `${coordsArr[dragImg].col}`;
            (
              image as HTMLElement
            ).style.gridRowStart = `${coordsArr[dragImg].row}`;
            (intersectedImg as HTMLElement).style.gridRowStart = `${img.row}`;
            (intersectedImg as HTMLElement).style.left = `0`;
            (intersectedImg as HTMLElement).style.top = `0`;
            leftDif =
              (event as MouseEvent).clientX -
              (image as HTMLElement).clientLeft +
              (dragImg % cols) * (image as HTMLElement).offsetWidth;
          }
        }
      });
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
      coordsArr[dragImg].col.toString();
    (image as HTMLElement).style.gridRowStart =
      coordsArr[dragImg].row.toString();
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

  return (
    <article
      className={`bg-teal-400/40 rounded-2xl relative grid`}
      style={{
        gridTemplateColumns: cols.toString(),
        gridTemplateRows: rows.toString(),
      }}
      id="card"
    >
      {media}
    </article>
  );
}

export default Card;
