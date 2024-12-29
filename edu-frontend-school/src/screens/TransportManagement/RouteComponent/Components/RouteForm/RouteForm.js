import { useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconTrash,
  IconCopy,
  IconPlus,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NativeSelect, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import ToastUtility from "../../../../../utility/ToastUtility";
import * as addRouteService from "../../Route.service";

const RouteForm = () => {
  const [addRouteFilds, setAddRouteFildes] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [stopData, setStopData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      route_no: "",
      starting_point: "",
      ending_point: "",
      stop_name: "",
    },

    validate: {
      
    },
  });

  const goBackToRoutePage = () => {
    navigate("/route");
  };

  const addFilds = () => {
    if (
      form.values.route_no != "" &&
      form.values.starting_point != "" &&
      form.values.ending_point != "" &&
      form.values.stop_name != ""
    ) {
      const newRoute = {
        stop_name: form.values.stop_name,
      };
      setAddRouteFildes([...addRouteFilds, newRoute]);
      form.values.stop_name = "";
    } else {
      ToastUtility.info("Please fill all mandatory ( * ) fields");
    }
  };

  const deleteAddMoreTypes = (id) => {
    const deleteRouteType = addRouteFilds.filter((type, index) => index !== id);
    setAddRouteFildes(deleteRouteType);
  };
  const { state } = useLocation();

  const onSubmit = async () => {
    if (state?.rowData.route_id) {
      if (
        form.values.route_no &&
        form.values.starting_point &&
        form.values.ending_point
      ) {
        const { route_no, starting_point, ending_point } = form.values;
        const payload = {
          route_id: state?.rowData.route_id,
          route_no: route_no,
          starting_point: starting_point,
          ending_point: ending_point,
          stops_list: addRouteFilds.map((obj) => ({
            stop_name: obj.stop_name,
          })),
        };
        const updateRouteResponse = await addRouteService.UpdateRoute(payload);
        if (!updateRouteResponse.error) {
          ToastUtility.success("Route Updated Successfully");
          navigate("/route");
        }
      } else {
        ToastUtility.warning("Please fill all mandatory ( * ) fields");
      }
    } else {
      if (
        form.values.route_no &&
        form.values.starting_point &&
        form.values.ending_point
      ) {
        const { route_no, starting_point, ending_point } = form.values;
        const payload = {
          route_no: route_no,
          starting_point: starting_point,
          ending_point: ending_point,
          stops_list: addRouteFilds.map((obj) => ({
            stop_name: obj.stop_name,
          })),
        };
        const addRouteResponse = await addRouteService.AddRoute(payload);
        if (!addRouteResponse.error) {
          ToastUtility.success("Route added Successfully");
          navigate("/route");
        } else {
          ToastUtility.error("Please fill all mandatory ( * ) fields");
        }
      }
    }
  };

  const getDataByRouteId = async (routeId) => {
    const getRouteByIdResponse = await addRouteService.getRouteid(routeId);
    if (!getRouteByIdResponse.error) {
      setRouteData(getRouteByIdResponse?.data?.route);
      setStopData(getRouteByIdResponse?.data?.stops);
      setIsUpdateMode(true);
    } else {
      ToastUtility.error("No data found for this Route ID!");
    }
  };

  useEffect(() => {
    if (state?.rowData.route_id) {
      getDataByRouteId(state?.rowData.route_id);
    }
  }, []);

  useEffect(() => {
    form.setValues(routeData[0]);
    setAddRouteFildes(stopData);
  }, [routeData]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="d-flex align-items-center">
          <IconChevronLeft
            size={30}
            onClick={goBackToRoutePage}
            style={{ cursor: "pointer" }}
            color="blue"
          />

          <span
            className="fw-bold "
            style={{ fontSize: "20px", marginLeft: "10px" }}
          >
            {state?.rowData.route_id ? "Update Route" : " Add Route"}
          </span>
        </div>
      </div>
      <div className="col-md-12">
        <div className="add-organization-container mx-2">
          <form onSubmit={form.onSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-4">
                
                <div className="form-group text-start mb-3">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="routeNo"
                  >
                    Route Number *
                  </label>
                  <br />

                  <TextInput
                    placeholder="Enter here"
                    {...form.getInputProps("route_no")}
                    className="text-danger mt-1"
                    id="routeNo"
                    size="lg"
                    hideControls
                    maxLength={20}
                    disabled= {isUpdateMode}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group text-start mb-3">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="startPoint"
                  >
                    Start Point *
                  </label>
                  <br />
                  <TextInput
                    placeholder="Enter here"
                    {...form.getInputProps("starting_point")}
                    className="text-danger mt-1"
                    id="startPoint"
                    size="lg"
                    hideControls
                    maxLength={20}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group text-start mb-3">
                  <label
                    className="fw-bold text-secondary mb-1"
                    htmlFor="endingPoint"
                  >
                    End Point *
                  </label>
                  <br />
                  <TextInput
                    placeholder="Enter here"
                    className="text-danger mt-1"
                    {...form.getInputProps("ending_point")}
                    id="endingPoint"
                    size="lg"
                    hideControls
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginTop: "1rem",
                  }}
                >
                  Add Stop *
                </h1>
              </div>
              <div className="col-md-4">
                <div className="form-group text-start mb-3">
                  <TextInput
                    placeholder="Enter here"
                    {...form.getInputProps("stop_name")}
                    id="stop_name"
                    size="lg"
                    hideControls
                    pattern="^\S+$"
                    maxLength={30}
                  />
                </div>
              </div>

              <div
                className="col-1 col-md-1 col-lg-1"
                style={{ outline: "none" }}
              >
                <IconPlus
                  style={{ marginTop: "15px", cursor: "pointer" }}
                  size={30}
                  color="blue"
                  onClick={() => addFilds()}
                />
              </div>
            </div>
            {addRouteFilds.map((route, index) => (
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group text-start mb-3">
                    <TextInput
                      placeholder="Enter here"
                      className="text-danger mt-1"
                      id={`stop_name${index}`}
                      size="lg"
                      hideControls
                      value={route.stop_name}
                    />
                  </div>
                </div>

                <div className="col-md-1">
                  <IconTrash
                    color="red"
                    style={{ marginTop: "15px", cursor: "pointer" }}
                    onClick={() => deleteAddMoreTypes(index)}
                  />
                </div>
              </div>
            ))}

            {state?.rowData.route_id ? (
              <button
                className="btn add-button mt-3"
                type="submit"
                style={{ color: "#fff" }}
              >
                Update
              </button>
            ) : (
              <button
                className="btn add-button mt-3"
                type="submit"
                style={{ color: "#fff" }}
                disabled={addRouteFilds?.length === 0}
              >
                Save
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RouteForm;
