import React from "react";
import "./AboutUs.scss";
function AboutUs() {
  return (
    <div id="about_us" className="aboutUs-bg">
      <div class="container pt-5">
        <div class="row">
          <div class="col-md-6">
            <div class="aboutUs-column">
              <div class="aboutUs">
                <h1>About school</h1>
                <p>
                  The School, ranked one of the best schools in Noida, is spread
                  across a world – class 30 acre campus with super connectivity
                  via a 6-lane expressway. It is an hour’s drive from the Indira
                  Gandhi International Airport at Delhi. Education at Genesis is
                  a journey full of opportunities and fulfilment. Whether day
                  scholars or in the boarding school GGS students are confident,
                  disciplined and critical thinkers. These qualities ensure that
                  they grow into responsible and caring adults of a global
                  society. We encourage experiential learning and create
                  opportunities for growth.{" "}
                </p>
               
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div className="about-image-section">
            <div className="image-section-one"> <img src="./Assets/directorImg.png" class="img-fluid custom-image" />
            <h6 className="heading-name">A.P. Singh</h6>
            <p>Director</p>
            </div>
            <div className="image-section-two"> <img src="./Assets/aboutUsImg.png" class="img-fluid custom-image" />
            <h6 className="heading-name">Gladwin Wray</h6>
            <p>Principal</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
