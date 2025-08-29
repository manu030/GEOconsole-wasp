import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Auth';
import { Form, FormInput, FormItemGroup, FormLabel, FormError, FormTextarea, SubmitButton, } from '../Form';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../email/useEmail';
// PRIVATE API
export const LoginSignupForm = ({ state, socialButtonsDirection = 'horizontal', additionalSignupFields, }) => {
    const { isLoading, setErrorMessage, setSuccessMessage, setIsLoading, } = useContext(AuthContext);
    const isLogin = state === 'login';
    const cta = isLogin ? 'Log in' : 'Sign up';
    const navigate = useNavigate();
    const onErrorHandler = (error) => {
        setErrorMessage({ title: error.message, description: error.data?.data?.message });
    };
    const hookForm = useForm();
    const { register, formState: { errors }, handleSubmit: hookFormHandleSubmit } = hookForm;
    const { handleSubmit } = useEmail({
        isLogin,
        onError: onErrorHandler,
        showEmailVerificationPending() {
            hookForm.reset();
            setSuccessMessage(`You've signed up successfully! Check your email for the confirmation link.`);
        },
        onLoginSuccess() {
            navigate('/demo-app');
        },
    });
    async function onSubmit(data) {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await handleSubmit(data);
        }
        finally {
            setIsLoading(false);
        }
    }
    return (<>
        <Form onSubmit={hookFormHandleSubmit(onSubmit)}>
          <FormItemGroup>
            <FormLabel>E-mail</FormLabel>
            <FormInput {...register('email', {
        required: 'Email is required',
    })} type="email" disabled={isLoading}/>
            {errors.email && <FormError>{errors.email.message}</FormError>}
          </FormItemGroup>
          <FormItemGroup>
            <FormLabel>Password</FormLabel>
            <FormInput {...register('password', {
        required: 'Password is required',
    })} type="password" disabled={isLoading}/>
            {errors.password && <FormError>{errors.password.message}</FormError>}
          </FormItemGroup>
          <AdditionalFormFields hookForm={hookForm} formState={{ isLoading }} additionalSignupFields={additionalSignupFields}/>
          <FormItemGroup>
            <SubmitButton type="submit" disabled={isLoading}>{cta}</SubmitButton>
          </FormItemGroup>
        </Form>
  </>);
};
function AdditionalFormFields({ hookForm, formState: { isLoading }, additionalSignupFields, }) {
    const { register, formState: { errors }, } = hookForm;
    function renderField(field, 
    // Ideally we would use ComponentType here, but it doesn't work with react-hook-form
    Component, props) {
        const errorMessage = errors[field.name]?.message;
        return (<FormItemGroup key={field.name}>
        <FormLabel>{field.label}</FormLabel>
        <Component {...register(field.name, field.validations)} {...props} disabled={isLoading}/>
        {errorMessage && (<FormError>{errorMessage}</FormError>)}
      </FormItemGroup>);
    }
    if (areAdditionalFieldsRenderFn(additionalSignupFields)) {
        return additionalSignupFields(hookForm, { isLoading });
    }
    return (additionalSignupFields &&
        additionalSignupFields.map((field) => {
            if (isFieldRenderFn(field)) {
                return field(hookForm, { isLoading });
            }
            switch (field.type) {
                case 'input':
                    return renderField(field, FormInput, {
                        type: 'text',
                    });
                case 'textarea':
                    return renderField(field, FormTextarea);
                default:
                    throw new Error(`Unsupported additional signup field type: ${field.type}`);
            }
        }));
}
function isFieldRenderFn(additionalSignupField) {
    return typeof additionalSignupField === 'function';
}
function areAdditionalFieldsRenderFn(additionalSignupFields) {
    return typeof additionalSignupFields === 'function';
}
//# sourceMappingURL=LoginSignupForm.jsx.map