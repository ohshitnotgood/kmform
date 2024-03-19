import { Accessor, createEffect, createSignal, For, Setter } from "solid-js";
import { twMerge } from "tailwind-merge";


type _Option = { id: string, title: string, subtitle: string }


/**
 * Form UI component that displays a multi-choice question.
 *
 *
 * This `PromptView` is set to display in `single-choice` mode by default. To set it to `multi-choice` mode, set
 * the `multipleChoiceMode` parameters to `true`.
 *
 * #### CSS Shenanigans
 *
 * This component, itself, already has a vertical padding `py-3`. The subcomponents each have `mx-2` horizontal margin.
 *
 *
 * By default, `css.display` is set to `grid` layout. This cannot be changed via the `class` prop.
 *
 * #### Internal workings
 * `FChoicePromptView` declares a `selectedState` signal that keeps track
 * of the options that the user selects. This means the value for `FChoicePromptView` is stored within this `selectedState()`.
 *
 * `FChoicePromptView` accepts a `storeUpdater` function from the parent component (the `storeUpdater` function
 * modifying a `store` property in the parent view).  This is fed into all `FButton`s. Everytime the `selectedState` signal is changed, the
 * `storeUpdater` function is updated using the `id` provided in the props through a `createEffect` hook.
 *
 * `storeUpdater` is not and should not be passed to any `FButton`.
 *
 * @summary Form component to display a multi-choice question.
 * @param props.options Options to be displayed. Pass `question.options` here.
 * @param props.class Optional classname. Provide a max-height and max-width via here.
 * @param props.valueUpdater Pass the `Setter` object here.
 * @param props.description Pass the `question.description` here
 * @param props.id Pass the `question.id` here. This `id` is crucial because the `setter` uses this `id` to update the stored values.
 * @param props.prompt Pass the `question.prompt` here.
 * @param props.required Pass `question.required` here.
 * @param props.multipleChoiceMode Pass `true` if `question.type == QuestionType.multi`
 * @author Praanto
 * @since 0.0.0
 */
export default function KMChoicePromptView(props: { id: string, prompt: string, description?: string, required: boolean, options: _Option[], class?: string, multipleChoiceMode?: boolean, storeUpdater: Function }) {
    /**
     * Stores the options that the user has selected.
     *
     *
     * #### How reactivity works
     * Everytime this value is updated, the `storeUpdater` function is called to update the value in the `store` in the parent view.
     *
     * This object is passed to every `FButton` along with `setSelectedState`.
     *
     * #### How option storing works
     * The options selected are stored as a string. Every `option` has a single digit `id` as a string (which means the
     * options can have IDs from `'0'` to `'9'` but they are stored as strings). This means, if the value stored in here
     * is `'1234'`, then options 1 to 4 have been selected by the user.
     *
     * The `FButton` only removes its own `id` from the value.
     *
     * This also limits the number of options in a multi-choice question to 10 (but let's be real, will we ever need a
     * question with more than 10 options?)
     *
     * @see setSelectedState
     * @see FButton
     */
    let selectedState: Accessor<string>

    /**
     * Setter for `selectedState`.
     *
     * This object is also passed to every `FButton`.
     *
     *
     * @see selectedState
     */
    let setSelectedState: Setter<string>

    [selectedState, setSelectedState] = createSignal("")


    const multiChoiceMode = props.multipleChoiceMode == undefined ? false : props.multipleChoiceMode
    /**
     * Stores  previous states.
     *
     * This is necessary to prevent an infinite update cycle (where a `createEffect` kjl
     */
    let prevSelectState = ""

    createEffect(() => {
        if (selectedState() != prevSelectState) {
            props.storeUpdater(props.id, selectedState())
            prevSelectState = selectedState()
        }
    })

    return (
        <div class={twMerge(props.class, "py-3")}>
            {/* Question prompt/title. See wiki for details. */}
            <label class="flex flex-row font-medium select-none pb-1">
                {props.prompt}
                <span class="text-red-700" classList={{ "hidden": !props.required }}>*</span>
            </label>

            {/* Question description. See wiki for details. */}
            <div class={`pb-2 font-normal text-sm leading-tight select-none`} classList={{ "hidden": props.description == undefined }}>
                {props.description}
            </div>

            {/* OptionSet. */}
            <div class={twMerge(props.class, `grid gap-x-2`)} classList={{ "grid-cols-1": props.options.length < 2, "grid-cols-2": props.options.length > 1 }}>
                <For each={props.options}>{(each, i) =>
                    <div class={` my-2`}>
                        <FButton id={each.id} title={each.title} subtitle={each.subtitle} selectedState={selectedState} setSelectedState={setSelectedState} multipleChoiceMode={multiChoiceMode} />
                    </div>
                }</For>
            </div>
        </div>
    )
}


