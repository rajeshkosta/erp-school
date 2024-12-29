import { get, post } from "../../../utility/ApiCall";

const getAllRoute = async(payload) =>{
    const getRouteList = await post(`api/v1/transport/route/getAllRoutes`, payload);
    return getRouteList;
}

const AddRoute = async (payload) => {
    const addingRoute = await post(`/api/v1/transport/route/create`, payload);
    return addingRoute

}

const UpdateRoute = async (payload) => {
    const updatingRoute = await post(`/api/v1/transport/route/update`, payload);
    return updatingRoute
}

const getRouteid = async (id) => {
    const gettingRouteId = await get(`/api/v1/transport/route/getRoutedetail/${id}`);
    return gettingRouteId
}




export {
    getAllRoute,
    AddRoute,
    UpdateRoute,
    getRouteid
}