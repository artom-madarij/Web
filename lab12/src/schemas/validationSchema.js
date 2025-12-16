import * as yup from 'yup';

const ALLOWED_DOMAINS = ['gmail.com', 'ukr.net', 'yahoo.com', 'outlook.com', 'icloud.com'];

const validateEmail = (value) => {
  if (!value || typeof value !== 'string') return false;
  
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  
  const localPart = parts[0];
  const domain = parts[1].toLowerCase();
  
  if (localPart.length < 5) return false;
  
  if (!domain.includes('.')) return false;
  
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return false;
  }
  
  return true;
};

const getEmailErrorMessage = (value) => {
  if (!value || typeof value !== 'string') return 'Email обов\'язковий';
  
  if (!value.includes('@')) {
    return 'Email має містити знак @';
  }
  
  const parts = value.split('@');
  if (parts.length !== 2) return 'Невірний формат email';
  
  const localPart = parts[0];
  const domain = parts[1];
  
  if (localPart.length < 5) {
    return 'Email має містити щонайменше 5 символів перед знаком @';
  }
  
  if (!domain.includes('.')) {
    return 'Email має мати дійсний домен (наприклад: gmail.com)';
  }
  
  if (!ALLOWED_DOMAINS.includes(domain.toLowerCase())) {
    return `Дозволені домени: ${ALLOWED_DOMAINS.join(', ')}`;
  }
  
  return 'Невірний формат email';
};

export const checkoutSchema = yup.object().shape({
  firstName: yup.string()
    .min(2, "Занадто коротке!")
    .max(50, "Занадто довге!")
    .required("Ім'я обов'язкове"),
  lastName: yup.string()
    .min(2, "Занадто коротке!")
    .max(50, "Занадто довге!")
    .required("Прізвище обов'язкове"),
  age: yup.number()
    .typeError("Вік має бути числом") 
    .min(18, "Вам має бути 18 років")
    .required("Вкажіть вік"),
  email: yup.string()
    .test('email-format', getEmailErrorMessage, (value) => {
      return validateEmail(value);
    })
    .max(100, "Email занадто довгий")
    .required("Email обов'язковий"),
  phone: yup.string()
    .matches(/^[0-9]{10,12}$/, "Тільки цифри (10-12 символів)")
    .required("Телефон обов'язковий"),
});

export const loginSchema = yup.object().shape({
  email: yup.string()
    .test('email-format', (value) => {
      if (!value || typeof value !== 'string') return true;
      return validateEmail(value);
    }, getEmailErrorMessage)
    .max(100, "Email занадто довгий")
    .required('Email обов\'язковий'),
  password: yup.string()
    .min(6, 'Мінімум 6 символів')
    .required('Пароль обов\'язковий')
});

export const registerSchema = yup.object().shape({
  firstName: yup.string()
    .min(2, 'Занадто коротке!')
    .max(50, 'Занадто довге!')
    .required("Ім'я обов'язкове"),
  lastName: yup.string()
    .min(2, 'Занадто коротке!')
    .max(50, 'Занадто довге!')
    .required("Прізвище обов'язкове"),
  email: yup.string()
    .test('email-format', (value) => {
      if (!value || typeof value !== 'string') return true;
      return validateEmail(value);
    }, getEmailErrorMessage)
    .max(100, "Email занадто довгий")
    .required('Email обов\'язковий'),
  password: yup.string()
    .min(6, 'Мінімум 6 символів')
    .required('Пароль обов\'язковий'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Паролі не співпадають')
    .required('Підтвердження паролю обов\'язкове')
});