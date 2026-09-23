"use client";

import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type {
  ServiceCategory,
  ServiceItem,
  ServiceQuestion,
  ServiceQuestionOption,
} from "@/lib/service-categories";
import styles from "./order-form.module.css";

type DynamicOrderFormProps = {
  service: ServiceItem;
  category: ServiceCategory;
};

type FormValue = string | boolean | string[];
type FormValues = Record<string, FormValue>;
type FormErrors = Record<string, string>;

type SetValueFunction = (
  id: string,
  value: FormValue
) => void;

const STEPS = [
  {
    number: 1,
    title: "Auftrag",
  },
  {
    number: 2,
    title: "Ort & Termin",
  },
  {
    number: 3,
    title: "Kontaktdaten",
  },
];

export default function DynamicOrderForm({
  service,
  category,
}: DynamicOrderFormProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const serviceQuestions = useMemo(
    () => service.questions ?? [],
    [service.questions]
  );

  const progress =
    (currentStep / STEPS.length) * 100;

  function setValue(
    id: string,
    value: FormValue
  ) {
    setValues((current) => ({
      ...current,
      [id]: value,
    }));

    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[id];
      return nextErrors;
    });
  }

  function toggleMultiValue(
    id: string,
    optionValue: string
  ) {
    const currentValue = values[id];

    const selectedValues = Array.isArray(currentValue)
      ? currentValue
      : [];

    if (selectedValues.includes(optionValue)) {
      setValue(
        id,
        selectedValues.filter(
          (item) => item !== optionValue
        )
      );

      return;
    }

    setValue(id, [
      ...selectedValues,
      optionValue,
    ]);
  }

  function validateQuestions(
    questions: ServiceQuestion[]
  ) {
    const nextErrors: FormErrors = {};

    for (const question of questions) {
      if (!question.required) {
        continue;
      }

      const value = values[question.id];

      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) &&
          value.length === 0) ||
        (question.type === "boolean" &&
          value !== true);

      if (isEmpty) {
        nextErrors[question.id] =
          "Bitte dieses Feld ausfüllen.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function validateStep() {
    if (currentStep === 1) {
      return validateQuestions(serviceQuestions);
    }

    if (currentStep === 2) {
      const nextErrors: FormErrors = {};

      const postalCode =
        typeof values.postalCode === "string"
          ? values.postalCode.trim()
          : "";

      const city =
        typeof values.city === "string"
          ? values.city.trim()
          : "";

      if (!postalCode) {
        nextErrors.postalCode =
          "Bitte die Postleitzahl eingeben.";
      } else if (!/^\d{4}$/.test(postalCode)) {
        nextErrors.postalCode =
          "Bitte eine gültige Schweizer Postleitzahl eingeben.";
      }

      if (!city) {
        nextErrors.city =
          "Bitte den Ort eingeben.";
      }

      setErrors(nextErrors);

      return Object.keys(nextErrors).length === 0;
    }

    const nextErrors: FormErrors = {};

    const name =
      typeof values.name === "string"
        ? values.name.trim()
        : "";

    const email =
      typeof values.email === "string"
        ? values.email.trim()
        : "";

    const phone =
      typeof values.phone === "string"
        ? values.phone.trim()
        : "";

    if (!name) {
      nextErrors.name =
        "Bitte Vor- und Nachname eingeben.";
    }

    if (!email) {
      nextErrors.email =
        "Bitte die E-Mail-Adresse eingeben.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nextErrors.email =
        "Bitte eine gültige E-Mail-Adresse eingeben.";
    }

    if (!phone) {
      nextErrors.phone =
        "Bitte die Telefonnummer eingeben.";
    }

    if (values.privacyAccepted !== true) {
      nextErrors.privacyAccepted =
        "Bitte den Datenschutz akzeptieren.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateStep()) {
      return;
    }

    setCurrentStep((step) =>
      Math.min(step + 1, STEPS.length)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function previousStep() {
    setErrors({});

    setCurrentStep((step) =>
      Math.max(step - 1, 1)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validateStep()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(
        "/api/leads/public",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceSlug: service.slug,
            serviceName: service.name,
            categorySlug: category.slug,
            categoryName: category.name,
            leadPrice: service.leadPrice,
            answers: values,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Die Anfrage konnte nicht gespeichert werden."
        );
      }

      router.push(
        `/auftrag-erstellen/erfolgreich?lead=${encodeURIComponent(
          result?.leadId ?? ""
        )}`
      );
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Es ist ein Fehler aufgetreten.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.formSection}>
      <div className={styles.steps}>
        {STEPS.map((step) => {
          const active =
            step.number === currentStep;

          const completed =
            step.number < currentStep;

          return (
            <div
              key={step.number}
              className={`${styles.step} ${
                active ? styles.stepActive : ""
              } ${
                completed
                  ? styles.stepCompleted
                  : ""
              }`}
            >
              <span>
                {completed ? "✓" : step.number}
              </span>

              <strong>{step.title}</strong>
            </div>
          );
        })}
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressValue}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.formCard}
      >
        {currentStep === 1 ? (
          <StepOne
            service={service}
            questions={serviceQuestions}
            values={values}
            errors={errors}
            setValue={setValue}
            toggleMultiValue={
              toggleMultiValue
            }
          />
        ) : null}

        {currentStep === 2 ? (
          <StepTwo
            values={values}
            errors={errors}
            setValue={setValue}
          />
        ) : null}

        {currentStep === 3 ? (
          <StepThree
            values={values}
            errors={errors}
            setValue={setValue}
          />
        ) : null}

        {errors.submit ? (
          <div className={styles.submitError}>
            {errors.submit}
          </div>
        ) : null}

        <div className={styles.formActions}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={previousStep}
              className={
                styles.secondaryButton
              }
              disabled={submitting}
            >
              ← Zurück
            </button>
          ) : (
            <span />
          )}

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className={styles.primaryButton}
            >
              Weiter
              <b>→</b>
            </button>
          ) : (
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={submitting}
            >
              {submitting
                ? "Anfrage wird gesendet ..."
                : "Anfrage kostenlos senden"}

              {!submitting ? <b>→</b> : null}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

type StepOneProps = {
  service: ServiceItem;
  questions: ServiceQuestion[];
  values: FormValues;
  errors: FormErrors;
  setValue: SetValueFunction;
  toggleMultiValue: (
    id: string,
    optionValue: string
  ) => void;
};

function StepOne({
  service,
  questions,
  values,
  errors,
  setValue,
  toggleMultiValue,
}: StepOneProps) {
  return (
    <>
      <FormHeading
        eyebrow="SCHRITT 1 VON 3"
        title="Beschreibe deinen Auftrag"
        description={`Beantworte einige kurze Fragen zu ${service.name}.`}
      />

      <div className={styles.fieldsGrid}>
        {questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            value={values[question.id]}
            error={errors[question.id]}
            setValue={setValue}
            toggleMultiValue={
              toggleMultiValue
            }
          />
        ))}
      </div>
    </>
  );
}