/**
 * Button view used in forms for multiple choice questions.
 *
 * ## Important
 * It is crucial that all the buttons in a `FChoicePromptView` have the same `multiChoiceMode`.
 * `FChoicePromptView` should pass it's `multipleChoiceMode` property to all `FButtons`.
 *
 *
 *
 * ## How option storing works
 * This component has a mandatory `id` property that must be provided. This `id` is essentially the `optionId`.
 *
 * `optionId` in the backend are single-digits stored as strings. This means options can have `id` from `'0'` to `'9'`,
 * all as strings.
 *
 * This means if `selectedState() = '0123'`, options with IDs `0` to `3` are selected.
 *
 * When a user clicks on an option, the `id` of the button is added (or removed) from `selectedState`.
 *
 * `FChoicePromptView` then propagates this change to the parent view (i.e. `Form`).
 *
 * ## How the button works internally
 * This component declares a checkbox `input` view and a `label` for that component.
 * The `input` is hidden from view which means the `label` is used to communicate to the user if it is selected or not.
 * The `input` is marked with the `peer` utility class and the `label` is tied to this `input` component. Read more about
 * checkboxes and labels in HTML here: https://www.w3schools.com/tags/att_input_type_checkbox.asp
 *
 *
 * Tailwind classes for `label` is defined in a `fClassName`.
 * The `peer-checked` functionality in Tailwind is used to update the UI for the `label` when a user selects or deselects
 * an option. Learn more about the `peer-checked` state class here: https://tailwindcss.com/docs/hover-focus-and-other-states#arbitrary-peers
 *
 *
 * ## CSS shenanigans
 * Each button is enclosed within a `grid`. This grid encompasses the hidden `input` and the `label`.
 * The `label` does not have any strict display properties defined.
 *
 * @constructor
 * @param props.id ID of the button. ID provided by the backend.
 * @param props.title The title of the button
 * @param props.subtitle The subtitle of the button
 * @param props.selectedState `Accessor` object that stores the value of `FChoicePromptView`.
 * @param props.setSelectedState `Setter` object that updates the value of `FChoicePromptView`
 * @param props.multiChoiceMode Enables multiple buttons to be selected.
 * @author Praanto
 * @private
 * @since 0.0.0
 */
function FButton(props: { id: string, title: string, subtitle?: string, selectedState: Accessor<string>, setSelectedState: Setter<string>, multipleChoiceMode: boolean }) {
    let fClassName = "border h-full select-none hover:cursor-pointer peer-checked:bg-gray-100 peer-checked:border-black hover:peer-checked:border-black font-light border-gray-500 hover:border-black px-3 py-3 h-full transition-colours duration-200 outline-none rounded"

    /**
     * Listener function attached to the `input` component.
     *
     * This function updates the `selectedState()` accessor by adding (or removing) the provided ID
     * from the value.
     */
    function onClickListener() {
        if (props.multipleChoiceMode) {
            if (props.selectedState().includes(props.id)) props.setSelectedState(props.selectedState().replace(props.id, ""))
            else props.setSelectedState(props.selectedState() + props.id)

        } else {
            props.setSelectedState(props.selectedState() == props.id ? "" : props.id)
        }
    }

    return (
        <div class={`grid h-full`}>
            <input class="peer hidden" id={props.id} type="checkbox" name={props.id} onclick={onClickListener} checked={props.selectedState().includes(props.id)} />
            <label class={fClassName} for={props.id}>
                <div class="text-lg/[1.3] font-normal">
                    {props.title}
                </div>
                <div class="text-xs text-gray-500">
                    {props.subtitle}
                </div>
            </label>
        </div>
    )
}
