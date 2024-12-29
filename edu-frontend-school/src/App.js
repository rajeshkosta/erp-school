import "./App.css";
import Login from "./screens/auth/login/login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Navigate } from "react-router-dom";
import Menu from "./shared/components/menus/menu";
import RoleManagement from "./screens/RoleManagement/RoleManagement";
import RoleListComponent from "./screens/RoleManagement/Component/RoleList/RoleListComponent";
import AddRoleComponent from "./screens/RoleManagement/Component/AddRole/AddRoleComponent";
import EditRoleComponent from "./screens/RoleManagement/Component/EditRole/EditRoleComponent";
import UserManagement from "./screens/UserManagement/UserManagement";
import UserListComponent from "./screens/UserManagement/Component/UserList/UserListComponent";
import AddUserComponent from "./screens/UserManagement/Component/AddUser/AddUserComponent";
import EditUserComponent from "./screens/UserManagement/Component/EditUser/EditUserComponent";
import ForgotPassword from "./screens/auth/ForgotPassword/forgotPass";
import OrganizationListComponent from "./screens/OrganizationManagement/Component/OrganizationList/OrganizationListComponent";
import AddOrganizationComponent from "./screens/OrganizationManagement/Component/AddOrganization/AddOrganizationComponent";
import EditOrganizationComponent from "./screens/OrganizationManagement/Component/EditOrganization/EditOrganizationComponent";
import OrganizationManagement from "./screens/OrganizationManagement/organizationManagement";
import Menus from "./shared/components/menus/menu";
import { useAuth } from "./context/AuthContext";
import AcademicYear from "./screens/AcademicYear/AcademicYear";
import AcademicListComponent from "./screens/AcademicYear/Component/AcademicYearList/AcademicListComponent";
import AddAcademicComponent from "./screens/AcademicYear/Component/AddAcademicYear/AddAcademicComponent";
import EditAcademicComponent from "./screens/AcademicYear/Component/EditAcademicYear/EditAcademicComponent";
import SubjectManagement from "./screens/SubjectManagement/SubjectManagement";
import AddSubjectComponent from "./screens/SubjectManagement/Component/AddSubject/AddSubjectComponent";
import EditSubjectComponent from "./screens/SubjectManagement/Component/EditSubject/EditSubjectComponent";
import SubjectListComponent from "./screens/SubjectManagement/Component/SubjectList/SubjectListComponent";
import * as AppPreference from "./utility/AppPreference";
import SchoolManagement from "./screens/SchoolManagement/SchoolManagement";
import SchoolListComponent from "./screens/SchoolManagement/Component/SchoolList/SchoolListComponent";
import AddSchoolComponent from "./screens/SchoolManagement/Component/AddSchool/AddSchoolComponent";
import EditSchoolComponent from "./screens/SchoolManagement/Component/EditSchool/EditSchoolComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./screens/Dashboard/Dashboard";
import ClassManagement from "./screens/Class/ClassManagement";
import ClassListComponent from "./screens/Class/Component/ClassList/ClassListComponent";
import AddClassComponent from "./screens/Class/Component/AddClass/AddClassComponent";
import EditClassComponent from "./screens/Class/Component/EditClass/EditClassComponent";
import StudentManagement from "./screens/StudentManagement/StudentManagement";
import StudentListComponent from "./screens/StudentManagement/Component/StudentList/StudentListComponent";
import AddStudentComponent from "./screens/StudentManagement/Component/AddStudent/AddStudentComponent";
import EditStudentComponent from "./screens/StudentManagement/Component/EditStudent/EditStudentComponent";
import Section from "./screens/Section/Section";
import AddSectionComponent from "./screens/Section/Component/AddSection/AddSection";
import EditSectionComponent from "./screens/Section/Component/EditSection/EditSection";
import SectionList from "./screens/Section/Component/SectionList/SectionList";
import { useInterceptors } from "./utility/AxiosConfig";
import { logout } from "./screens/auth/auth.service";
import ToastUtility from "./utility/ToastUtility";
import FeeType from "./screens/FeeManagement/FeeType/FeeType";
import ListFeeType from "./screens/FeeManagement/FeeType/Component/ListFeeType/ListFeeType";
import AddFeeType from "./screens/FeeManagement/FeeType/Component/AddFeeType/AddFeeType";
import EditFeeType from "./screens/FeeManagement/FeeType/Component/EditFeeType/EditFeeType";
import FeeMaster from "./screens/FeeManagement/FeeMaster/FeeMaster";
import FeeMasterList from "./screens/FeeManagement/FeeMaster/Component/FeeMasterList/FeeMasterList";
import AddFeeMaster from "./screens/FeeManagement/FeeMaster/Component/AddFeeMaster/AddFeeMaster";
import EditFeeMaster from "./screens/FeeManagement/FeeMaster/Component/EditFeeMaster/EditFeeMaster";
import FeeMasterGrid from "./screens/FeeManagement/FeeMaster/Component/FeeMasterGrid/FeeMasterGrid";
import ExamManagement from "./screens/ExamManagement/Exam/ExamManagement";
import ExamListComponent from "./screens/ExamManagement/Exam/Component/ExamList/ExamListComponent";
import AddExamComponent from "./screens/ExamManagement/Exam/Component/AddExam/AddExamComponent";
import EditExamComponent from "./screens/ExamManagement/Exam/Component/EditExam/EditExamComponent";
import ExamGrid from "./screens/ExamManagement/Exam/Component/ExamGrid/ExamGrid";
import ExamTypeManagement from "./screens/ExamManagement/ExamType/ExamTypeManagement";
import ExamTypeListComponent from "./screens/ExamManagement/ExamType/Component/ExamTypeList/ExamTypeListComponent";
import AddExamTypeComponent from "./screens/ExamManagement/ExamType/Component/AddExamType/AddExamTypeComponent";
import EditExamTypeComponent from "./screens/ExamManagement/ExamType/Component/EditExamType/EditExamTypeComponent";
import AddFeeDiscount from "./screens/FeeManagement/FeeDiscount/Component/AddFeeDiscount/AddFeeDiscount";
import EditFeeDiscount from "./screens/FeeManagement/FeeDiscount/Component/EditFeeDiscount/EditFeeDiscount";
import FeeDiscount from "./screens/FeeManagement/FeeDiscount/FeeDiscount";
import FeeDiscountList from "./screens/FeeManagement/FeeDiscount/Component/FeeDiscountList/FeeDiscountList";
import StudentToSectionAllocation from "./screens/StudentToSectionAllocation/StudentToSectionAllocation";
import ListStudentToSectionAllocation from "./screens/StudentToSectionAllocation/Component/ListStudentToSectionAllocation/ListStudentToSectionAllocation";
import StudentFees from "./screens/StudentManagement/Component/StudentFees/StudentFees";
import Assignment from "./screens/Assignment/Assignment";
import AssignmentListComponent from "./screens/Assignment/Component/AssignmentList/AssignmentListComponent";
import AddAssignmentComponent from "./screens/Assignment/Component/AddAssignment/AddAssignmentComponent";
import EditAssignmentComponent from "./screens/Assignment/Component/EditAssignment/EditAssignmentComponent";
import AssignmentGrid from "./screens/Assignment/Component/AssignmentGrid/AssignmentGrid";
import ProfileManagement from "./screens/ProfileScreen/ProfileManagement";
import Profile from "./screens/ProfileScreen/Profile/Profile";
import Attendance from "./screens/Attendance/Attendance";
import AttendanceList from "./screens/Attendance/Component/AttendanceList/AttendanceList";
import StudentList from "./screens/StudentList/StudentList";
import ListofStudentbyClass from "./screens/StudentList/Component/studentList/ListofStudent";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import VehicleComponent from "./screens/TransportManagement/VehicleComponent/VehicleComponent";
import VehicleList from "./screens/TransportManagement/VehicleComponent/Components/VehicleList/VehicleList";
import RouteComponent from "./screens/TransportManagement/RouteComponent/RouteComponent";
import AddRoute from "./screens/TransportManagement/RouteComponent/Components/AddRoute/AddRoute";
import EditRoute from "./screens/TransportManagement/RouteComponent/Components/EditRoute/EditRoute";
import RouteList from "./screens/TransportManagement/RouteComponent/Components/RouteList/RouteList";
import DriverComponent from "./screens/TransportManagement/DriverComponent/DriverComponent";
import DriverList from "./screens/TransportManagement/DriverComponent/Components/DriverList/DriverList";
import AddDriver from "./screens/TransportManagement/DriverComponent/Components/AddDriver/AddDriver";
import EditDriver from "./screens/TransportManagement/DriverComponent/Components/EditDriver/EditDriver";
import OPTverification from "./screens/auth/OTPVerification/OTPVerification";

