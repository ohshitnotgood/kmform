import { createSignal, Setter } from "solid-js";
import { QuestionResponse } from "./KMTypes";

/**
 * Form component for viewing a short-text-response question.
 *
 * This view presents a `textarea` which means this component does not accept any `type` property.
 *
 * Error is not (and should not be shown) if the `input` component is empty because the user hasn't written anything
 * to it. It should only be shown if:
 * - a. the field is required and
 * - b. the user had written something and then removed it
 *
 *
 * ## CSS shenanigans
 *
 * This view consists of three text `div` components (the title, the description and the error) and a `textarea` component.
 *
 * This component has horizontal padding `px-2` and vertical padding `py-3`.
 *
 * ## How it works internally
 *
 * This component declares an `error` setter which is used to display the error message.
 * Along with that, the component also has an `onValueChange()` function. This function is attached to the `textarea` tag.
 * This function checks if the input field is empty and if the prompt is required, If so, then the `error` signal is
 * set to true. Along with that, this function also updates value using the `storeUpdater` method.
 *
 * @modified 15 December 2023
 * @param props.id HTML ID of the `input` component
 * @param props.prompt The title of the question
 * @param props.description The description of the question
 * @param props.required If this form is required for the form to be submitted. Displays a red asterisk if `required` is set to true
 * @param props.cols Number of columns the `textarea` should have
 * @param props.rows Number of rows the `textarea` should have
 * @param props.placeholder `textarea` tag placeholder text
 * @param props.valueSetter `Setter<string>` type. Pass a solid-js `Setter` component to read values from the `input` tag
 * @param props.errorMessage Error message to be displayed in red when the field is submitted empty
 *
 * @see `FShortPromptView`
 *
 * @todo Fix size of the `textarea`.
 *
 * @constructor
 * @since 0.0.0
 */
export default function FLongPromptView(props: {id: string, cols: number, rows: number, prompt: string, description?: string, required: boolean, errorMessage?: string, storeUpdater: Function, placeholder?: string, valueSetter?: Setter<QuestionResponse>}) {
    /**
     * TSX reference to the `textarea`.
     *
     * This is equivalent to `document.getElementById()`. You can, for instance, get the value in the `textarea` by calling
     * `ref.value`. This feature is used by the `onValueChanged()` function.
     */
    let ref: HTMLTextAreaElement
    const [error, setError] = createSignal(false)
    /**
     * The error message to be displayed in case of an...um...error.
     * @inner
     * @default and here must exist a valid email address🫡
     */
    const errorMessage = props.errorMessage == undefined ? "and here must exist a valid email address🫡" : props.errorMessage


    /**
     * Sets `error: Accessor<boolean>` to true if the `input` field is empty.
     *
     * This should be passed through `onkeyup` to any `textarea` or `input` component that you'd like to observe.
     * @inner
     */
    function onValueChange() {
        setError(ref.value == "")
        props.storeUpdater(props.id, ref.value)
    }

    return (
        <div class="grid py-3">
            {/* The question title aka question prompt text */}
            <span class={`font-medium select-none pb-1`}>
                { props.prompt }
                <span class="text-red-700" classList={{"hidden": !props.required}}>*</span>
            </span>


            {/* The question description text */}
            <div class={`pb-2 font-normal text-sm leading-tight select-none`} classList={{"hidden": props.description == undefined}}>
                {props.description}
            </div>


            {/* The input where the Setter<string> is attached. */}
            <textarea rows={props.rows} cols={props.cols} ref={ref!} required={props.required}
                   name={props.id} placeholder={ props.placeholder }
                   class={`border font-light border-gray-500 hover:border-black px-2 py-2 transition-colours duration-200 text-md outline-none rounded`}
                   onkeyup={onValueChange}/>


            {/* The error message to be displayed when the field is empty. */}
            <span class="text-sm text-red-700" classList={{"hidden": (!error() || !props.required)}}>
                { errorMessage }
            </span>
        </div>
    )
}
