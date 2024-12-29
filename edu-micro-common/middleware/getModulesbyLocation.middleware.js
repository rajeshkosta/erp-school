var getModulesbyLocation = (req) => {

    let token = req.plainToken;

    if (token) {
        let level = token.user_level;
        let trust_id = token.trust_id;
        let school_id = token.school_id;

        // console.log("Logged in user level - " + level);
        // console.log("token - ", token);

        req.eduPayload = {};
        switch (level) {

            case 'Admin':
                req.eduPayload.view_access = `and user_level = 'Trust'`;
                req.eduPayload.role_access = ['Trust'];
                break;

            case 'Trust':
                req.eduPayload.view_access = `and user_level = 'School'`;
                req.eduPayload.role_access = ['School'];
                break;

            case 'School':
                req.eduPayload.view_access = `and user_level in('Faculty', 'NonFaculty', 'Vendor')`;
                req.eduPayload.role_access = ['Faculty', 'NonFaculty', 'Vendor'];
                break;

            case 'Faculty':
                req.eduPayload.view_access =  ``;
                req.eduPayload.role_access = [];
                break;

            case 'NonFaculty':
                req.eduPayload.view_access = `'`;
                req.eduPayload.role_access = [];
                break;
        }
    }

}

module.exports = getModulesbyLocation;