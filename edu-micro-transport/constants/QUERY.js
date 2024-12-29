exports.VEHICLE_QUERIES = {
    createVehicle: 'INSERT INTO m_vehicle (school_id, vehicle_code, vehicle_plate_number, vehicle_reg_number, chasis_number, vehicle_model, year_made, vehicle_type, capacity,  updated_by, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING vehicle_id',
    checkVehicleExist: "select COUNT(*) from m_vehicle where (vehicle_code= $1 OR vehicle_plate_number= $2 OR chasis_number= $3) AND school_id = $4",
    checkVehicleExistUpdate: "select COUNT(*) from m_vehicle where vehicle_id <> $4 AND (vehicle_code= $1 OR vehicle_plate_number= $2 OR chasis_number= $3)",
    getVehicleByID: `SELECT V.vehicle_id, V.school_id, V.vehicle_code, V.vehicle_plate_number, V.vehicle_reg_number, V.chasis_number,
    V.vehicle_model, V.year_made, V.vehicle_type, V.capacity,
    U.user_id , U.mobile_number , u.display_name , R.route_id , R.route_no , R.starting_point , R.ending_point ,
    RL.role_id , RL.role_name , RL."level" 
    FROM m_vehicle V
    left join vehicle_driver_mapping VD on VD.vehicle_id = V.vehicle_id
    left join m_vehicle_route_mapping VR on VR.vehical_id  = V.vehicle_id 
    left join m_route R on R.route_id = VR.route_id 
    left join m_users U on U.user_id = VD.driver_id
    left join m_roles RL on U.role_id  = RL.role_id 
    where V.vehicle_id = $1`,
    updateVehicle: "UPDATE m_vehicle SET date_modified = now(), ",
    getVehicleCount: "SELECT COUNT(*) AS count FROM m_vehicle V #WHERE_CLAUSE#",
    getAllVehicles: `SELECT V.vehicle_id, V.school_id, V.vehicle_code, V.vehicle_plate_number, V.vehicle_reg_number, V.chasis_number,
    V.vehicle_model, V.year_made, V.vehicle_type, V.capacity,
    U.user_id , U.mobile_number , u.display_name , R.route_id , R.route_no , R.starting_point , R.ending_point 
    FROM m_vehicle V
    left join vehicle_driver_mapping VD on VD.vehicle_id = V.vehicle_id
    left join m_vehicle_route_mapping VR on VR.vehical_id  = V.vehicle_id 
    left join m_route R on R.route_id = VR.route_id 
    left join m_users U on U.user_id = VD.driver_id 
    #WHERE_CLAUSE# ORDER BY V.date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    addVehDocument: `INSERT INTO m_vehicle_document (vehicle_id,vehicle_plate_number,registration_certificate,updated_by,created_by) VALUES($1,$2,$3,$4,$5)`,
    checkDriverUserExists: `SELECT COUNT(*) AS count FROM m_users U 
    inner join m_user_mapping UM on U.user_id = UM.user_id 
    where U.user_id  = $1 and UM.school_id = $2`,
    checkRouteExists: `SELECT COUNT(*) AS count FROM m_route where route_id = $1 AND school_id = $2`,
    insertVehicleRouteMapping: `INSERT INTO public.m_vehicle_route_mapping
    (route_id, vehical_id, updated_by, created_by)
    VALUES($1, $2, $3, $4)`,
    deleteExistingRoute: `DELETE FROM public.m_vehicle_route_mapping WHERE vehical_id = $1`,
    deleteExistingDriver: `DELETE FROM public.vehicle_driver_mapping WHERE vehicle_id = $1`,
    getVehicleDocument: `SELECT * FROM m_vehicle_document WHERE vehicle_id = $1`,
    checkVehicleDocExists: `SELECT COUNT(*) AS count FROM m_vehicle_document WHERE vehicle_id = $1`,
    updateVehicleDocument: `UPDATE public.m_vehicle_document
    SET  vehicle_plate_number=$2, registration_certificate=$3, updated_by=$4,date_modified=now()
    WHERE vehicle_id=$1;`
};


exports.DRIVER_QUERIES = {
    createDriver: 'INSERT INTO m_driver (school_id, driver_name, dob, gender, mobile_number, driving_licence, aadhaar_no, alternate_number, address, updated_by, created_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING driver_id',
    checkDriverExist: "select COUNT(*) from m_driver where mobile_number = $1 OR driving_licence = $2 OR aadhaar_no = $3",
    getAllDriver: "SELECT driver_id, school_id, driver_name, dob, gender, mobile_number, driving_licence, aadhaar_no, alternate_number, address FROM m_driver #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#",
    getDriverByID: "SELECT * FROM m_driver WHERE driver_id = $1",
    getDriverCount: "SELECT COUNT(*) AS count FROM m_driver #WHERE_CLAUSE#",
    updateDriver: "UPDATE m_driver SET",

};

exports.ROUTE_QUERIES = {
    getRouteByID: "SELECT * FROM m_route WHERE route_id = $1 ",
    getStopsByRouteID: "SELECT * FROM m_route_stop WHERE route_id = $1 ",
    getAllRouteCount: "SELECT COUNT(*) AS count FROM m_route #WHERE_CLAUSE#",
    getAllRoutes: "SELECT route_id, school_id, route_no, starting_point, ending_point, total_stops, distance, estimated_travel_time, status, updated_by,created_by FROM m_route #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#",
    deleterouteMapping: 'delete from m_route_stop where route_id = $1',
    updateRoute: " UPDATE m_route  SET  starting_point = $1, ending_point = $2,total_stops = $3 ,status = $4, updated_by = $5, date_modified=now() WHERE route_id = $6; ",
    createRouteMapping: `INSERT INTO m_route_stop(route_id, stop_name,lattitude,longitude,status, updated_by,created_by,date_created,date_modified) values($1, $2, $3, $4, $5, $6, $7,now(), now()) RETURNING route_stop_id`,
    checkIfStopsExist: `select count(*) from m_route_stop where stop_name=$1 AND route_id=$2`,
    checkIfRouteIdExist: `select count(*) from m_route where route_id=$1`,
    checkIfExist: `SELECT COUNT(*) FROM m_route WHERE route_no = $1 AND school_id = $2`,
    insertRouteQuery: 'INSERT INTO m_route (route_no, starting_point,ending_point,total_stops,distance,estimated_travel_time,status,school_id, created_by,updated_by,date_created,date_modified)  VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,now(), now()) RETURNING route_id ',
}

exports.ASSIGN_QUERIES = {
    insertAssignDriver: 'INSERT INTO vehicle_driver_mapping (driver_id, vehicle_id, updated_by, created_by) VALUES($1, $2, $3, $4) RETURNING vhcl_dvr_map_id',
    assignDriverExist: "select COUNT(*) from vehicle_driver_mapping  where driver_id =$1 OR vehicle_id= $2",
    checkVehicleId: "select count(school_id) from m_vehicle where vehicle_id = $1",
    checkDriverId: "select count(school_id) from m_driver where driver_id = $1"
};

exports.MAP_QUERIES = {
    insertMapData: 'INSERT INTO vehicle_driver_mapping (vehicle_id,driver_id, updated_by, created_by) VALUES($1, $2, $3,$4) RETURNING vhcl_dvr_map_id',
    ifVehicleExist: "select COUNT(*) from vehicle_driver_mapping  where vehicle_id= $1",
    checkVehicleInVeh: "select count(school_id) from m_vehicle where vehicle_id = $1",
};
