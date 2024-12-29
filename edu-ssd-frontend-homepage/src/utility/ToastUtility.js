import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastUtility = {
    success: (message, options = {}) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            ...options
        });
    },
    warning: (message, options = {}) => {
        toast.warning(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            ...options
        });
    },
    error: (message, options = {}) => {
        toast.error(message ? message : "Something Went Wrong!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            ...options
        });
    },
    info: (message, options = {}) => {
        toast.info(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            ...options,
        });
    },
};

export default ToastUtility;
