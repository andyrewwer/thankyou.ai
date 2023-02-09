import button from "../common/buttons.module.css";
import feedbackStyles from "./feedback.module.css";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import toast from "react-hot-toast";

const FeedbackSchema = Yup.object().shape({
    name: Yup.string()
        .required('Required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    feedback: Yup.string()
        .min(2, 'Too short (minimum 2 characters)')
        .max(500, 'Too long!')
        .required('Required'),
});

export default function Feedback() {

    return <div className={feedbackStyles.container}>
        <h1>Give Feedback</h1>
        <span>It really helps me to make this better for everyone! </span>
        <Formik
            initialValues={{
                name: '',
                email: '',
                feedback: '',
            }}
            validationSchema={FeedbackSchema}
            onSubmit={async (values, {resetForm}) => {
                try {
                    const response = await fetch("/api/feedback", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                    })
                    const data = await response.json();
                    toast.success("Thank you for your feedback, it has been registered.");
                    console.log('received feedback response', data);
                    resetForm();
                } catch (e) {
                    console.error(e);
                    toast.error('Something went wrong, try again soon!');
                }

            }}
        >{({errors, touched}) => (
            <Form className={feedbackStyles.form}>
                <div className={feedbackStyles.formGroup}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <Field id="name" name="name" placeholder="Andrew Weeks"/>
                    </div>
                    {errors.name && touched.name && (
                        <>
                            <div className={feedbackStyles.break}/>
                            <div className={feedbackStyles.errors}>{errors.name}</div>
                        </>
                    )}
                </div>
                <div className={feedbackStyles.formGroup}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <Field id="email" name="email" type="email" placeholder="andrew@acme.com"/>
                    </div>
                    {errors.email && touched.email && (
                        <>
                            <div className={feedbackStyles.break}/>
                            <div className={feedbackStyles.errors}>{errors.email}</div>
                        </>
                    )}
                </div>
                <div className={feedbackStyles.formGroup}>
                    <div>
                        <label htmlFor="feedback">Feedback:</label>
                        <Field as="textarea" id="feedback" name="feedback" rows={3}/>
                    </div>
                    {errors.feedback && touched.feedback && (
                        <>
                            <div className={feedbackStyles.break}/>
                            <div className={feedbackStyles.errors}>{errors.feedback}</div>
                        </>
                    )}
                </div>
                <button type="submit" className={button.accentButton}>Submit</button>
            </Form>)}
        </Formik>
    </div>
}
