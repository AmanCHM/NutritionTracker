import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";


interface FormField {
  name: string;
  type: "text" | "email" | "password" | "number";
  placeholder: string;
}

interface CustomFormProps {
  fields: FormField[];
  initialValues: Record<string, any>;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: Record<string, any>) => void;
  buttonText: string;
}

export default function CustomForm({ fields, initialValues, validationSchema, onSubmit, buttonText }: CustomFormProps) {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-3">
          {fields.map((field) => (
            <div key={field.name}>
              <Field name={field.name} type={field.type} placeholder={field.placeholder} className="w-full p-2 border rounded" />
              <ErrorMessage name={field.name} component="p" className="text-red-500 text-sm" />
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : buttonText}
          </button>
        </Form>
      )}
    </Formik>
  );
}
