import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import FormError from '../../components/FormError/FormError';
import { mockAuthAPI } from '../../services/api';
import { loginSchema } from '../../schemas/validationSchema';
import { loadUserCart } from '../../store/slices/cartSlice';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError('');

      try {
        await mockAuthAPI.login(values.email, values.password);
        
        localStorage.setItem('userEmail', values.email);
        
        setTimeout(() => {
          dispatch(loadUserCart());
        }, 100);
        
        navigate('/');
      } catch (error) {
        setSubmitError(error.message || 'Помилка автентифікації');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  React.useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <section className="login-page">
      <div className="container">
        <div className="auth-card">
          <h1 className="auth-title">Вхід</h1>
          
          <form onSubmit={formik.handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                className={`form-input ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <FormError message={formik.errors.email} />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                name="password"
                type="password"
                placeholder="Введіть пароль"
                className={`form-input ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <FormError message={formik.errors.password} />
              )}
            </div>

            {submitError && (
              <div className="submit-error">
                <FormError message={submitError} />
              </div>
            )}

            <PrimaryButton
              type="submit"
              className="auth-btn"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Увійти
            </PrimaryButton>
          </form>

          <div className="auth-footer">
            <p>Немає акаунта? <Link to="/register">Зареєструватися</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;