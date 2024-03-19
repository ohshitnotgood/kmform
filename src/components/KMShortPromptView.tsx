import {createSignal, Setter, Show} from "solid-js";

/**
 * Form component for viewing a short-text-response question.
 *
 * Error is not (and should not be shown) if the `input` component is empty because the user hasn't written anything
 * to it. It should only be shown if:
 * - a. the field is required and
 * - b. the user had written something and then removed it
 *
 *
 * ## CSS shenanigans
 *
 * This view consists of three text `div` components (the title, the description and the error) and an `input` component.
 *
 * This component has horizontal padding `px-2` and vertical padding `py-3`.
 *
 * ## How it works internally
 *
 * This component declares an `error` setter which is used to display the error message.
 * Along with that, the component also has an `onValueChange()` function. This function is attached to the `input` tag.
 * This function checks if the input field is empty and if the prompt is required, If so, then the `error` signal is
 * set to true. Along with that, this function also updates value using the `storeUpdater` method.
 *
 *
 *
 *
 *
 * @modified 15 December 2023
 * @param props.id HTML ID of the `input` component
 * @param props.type HTML input type. Same thing as you'd put as `type` in an `input` tag.
 * @param props.prompt The title of the question
 * @param props.description The description of the question
 * @param props.required If this form is required for the form to be submitted. Displays a red asterisk if `required` is set to true.
 * @param props.placeholder `input` tag placeholder text
 * @param props.storeUpdater `Setter<string>` type. Pass a solid-js `Setter` component to read values from the `input` tag.
 * @param props.errorMessage Error message to be displayed in red when the field is submitted empty.
 *
 *
 * @constructor
 * @since 0.0.0
 */
export default function KMShortPromptView(props: {id: string, type: string, prompt: string, description?: string, required: boolean, errorMessage?: string, placeholder?: string, storeUpdater: Function}) {
    let ref: HTMLInputElement
    const [error, setError] = createSignal(false)
    /**
     * The error message to be displayed in case of an...um...error.
     *
     * This message is not reactive meaning it can only be set during view initialisation.
     *
     * @inner
     * @default and here must exist a valid email address🫡
     */
    const errorMessage = props.errorMessage == undefined ? "and here must exist a valid email address🫡" : props.errorMessage


    /**
     * Listens for changes in the `input` component.
     *
     * Updates the `store` (that is received from parent view) using the `storeUpdater` property and
     * sets `error: Accessor<boolean>` to true if the `input` component is empty.
     *
     * Error is not (and should not be) shown if the user hasn't input anything.
     * @inner
     */
    function onValueChange() {
        setError(ref.value == "" && props.required)
        props.storeUpdater(props.id, ref.value)
    }
    
    return (
        <div class="grid py-3">
            {/* The question title aka question prompt text */}
            {/* Summary: The red asterisk is displayed when `props.required` is set to true. */}
            {/* Otherwise, it remains hidden. */}
            <span class={`font-medium select-none pb-1`}>
                { props.prompt }
                <span class="text-red-700" classList={{"hidden": !props.required}}>*</span>
            </span>


            {/* The question description text */}
            <div class={`pb-2 font-normal text-sm leading-tight select-none`} classList={{"hidden": props.description == undefined}}>
                {props.description}
            </div>


            {/* THE input component */}
            {/* The input where the Setter<string> is attached. */}
            <input ref={ref!} required={props.required}
                   name={props.id} placeholder={ props.placeholder }
                   class={`border font-light border-gray-500 hover:border-black px-2 py-2 transition-colours duration-200 text-xl outline-none rounded`}
                   onkeyup={onValueChange}
                   type={props.type}/>


            {/* The error message to be displayed when the field is empty. */}
            <span class="text-sm text-red-700" classList={{"hidden": (!error())}}>
                { errorMessage }
            </span>
        </div>
    )
}
