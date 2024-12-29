import React from "react";
import "./Gallery.scss";
const GallerySection = () => {
  return (
    <div class="container pt-5"id="gallery_section">
      <div class=" galleryHeading text-center mb-4 ">
        <h1>Our Gallery</h1>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image1.svg" alt="Image 1" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image2.svg" alt="Image 2" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image3.svg" alt="Image 3" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image4.svg" alt="Image 4" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image5.svg" alt="Image 5" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image6.svg" alt="Image 6" class="img-fluid" />
          </div>
        </div>
      </div>
      {/* <div class="row">
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image4.svg" alt="Image 4" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image5.svg" alt="Image 5" class="img-fluid" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="gallery-item">
            <img src="/images/image6.svg" alt="Image 6" class="img-fluid" />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default GallerySection;
