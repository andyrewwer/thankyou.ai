import {setTutorialPlayed} from "./SessionService";
import buttons from './buttons.module.css';

export const steps = [
    {
        selector: '#step-1',
        content: ({setIsOpen}) => (
            <div>
                <p>Welcome to <b style={{color: 'var(--brown-9)'}}>Thank you Assistant.</b></p>
                <p>A simple platform that helps you track, manage, and write thank you notes for any event!</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)

    },
    {
        selector: '#step-2',
        content: ({setIsOpen}) => (
            <div>
                <p>This is the main platform for your list! You can track who gave gifts, who sent them and some comments (e.g. who will send the thank-you). </p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-3',
        content: ({setIsOpen}) => (
            <div>
                <p>Click here to mark thank-yous as written/sent.</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-4',
        content: ({setIsOpen}) => (
            <div>
                <p>We can even help you generate thank-you, just click the "generate" button and it'll pop-up a modal with an potential sample email you can just press "send" or edit to preference! </p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-5',
        content: ({setIsOpen}) => (
            <div>
                <p>You can save your list here, it will automatically save every few seconds (and load changes made by others).</p>
                <p>Check here to see if it's saved before closing the page.</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-6',
        content: ({setIsOpen}) => (
            <div>
                <p>Change the list's name here!</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-7',
        content: ({setIsOpen}) => (
            <div>
                <p>Share the list, it'll generate a link which you can access from any device (or share with your friends/family/partner).</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-8',
        content: ({setIsOpen}) => (
            <div>
                <p>When you're finished with your first list, create a new list here!</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-9',
        content: ({setIsOpen}) => (
            <div>
                <p>If you want to see this again, press here and you can see this again!</p>
                <DismissButton setIsOpen={setIsOpen}/>
            </div>)
    },
    {
        selector: '#step-2',
        content: ({setIsOpen}) => (
            <div>
                <p>Now you're ready to get started!</p>
                <GetStartedButton setIsOpen={setIsOpen}/>
            </div>)
    },
    // ...
]

const DismissButton = (props) => (<button
    className={buttons.basicButton}
    onClick={() => {
        setTutorialPlayed();
        props.setIsOpen(false);
    }}
>Don't show this again
</button>)

const GetStartedButton = (props) => (<button
    className={buttons.getStartedButton}
    onClick={() => {
        props.setIsOpen(false);
    }}
>I'm ready - Get Started!
</button>)