import spinner from '../assets/icons/spinner.svg'
import {Accessor} from "solid-js";

/**
 * Submit button used by `Form` component.
 *
 * This is different from the `FButton` which is used within `FChoicePromptView` (`FButton` is not even exported).
 *
 * @todo accept data for validation and submit request to the backend.
 * @param props.text Text to be shown in the center of the button
 * @param props.onclick Whatever is supposed to happen when the user clicks on the button
 */
export default function KMSubmitButtonView(props: { text?: string, onclick: any, whenLoading: Accessor<boolean>}) {
    const buttonText = props.text == undefined ? "Submit" : props.text

    return (
        <div class={`py-3`}>
            <button
                onclick={props.onclick}
                class={`border relative border-gray-500 font-normal hover:bg-gray-100 py-2 hover:border-black transition-colours duration-200 text-lg outline-none rounded w-full`}>
                { buttonText }

                <div
                    classList={{"visible opacity-100": props.whenLoading(), "invisible opacity-0": !props.whenLoading()}}
                    class={`absolute top-0 left-0 bg-white/90 w-full h-full grid place-content-center duration-500 transition-all`}>
                    <img
                        class={`animate-spin duration-300 transition-all`} src={spinner} alt={`Progress spinner indicating that the page is loading`}/>
                </div>
            </button>
        </div>
    )
}