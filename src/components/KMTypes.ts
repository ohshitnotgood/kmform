/**
 * Every question in a form must conform to this type.
 */
export type Question = {
    /**
     * `ID` of the question.
     *
     * This is referred to as `questionId` in some places.
     */
    id: string,
    /**
     * Title of the question.
     */
    prompt: string,
    /**
     * Description text for the question
     */
    description?: string,
    /**
     * Classification of the question.
     *
     * @see `QuestionType`
     */
    type: QuestionType,
    /**
     * Options if the question is multiple-choice question.
     */
    options: Option[],
    /**
     * Marks if this question must be answered for the form to be submitted.
     */
    required: boolean,
    /**
     * Default value
     */
    default?: string,
    /**
     * Placeholder string
     */
    placeholder?: string,
    /**
     * `ID` of the form that this question is a part of.
     */
    formId: string
}

/**
 * JSON body type that is received from `/form/find`
 *
 * Each form consists of
 * - `id` - ID of the form.
 * - `name` - name of the form. This can be ignored since most form names won't be shown to the user anyway.
 * - `createdAt` - time when the form was created.
 * - `stillAccepting` - if the form is still accepting responses
 * - `questions` -  a list of `Question` objects.
 *
 * @see `Question`
 */
export type TypeForm = {
    /**
     * This is referred to as `formId` in some places.
     */
    id: string,
    name: string,
    createdAt: string,
    stillAccepting: boolean,
    questions: Question[]
}

/**
 * JSON body type that is to be sent to `form/respond`
 */
export type FormResponse = {
    formId: string,
    questionResponses: QuestionResponse[]
}

/**
 * JSON type for a response to a particular question when sending data to `form/respond/`.
 *
 * Every response to a form must conform to this JSON type.
 */
export type QuestionResponse = {
    id?: string,
    questionId: string,
    value: string
}

/**
 * JSON type for an option that is received with the `Question` type when querying for forms.
 */
export type Option = {
    id: string,
    title: string,
    subtitle: string,
    image?: string
}

/**
 * The various questions types that we can get from the API.
 */
export enum QuestionType {
    /**
     * Represents a multiple-choice question that can accept _multiple_ option selects.
     */
    multi = "MultiChoice",
    /**
     * Represents a multiple-choice question that can only accept _one_ option select.
     */
    single = "SingleChoice",
    /**
     * Represents a short text-field answer that is displayed using an `input` component.
     */
    short = "ShortAnswer",
    /**
     * Represents a long text-field answer that is displayed using a `textarea` component.
     */
    long = "LongAnswer",
    /**
     * Represents a multiple-choice question that accepts *single* answer select, but the options have pictures attached
     * to them.
     */
    singleWithImage = "SingleChoiceWithImage",
    /**
     * Represents a multiple-choice question that accepts *multiple* answer select, but the options have pictures attached
     * to them.
     */
    multiWithImage = "MultiChoiceWithImage"
}
