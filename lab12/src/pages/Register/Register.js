import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import FormError from '../../components/FormError/FormError';
import { mockAuthAPI } from '../../services/api';
import { registerSchema } from '../../schemas/validationSchema';
import { loadUserCart } from '../../store/slices/cartSlice';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError('');

      try {
        await mockAuthAPI.register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password
        });
        
        localStorage.setItem('userEmail', values.email);
        
        setTimeout(() => {
          dispatch(loadUserCart());
        }, 100);
        
        navigate('/');
      } catch (error) {
        setSubmitError(error.message || 'Помилка реєстрації');
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
    <section className="register-page">
      <div className="container">
        <div className="auth-card">
          <h1 className="auth-title">Реєстрація</h1>
          
          <form onSubmit={formik.handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ім'я</label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Введіть ім'я"
                  className={`form-input ${formik.touched.firstName && formik.errors.firstName ? 'input-error' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <FormError message={formik.errors.firstName} />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Прізвище</label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Введіть прізвище"
                  className={`form-input ${formik.touched.lastName && formik.errors.lastName ? 'input-error' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <FormError message={formik.errors.lastName} />
                )}
              </div>
            </div>

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

            <div className="form-row">
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

              <div className="form-group">
                <label className="form-label">Підтвердження паролю</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Повторіть пароль"
                  className={`form-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-error' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <FormError message={formik.errors.confirmPassword} />
                )}
              </div>
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
              Зареєструватися
            </PrimaryButton>
          </form>

          <div className="auth-footer">
            <p>Вже маєте акаунт? <Link to="/login">Увійти</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;