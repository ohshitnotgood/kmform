import { createSignal, type Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import KMChoicePromptView from './components/KMChoicePromptView';
import KMLongPromptView from './components/KMLongPromptView';
import KMShortPromptView from './components/KMShortPromptView';
import KMSubmitButtonView from './components/KMSubmitButton';
import KMFormView from './components/KMFormView';


const App: Component = () => {
    const [whenLoading, _] = createSignal(true)

    return (
        <div class="w-screen grid place-content-center">
            <div class='w-[40vw]'>
                <KMChoicePromptView
                    id='choice-prompt'
                    required={true}
                    prompt='Hello World'
                    description="Prompt description"
                    storeUpdater={() => { }}
                    options={[
                        {
                            id: "1",
                            title: "Option 1",
                            subtitle: "Option Description 1"
                        },
                        {
                            id: "2",
                            title: "Option 2",
                            subtitle: "Option Description 2"
                        },
                        {
                            id: "3",
                            title: "Option 3",
                            subtitle: "Option Description 3"
                        },
                        {
                            id: "4",
                            title: "Option 4",
                            subtitle: "Option Description 4"
                        }
                    ]}
                    multipleChoiceMode={true} />

                    <KMLongPromptView 
                        id="long-prompt"
                        required={true} 
                        storeUpdater={() => {}}
                        cols={2}
                        rows={8}
                        prompt='Long prompt'
                        description='Long prompt description' />

                    <KMShortPromptView 
                        id="long-prompt"
                        type="number"
                        required={true} 
                        storeUpdater={() => {}}
                        prompt='Long prompt'
                        description='Long prompt description' />

                    
                    <KMSubmitButtonView
                        onclick={ () => {}}
                        whenLoading={whenLoading}
                        />
            </div>
        </div>
    );
};


export default App;