type QuestionFieldProps = {
  question: ServiceQuestion;
  value: FormValue | undefined;
  error?: string;
  setValue: SetValueFunction;
  toggleMultiValue: (
    id: string,
    optionValue: string
  ) => void;
};

function QuestionField({
  question,
  value,
  error,
  setValue,
  toggleMultiValue,
}: QuestionFieldProps) {
  const options = question.options ?? [];

  if (question.type === "boolean") {
    return (
      <div className={styles.fullField}>
        <label className={styles.checkboxCard}>
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) =>
              setValue(
                question.id,
                event.target.checked
              )
            }
          />

          <span
            className={styles.checkboxVisual}
          >
            ✓
          </span>

          <span>
            <strong>
              {question.label}
              {question.required ? " *" : ""}
            </strong>
          </span>
        </label>

        {error ? (
          <span className={styles.error}>
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <FieldWrapper
        question={question}
        error={error}
      >
        <select
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={(event) =>
            setValue(
              question.id,
              event.target.value
            )
          }
          className={styles.input}
        >
          <option value="">
            Bitte auswählen
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }

  if (question.type === "multi-select") {
    const selectedValues = Array.isArray(value)
      ? value
      : [];

    return (
      <div className={styles.fullField}>
        <label className={styles.label}>
          {question.label}
          {question.required ? " *" : ""}
        </label>

        <div className={styles.optionGrid}>
          {options.map((option) => {
            const active =
              selectedValues.includes(
                option.value
              );

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  toggleMultiValue(
                    question.id,
                    option.value
                  )
                }
                className={`${
                  styles.optionButton
                } ${
                  active
                    ? styles.optionButtonActive
                    : ""
                }`}
              >
                <span>
                  {active ? "✓" : "+"}
                </span>

                {option.label}
              </button>
            );
          })}
        </div>

        {error ? (
          <span className={styles.error}>
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  if (question.type === "textarea") {
    return (
      <FieldWrapper
        question={question}
        error={error}
        full
      >
        <textarea
          value={
            typeof value === "string"
              ? value
              : ""
          }
          onChange={(event) =>
            setValue(
              question.id,
              event.target.value
            )
          }
          placeholder={
            question.placeholder
          }
          rows={5}
          className={styles.textarea}
        />
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper
      question={question}
      error={error}
    >
      <input
        type={getInputType(question.type)}
        value={
          typeof value === "string"
            ? value
            : ""
        }
        onChange={(event) =>
          setValue(
            question.id,
            event.target.value
          )
        }
        placeholder={question.placeholder}
        className={styles.input}
      />
    </FieldWrapper>
  );
}

function getInputType(
  type: ServiceQuestion["type"]
) {
  switch (type) {
    case "number":
      return "number";

    case "date":
      return "date";

    default:
      return "text";
  }
}

type FieldWrapperProps = {
  question: ServiceQuestion;
  error?: string;
  full?: boolean;
  children: ReactNode;
};

function FieldWrapper({
  question,
  error,
  full = false,
  children,
}: FieldWrapperProps) {
  return (
    <div
      className={
        full
          ? styles.fullField
          : styles.field
      }
    >
      <label className={styles.label}>
        {question.label}
        {question.required ? " *" : ""}
      </label>

      {children}

      {error ? (
        <span className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

type BasicStepProps = {
  values: FormValues;
  errors: FormErrors;
  setValue: SetValueFunction;
};

function StepTwo({
  values,
  errors,
  setValue,
}: BasicStepProps) {
  return (
    <>
      <FormHeading
        eyebrow="SCHRITT 2 VON 3"
        title="Wo und wann?"
        description="Damit wir Anbieter aus der passenden Region finden können."
      />

      <div className={styles.fieldsGrid}>
        <div className={styles.field}>
          <label className={styles.label}>
            Postleitzahl *
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={
              typeof values.postalCode ===
              "string"
                ? values.postalCode
                : ""
            }
            onChange={(event) =>
              setValue(
                "postalCode",
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="8000"
            className={styles.input}
          />

          {errors.postalCode ? (
            <span className={styles.error}>
              {errors.postalCode}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Ort *
          </label>

          <input
            type="text"
            value={
              typeof values.city === "string"
                ? values.city
                : ""
            }
            onChange={(event) =>
              setValue(
                "city",
                event.target.value
              )
            }
            placeholder="Zürich"
            className={styles.input}
          />

          {errors.city ? (
            <span className={styles.error}>
              {errors.city}
            </span>
          ) : null}
        </div>

        <div className={styles.fullField}>
          <label className={styles.label}>
            Strasse und Hausnummer
          </label>

          <input
            type="text"
            value={
              typeof values.street === "string"
                ? values.street
                : ""
            }
            onChange={(event) =>
              setValue(
                "street",
                event.target.value
              )
            }
            placeholder="Musterstrasse 12"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Gewünschtes Datum
          </label>

          <input
            type="date"
            value={
              typeof values.requestedDate ===
              "string"
                ? values.requestedDate
                : ""
            }
            onChange={(event) =>
              setValue(
                "requestedDate",
                event.target.value
              )
            }
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Budget
          </label>

          <select
            value={
              typeof values.orderBudget ===
              "string"
                ? values.orderBudget
                : ""
            }
            onChange={(event) =>
              setValue(
                "orderBudget",
                event.target.value
              )
            }
            className={styles.input}
          >
            <option value="">
              Noch nicht bekannt
            </option>

            <option value="under-500">
              Unter CHF 500
            </option>

            <option value="500-1000">
              CHF 500 – 1&apos;000
            </option>

            <option value="1000-2500">
              CHF 1&apos;000 – 2&apos;500
            </option>

            <option value="2500-5000">
              CHF 2&apos;500 – 5&apos;000
            </option>

            <option value="over-5000">
              Über CHF 5&apos;000
            </option>
          </select>
        </div>

        <div className={styles.fullField}>
          <label className={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={
                values.orderFlexibleDate ===
                true
              }
              onChange={(event) =>
                setValue(
                  "orderFlexibleDate",
                  event.target.checked
                )
              }
            />

            <span
              className={styles.checkboxVisual}
            >
              ✓
            </span>

            <span>
              <strong>
                Das Datum ist flexibel
              </strong>

              <small>
                Anbieter dürfen alternative
                Termine vorschlagen.
              </small>
            </span>
          </label>
        </div>
      </div>
    </>
  );
}

function StepThree({
  values,
  errors,
  setValue,
}: BasicStepProps) {
  return (
    <>
      <FormHeading
        eyebrow="SCHRITT 3 VON 3"
        title="Wie können Anbieter dich erreichen?"
        description="Deine Kontaktdaten werden nur passenden Anbietern angezeigt."
      />

      <div className={styles.fieldsGrid}>
        <div className={styles.fullField}>
          <label className={styles.label}>
            Vor- und Nachname *
          </label>

          <input
            type="text"
            value={
              typeof values.name === "string"
                ? values.name
                : ""
            }
            onChange={(event) =>
              setValue(
                "name",
                event.target.value
              )
            }
            placeholder="Max Muster"
            className={styles.input}
          />

          {errors.name ? (
            <span className={styles.error}>
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            E-Mail-Adresse *
          </label>

          <input
            type="email"
            value={
              typeof values.email === "string"
                ? values.email
                : ""
            }
            onChange={(event) =>
              setValue(
                "email",
                event.target.value
              )
            }
            placeholder="max@beispiel.ch"
            className={styles.input}
          />

          {errors.email ? (
            <span className={styles.error}>
              {errors.email}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Telefonnummer *
          </label>

          <input
            type="tel"
            value={
              typeof values.phone === "string"
                ? values.phone
                : ""
            }
            onChange={(event) =>
              setValue(
                "phone",
                event.target.value
              )
            }
            placeholder="+41 79 123 45 67"
            className={styles.input}
          />

          {errors.phone ? (
            <span className={styles.error}>
              {errors.phone}
            </span>
          ) : null}
        </div>

        <div className={styles.fullField}>
          <label className={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={
                values.privacyAccepted === true
              }
              onChange={(event) =>
                setValue(
                  "privacyAccepted",
                  event.target.checked
                )
              }
            />

            <span
              className={styles.checkboxVisual}
            >
              ✓
            </span>

            <span>
              <strong>
                Datenschutz akzeptieren *
              </strong>

              <small>
                Ich stimme der Verarbeitung
                meiner Daten und der Weitergabe
                an passende Anbieter zu.
              </small>
            </span>
          </label>

          {errors.privacyAccepted ? (
            <span className={styles.error}>
              {errors.privacyAccepted}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.summaryBox}>
        <span>DEINE AUSWAHL</span>

        <strong>
          Die Anfrage wird kostenlos und
          unverbindlich übermittelt.
        </strong>

        <p>
          Passende Anbieter können dich danach
          direkt kontaktieren und ein Angebot
          unterbreiten.
        </p>
      </div>
    </>
  );
}

type FormHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function FormHeading({
  eyebrow,
  title,
  description,
}: FormHeadingProps) {
  return (
    <div className={styles.formHeading}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}