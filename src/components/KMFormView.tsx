import {FormResponse, Question, QuestionResponse, QuestionType, TypeForm} from "../../reusable/types.ts";
import {Accessor, createEffect, createSignal, For, Match, Setter, Switch} from "solid-js";
import FChoicePromptView from "./FChoicePromptView.tsx";
import FLongPromptView from "./FLongPromptView.tsx";
import {createStore} from "solid-js/store";
import FShortPromptView from "./FShortPromptView.tsx";
import FSubmitButtonView from "./FSubmitButtonView.tsx";
import formRespond from "../../../api/form-respond.ts";
import ViewTransition from "../../animations/ViewTransition.tsx";

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

/**
 *
 * ## The `storeUpdater` properties
 *
 * Every subcomponent accepts a `storeUpdater` function as a property. The `updateStore` function declaring inside `FFormView`
 * must be passed here.
 *
 * `FFormView` is compatible with `ViewTransition`
 *
 * A `switch-match` block determines which questions are to be displayed.
 *
 *
 * @param props.data The data that has been fetched from the backend. Must be in `TypeForm` type.
 * @param props.beginViewTransition  Signal for `ViewTransition` to begin transition animation.
 *
 * @uses `FChoicePromptView`
 * @uses `FShortPromptView`
 * @uses `FLongPromptView`
 * @uses `FSubmitButton`
 * @see `TypeForm`
 * @see `ViewTransition`
 * @todo refactor this to be the `Form`.
 * @todo write documentation about `ViewTransition` compatibility.
 * @todo remove Boilerplate within the switch block by allowing all subcomponents to accept props.data
 */
export default function FFormView(props: { data: TypeForm, beginViewTransition: Setter<boolean> }) {
    const [values, setValues] = createStore<QuestionResponse[]>(initialiseStore(props.data.questions))
    const [whenLoading, setWhenLoading] = createSignal(false)

    function updateStore(id: string, value: string) {
        setValues(values.map((v) => (
            v.questionId === id ? { ...v, value: value} : v
        )))
    }

    createEffect(() => {
        values.forEach((each) => console.log(each.value))
    })

    async function submitForm() {
        setWhenLoading(true)
        let responses: FormResponse = {
            formId: props.data.id,
            questionResponses: values
        }
        await formRespond(responses)
        setTimeout(() => {
            props.beginViewTransition(true)
        }, 1000)

    }

    return (
        <div>
            <For each={props.data.questions}>{(each, i) =>
                <Switch>
                    <Match when={each.type == QuestionType.single}>
                        <FChoicePromptView id={each.id} prompt={each.prompt} description={each.description} required={each.required} options={each.options} storeUpdater={updateStore}/>
                    </Match>
                    <Match when={each.type == QuestionType.multi}>
                        <FChoicePromptView id={each.id} prompt={each.prompt} description={each.description} required={each.required} options={each.options} multipleChoiceMode={true} storeUpdater={updateStore}/>
                    </Match>
                    <Match when={each.type == QuestionType.short}>
                        <FShortPromptView id={each.id} placeholder={each.placeholder} description={each.description} prompt={each.prompt} required={each.required} type={each.type} storeUpdater={updateStore}/>
                    </Match>
                    <Match when={each.type == QuestionType.long}>
                        <FLongPromptView storeUpdater={updateStore} id={each.id} cols={4} rows={4} prompt={each.prompt} description={each.description} required={each.required} placeholder={each.placeholder}/>
                    </Match>
                </Switch>
            }
            </For>
            <FSubmitButtonView whenLoading={whenLoading} onclick={submitForm}/>
        </div>
    )
}