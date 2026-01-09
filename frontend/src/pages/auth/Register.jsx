import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerUserAPI } from '../../services/userServices';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const registerMutation = useMutation({
        mutationFn: registerUserAPI,
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            address: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
            address: Yup.string().min(10, 'Minimum 10 characters').required('address is required')
        }),
        onSubmit: async (values) => {
            try {
                const data = await registerMutation.mutateAsync(values);
                dispatch(registerUserAPI(data));
                navigate('/')


            } catch (error) {
                alert(error.response?.data?.message || "Login failed");
            }


        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 p-4 border rounded shadow-md w-80 mx-auto">
            <input
                type="text"
                name="name"
                placeholder="Name"
                className="p-2 border rounded"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}

            <input
                type="email"
                name="email"
                placeholder="Email"
                className="p-2 border rounded"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}

            <input
                type="password"
                name="password"
                placeholder="Password"
                className="p-2 border rounded"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}

            <input
                type="text"
                name="address"
                placeholder="Address"
                className="p-2 border rounded"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address && (
                <div className="text-red-500 text-sm">{formik.errors.address}</div>
            )}


            <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={registerMutation.isLoading}>
                {registerMutation.isLoading ? 'Registering...' : 'Register'}
            </button>




        </form>
    );
};

export default Register;

