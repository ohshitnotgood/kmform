import { For, Match, Setter, Show, Switch, createResource, createSignal, onMount } from "solid-js"
import {FormResponse, Question, QuestionResponse, QuestionType, TypeForm} from "./KMTypes"
import spinner from "../assets/icons/spinner.svg"
import ViewTransition from "kmanim/src/components/ViewTransition"
import HoverReactiveText from "kmanim/src/components/HoverReactiveText"
import KMChoicePromptView from "./KMChoicePromptView";
import KMLongPromptView from "./KMLongPromptView";
import {createStore} from "solid-js/store";
import KMShortPromptView from "./KMShortPromptView";
import KMSubmitButtonView from "./KMSubmitButton";

/**
 * Displays a form through the provided `fetchUrl` and `submitUrl`.
 *
 * @param props
 * @constructor
 */
export default function KMFormView(props: {
    restFetchUrl: string,
    restSubmitUrl: string,
    successScreen?: any,
    apiKey: string,
    formHeader?: any,
}) {

    const [loadingData, setLoadingData] = createSignal(true)
    const [loadingError, setLoadError] = createSignal(false)
    const [closedForm, setClosedForm] = createSignal(false)

    const [beginEndScreenTransition, setBeginEndScreenTransition] = createSignal(false)

    let result: TypeForm

    async function fetchFormStructure() {
        let result = await fetch(props.restFetchUrl, {
            method: "GET",
            headers: {
                "aKey": props.apiKey
            }
        })

        console.log(result.status)
        console.log(result)
        if (result.status == 200) return await result.json() as TypeForm
        else throw "Error loading JSON"
    }

    // Upon view mount, KMForm will send request to provided restUrl to fetch form data.
    onMount(async () => {
        try {
            result = await fetchFormStructure()
            setClosedForm(!result.stillAccepting)
            setLoadingData(false)
        } catch (e) {
            console.log("error" + e)
            setLoadError(true)
        }
    })

    return (
        <div>
            <Show when={loadingData() && !loadingError()}>
                <LoadingScreen />
            </Show>
            <Show when={loadingError()}>
                <ErrorScreen />
            </Show>
            <Show when={!loadingData() && !loadingError() && closedForm()}>
                <ClosedForm />
            </Show>

            <Show when={!loadingData() && !loadingError() && !closedForm()}>
                <ViewTransition pre={
                    <FormView data={result!} submitUrl={props.restSubmitUrl} beginViewTransition={setBeginEndScreenTransition}/>
                } post={
                    <PostFormSubmitView />
                } beginTransition={
                    beginEndScreenTransition
                } />
            </Show>
        </div>
    )
}

/**
 * Displays a generic spinning loading screen while the form structure is being loaded.
 * @author Praanto Samadder
 * @constructor
 */
function LoadingScreen() {
    return (
    <div id={`kmform-loading-screen`} class="w-screen h-screen grid place-content-center">
        <img class="animate-spin" src={spinner} />
    </div>)
}

/**
 * Displays a generic error screen if there occurred an error while loading form structure
 * @author Praanto Samadder
 * @constructor
 */
function ErrorScreen() {
    return (
        <div id={`kmform-error-screen`} class="w-screen h-screen grid place-content-center">
            <div class="text-center">
                Oops! We encountered an error. Might be on our side, might be on your side. Maybe try refreshing the screen!
            </div>
        </div>
    )
}


/**
 * Displays a generic 'Thank you' page after the user has submitted the form
 * @author Praanto Samadder
 * @constructor
 */
function PostFormSubmitView() {
    return (
        <div id={`kmform-postform-view`} class={`w-screen h-screen grid place-content-center`}>
            Thank you for filling out that form! We'll get back to you as soon as possible!
        </div>
    )
}

/**
 * Takes in a list of `Question` and returns a list of `QuestionResponse`.
 *
 * Used to initialise the `store` which is then passed down to every form component.
 * @param questions
 * @see `Question`
 * @see `QuestionResponse`
 */
const initialiseStore = (questions: Question[]) => {
    return questions.map((q) => {
        return {
            questionId: q.id,
            value: ""
        }
    }) as QuestionResponse[]
}


function FormView( props: {
    data: TypeForm, beginViewTransition: Setter<boolean>,
    customTitle?: any, submitUrl: string
}) {

    const [values, setValues] = createStore<QuestionResponse[]>(initialiseStore(props.data.questions))
    
    /**
     * Loading state for `KMSubmitButton`
     */
    const [whenLoading, setWhenLoading] = createSignal(false)

    /**
     * Pass this function to every component so each component can update their own data in the 
     * 
     * **CAUTION:** This is often regarded as unsafe programming as we are allowing edit access for data from different components.
     * 
     * @param id ID of the prompt
     * @param value New value of the prompt
     */
    function updateStore(id: string, value: string) {
        setValues(values.map((v) => (
            v.questionId === id ? { ...v, value: value} : v
        )))
    }

    async function submitForm() {
        setWhenLoading(true)
        let responses: FormResponse = {
            formId: props.data.id,
            questionResponses: values
        }

        await fetch(props.submitUrl, {
            headers: {
                method: "PUT",
                body: JSON.stringify(responses)
            }
        })

        props.beginViewTransition(true)
    }

    return (
        <div>
            <Show when={props.customTitle != undefined}>
                { props.customTitle }
            </Show>
            <Show when={ props.customTitle == undefined}>
                <HoverReactiveText class={`text-8xl font-semibold text-gray-700 hover:text-gray-400 dark:text-gray-700 dark:hover:text-gray-400`}>
                    {props.data.name}
                </HoverReactiveText>
            </Show>

            <For each={props.data.questions}>{(each, i) =>
                <Switch>
                    <Match when={each.type == QuestionType.single}>
                        <KMChoicePromptView id={each.id} prompt={each.prompt} description={each.description} required={each.required} options={each.options} storeUpdater={updateStore}/>
                    </Match>
                    <Match when={each.type == QuestionType.multi}>
                        <KMChoicePromptView id={each.id} prompt={each.prompt} description={each.description} required={each.required} options={each.options} multipleChoiceMode={true} storeUpdater={updateStore}/>
                    </Match>
                    <Match when={each.type == QuestionType.short}>
                        <KMShortPromptView id={each.id} placeholder={each.placeholder} description={each.description} prompt={each.prompt} required={each.required} type={each.type} storeUpdater={updateStore}/>
                    </Match>
                    <Match when={each.type == QuestionType.long}>
                        <KMLongPromptView storeUpdater={updateStore} id={each.id} cols={4} rows={4} prompt={each.prompt} description={each.description} required={each.required} placeholder={each.placeholder}/>
                    </Match>
                </Switch>
            }
            </For>
            <KMSubmitButtonView whenLoading={whenLoading} onclick={submitForm}/>
        </div>
    )
}

/**
 * Displays generic 'Form is closed' text if `stillAccepting` flag is set to false in the fetch URL.
 * @author Praanto Samadder
 * @constructor
 */
function ClosedForm() {
    return (
        <div class={`w-screen h-screen grid place-content-center text-center`}>
            <span>
                This form has been closed. Please send an email at <a class={`underline text-blue-400`} href="mailto:kam@insektionen.se">kam@insektionen.se</a> if you think this is an error.
            </span>
        </div>
    )
}