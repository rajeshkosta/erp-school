import React from "react";
import "./Feature.scss";
const FeatureSection = () => {
  return (
    <div className="container-fluid-features" id="feature_section">
      <div className="container pt-5">
        <div className="galleryHeading text-center mb-4">
          <h1>Features for Students</h1>
        </div>
        <div className="row">
          {/* <div class="row whyLinkRow">
      <div className="col-md-4 mb-4">
          <div class="cardOne" >
            <img src="images/computerLab-icon.svg" alt="" />
            <h3>Computer Lab</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div class="cardTwo" >
            <img src="images/education-icon.svg" alt="" />
            <h3> Extra classes</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardThree" >
          <img src="images/smartclass-icon.svg" alt="" />
            <h3>Smart classes</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardFour" >
          <img src="images/projectorclass-icon.svg" alt="" />
            <h3>Projector classes</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardFive" >
          <img src="images/smartclass-icon.svg" alt="" />
            <h3>Clean R.O Water</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardSix" >
          <img src="images/smartclass-icon.svg" alt="" />
            <h3>Clean classrooms</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardSeven" >
          <img src="images/smartclass-icon.svg" alt="" />
            <h3>Speakers in every class</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardEight" >
          <img src="images/smartclass-icon.svg" alt="" />
            <h3>Music classes</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="cardNine" >
          <img src="images/smartclass-icon.svg" alt="" />
            <h3>Daily Activities</h3>
            <p>
            Genesis is a journey full of opportunities and fulfilment. Whether day scholars or in the boarding school
            </p>
          </div>
        </div>
       

    
      </div> */}

          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/computerLab-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Computer Lab</span>
                </h1>

                <p className="contentpara">
                  State-of-the-art computer lab for hands-on learning and
                  practical application of technology.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/education-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Extra Classes</span>
                </h1>
                <p className="contentpara">
                  Extra classes are offered for weaker students to enhance their
                  academic performance.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/smartclass-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Smart Classes</span>
                </h1>
                <p className="contentpara">
                  Smart classes equipped for better understanding and
                  interactive learning experiences.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/projectorclass-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Projector Classes</span>
                </h1>
                <p className="contentpara">
                  Projector classes are utilized daily to facilitate visual
                  learning and engagement.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/cleanRo-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Clean R.O Water</span>
                </h1>
                <p className="contentpara">
                  Clean R.O. water is provided for students' hydration and
                  well-being.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/clearroom-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Clean Classrooms</span>
                </h1>
                <p className="contentpara">
                  Classrooms maintained to high standards of cleanliness and
                  organization for optimal learning.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/speaker-icon.svg" alt="" />
                </div>
                <h1>
                  <span className="yearInfo">Speakers in every Class</span>
                </h1>
                <p className="contentpara">
                  Speakers installed in every class to ensure clear
                  communication and audio-enhanced learning.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="/Assets/session.svg" alt="Session" />
                </div>
                <h1>
                  <span className="yearInfo">Music Classes</span>
                </h1>
                <p className="contentpara">
                  Music classes are integrated into the curriculum to nurture
                  artistic expression and appreciation.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card-container-section">
              <div className="card-details">
                <div className="academic_year_img">
                  <img src="images/dailyaactivity-icon.svg" />
                </div>
                <h1>
                  <span className="yearInfo">Daily Activity</span>
                </h1>
                <p className="contentpara">
                  Daily activities are arranged to promote holistic development
                  and student engagement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Repeat the same structure for other rows as needed */}
      </div>
    </div>
  );
};

export default FeatureSection;
