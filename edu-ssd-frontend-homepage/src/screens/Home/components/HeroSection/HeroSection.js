import React from "react";
import "./HeroSection.scss";

const HeroSection = () => {
  return (
    <div>
      <div id="carouselExample" className="carousel slide">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide-to="4"
            aria-label="Slide 5"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide-to="5"
            aria-label="Slide 6"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="./Assets/SchoolBg1.png"
              className="d-block w-100"
              alt="Slide 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src="./Assets/SchoolBg2.png"
              className="d-block w-100"
              alt="Slide 2"
            />
          </div>
          <div className="carousel-item ">
            <img
              src="./Assets/SchoolBg3.png"
              className="d-block w-100"
              alt="Slide 3"
            />
          </div>
          <div className="carousel-item">
            <img
              src="./Assets/SchoolBg4.png"
              className="d-block w-100"
              alt="Slide 4"
            />
          </div>
          <div className="carousel-item">
            <img
              src="./Assets/SchoolBg5.png"
              className="d-block w-100"
              alt="Slide 5"
            />
          </div>
          <div className="carousel-item">
            <img
              src="./Assets/SchoolBg6.png"
              className="d-block w-100"
              alt="Slide 6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