import StudentProfileData from "./screens/StudentList/Component/StudentProfileData/StudentProfileData";

import AddVehicle from "./screens/TransportManagement/VehicleComponent/Components/AddVehicle/AddVehicle";
import EditVehicle from "./screens/TransportManagement/VehicleComponent/Components/EditVehicle/EditVehicle";
import OtpLogin from "./screens/auth/OtpLogin/OtpLogin";
import ResetForgetPassword from "./screens/auth/ResetForgetPassword/ResetForgetPassword";
import ResetPassword from "./screens/auth/ResetPassword/ResetPassword";
import NoticeBoard from "./screens/NoticeBoard/NoticeBoard";
import NoticeList from "./screens/NoticeBoard/Components/NoticeList/NoticeList";
import AddNotice from "./screens/NoticeBoard/Components/AddNotice/AddNotice";
import EditNotice from "./screens/NoticeBoard/Components/EditNotice/EditNotice";
import MarksManagement from "./screens/Marks/MarksManagement";
import MarksList from "./screens/Marks/Component/MarksList/MarksList";
import AddMarks from "./screens/Marks/Component/AddMarks/AddMarks";
import EditMarks from "./screens/Marks/Component/EditMarks/EditMarks";

const App = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useInterceptors(logout, navigate, ToastUtility);

  return (
    <>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
      {isAuthenticated && <Menus />}
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/otp" element={<OtpLogin />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route
            path="/resetforgetpassword"
            element={<ResetForgetPassword />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/OTPVerification" element={<OPTverification />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile" element={<ProfileManagement />}>
            <Route path="view" element={<Profile />} />
          </Route>

          <Route
            path="/organizationmanagement"
            element={<OrganizationManagement />}
          >
            <Route path="" element={<OrganizationListComponent />} />
            <Route path="add" element={<AddOrganizationComponent />} />
            <Route path="edit" element={<EditOrganizationComponent />} />
          </Route>

          <Route path="/rolemanagement" element={<RoleManagement />}>
            <Route path="" element={<RoleListComponent />} />
            <Route path="add" element={<AddRoleComponent />} />
            <Route path="edit" element={<EditRoleComponent />} />
          </Route>

          <Route path="/school" element={<SchoolManagement />}>
            <Route path="" element={<SchoolListComponent />} />
            <Route path="add" element={<AddSchoolComponent />} />
            <Route path="edit" element={<EditSchoolComponent />} />
          </Route>

          <Route path="/usermanagement" element={<UserManagement />}>
            <Route path="" element={<UserListComponent />} />
            <Route path="add" element={<AddUserComponent />} />
            <Route path="edit" element={<EditUserComponent />} />
          </Route>

          <Route path="/academicyear" element={<AcademicYear />}>
            <Route path="" element={<AcademicListComponent />} />
            <Route path="add" element={<AddAcademicComponent />} />
            <Route path="edit" element={<EditAcademicComponent />} />
          </Route>

          <Route path="/subjectmanagement" element={<SubjectManagement />}>
            <Route path="" element={<SubjectListComponent />} />
            <Route path="add" element={<AddSubjectComponent />} />
            <Route path="edit" element={<EditSubjectComponent />} />
          </Route>

          <Route path="/section" element={<Section />}>
            <Route path="" element={<SectionList />} />
            <Route path="add" element={<AddSectionComponent />} />
            <Route path="edit" element={<EditSectionComponent />} />
          </Route>

          <Route path="/class" element={<ClassManagement />}>
            <Route path="" element={<ClassListComponent />} />
            <Route path="add" element={<AddClassComponent />} />
            <Route path="edit" element={<EditClassComponent />} />
          </Route>

          <Route path="/exam" element={<ExamManagement />}>
            <Route path="" element={<ExamListComponent />} />
            <Route path="add" element={<AddExamComponent />} />
            <Route path="edit" element={<EditExamComponent />} />
            <Route path="grid" element={<ExamGrid />} />
          </Route>

          <Route path="/feeType" element={<FeeType />}>
            <Route path="" element={<ListFeeType />} />
            <Route path="add" element={<AddFeeType />} />
            <Route path="edit" element={<EditFeeType />} />
          </Route>

          <Route path="/feeMaster" element={<FeeMaster />}>
            <Route path="" element={<FeeMasterList />} />
            <Route path="add" element={<AddFeeMaster />} />
            <Route path="edit" element={<EditFeeMaster />} />
            {/* <Route path="" element={<FeeMasterGrid />} /> */}
          </Route>

          <Route path="/feeDiscount" element={<FeeDiscount />}>
            <Route path="" element={<FeeDiscountList />} />
            <Route path="add" element={<AddFeeDiscount />} />
            <Route path="edit" element={<EditFeeDiscount />} />
          </Route>

          <Route path="/student" element={<StudentManagement />}>
            <Route path="" element={<StudentListComponent />} />
            <Route path="add" element={<AddStudentComponent />} />
            <Route path="edit" element={<EditStudentComponent />} />
            <Route path="fees" element={<StudentFees />} />
          </Route>

          <Route path="/examtype" element={<ExamTypeManagement />}>
            <Route path="" element={<ExamTypeListComponent />} />
            <Route path="add" element={<AddExamTypeComponent />} />
            <Route path="edit" element={<EditExamTypeComponent />} />
          </Route>

          <Route path="/assignment" element={<Assignment />}>
            <Route path="" element={<AssignmentListComponent />} />
            <Route path="add" element={<AddAssignmentComponent />} />
            <Route path="edit" element={<EditAssignmentComponent />} />
            <Route path="grid" element={<AssignmentGrid />} />
          </Route>

          <Route path="/vehicle" element={<VehicleComponent />}>
            <Route path="" element={<VehicleList />} />
            <Route path="add" element={<AddVehicle />} />
            <Route path="edit" element={<EditVehicle />} />
          </Route>

          <Route path="/driver" element={<DriverComponent />}>
            <Route path="" element={<DriverList />} />
            <Route path="add" element={<AddDriver />} />
            <Route path="edit" element={<EditDriver />} />
          </Route>

          <Route path="/route" element={<RouteComponent />}>
            <Route path="" element={<RouteList />} />
            <Route path="add" element={<AddRoute />} />
            <Route path="edit" element={<EditRoute />} />
          </Route>

          <Route path="/marks" element={<MarksManagement />}>
            <Route path="" element={<MarksList />} />
            <Route path="add" element={<AddMarks />} />
            <Route path="edit" element={<EditMarks />} />
          </Route>

          <Route path="/noticeboard" element={<NoticeBoard />}>
            <Route path="" element={<NoticeList />} />
            <Route path="add" element={<AddNotice />} />
            <Route path="edit" element={<EditNotice />} />
          </Route>

          <Route
            path="/studentAllocation"
            element={<StudentToSectionAllocation />}
          >
            <Route path="" element={<ListStudentToSectionAllocation />} />
          </Route>
          <Route path="/studentList" element={<StudentList />}>
            <Route path="" element={<ListofStudentbyClass />} />
            <Route path="studentProfileData" element={<StudentProfileData />} />
          </Route>
          <Route path="/attendance" element={<Attendance />}>
            <Route path="" element={<AttendanceList />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
