import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { getTokenOrRefresh } from './token_util';
import './custom.css'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

import data from './data.js';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            displayText: 'To start press one the buttons above!',
            res: []
        }
    }
    
    async componentDidMount() {
        // check for valid speech key/region
        const tokenRes = await getTokenOrRefresh();
        if (tokenRes.authToken === null) {
            this.setState({
                displayText: 'FATAL_ERROR: ' + tokenRes.error
            });
        }
    }
    
    async sttFromMic() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
        
        this.setState({
            displayText: 'Speak into your microphone'
        });
        
        recognizer.recognizeOnceAsync(result => {
            let displayText = "";
            let res = [];
            const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig);
       
            if (result.reason === ResultReason.RecognizedSpeech) {
                for (const tool of data) {
                    for (const keyword of tool.keywords) {
                        if(result.text.includes(keyword)) {
                            synthesizer.speakTextAsync(
                                tool.toolName,
                                result => {
                                return result.audioData;
                            },
                                error => {
                                console.log(error);
                                synthesizer.close();
                            });
                            
                            synthesizer.speakTextAsync(
                                tool.description,
                                result => {
                                return result.audioData;
                            },
                                error => {
                                console.log(error);
                                synthesizer.close();
                            });
                            
                            res.push([tool.toolName, tool.description, tool.link]);
                            break;
                        }
                    }
                }

                if (res.length === 0) {
                    synthesizer.speakTextAsync(
                        "No match was found. All the suggested applications are",
                        result => {
                        return result.audioData;
                    },
                        error => {
                        console.log(error);
                        synthesizer.close();
                    });
                    
                    for (const tool of data) {
                        res.push([tool.toolName, tool.description]);
                        synthesizer.speakTextAsync(
                            tool.toolName,
                            result => {
                            return result.audioData;
                        },
                            error => {
                            console.log(error);
                            synthesizer.close();
                        });
                        
                        synthesizer.speakTextAsync(
                            tool.description,
                            result => {
                            return result.audioData;
                        },
                            error => {
                            console.log(error);
                            synthesizer.close();
                        });
                    }
                }
            } else {
                displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
            }

            synthesizer.speakTextAsync(
                displayText,
                result => {
                synthesizer.close();
                return result.audioData;
            },
                error => {
                console.log(error);
                synthesizer.close();
            });

            this.setState({
                displayText: displayText,
                res: res
            });
        });
    }

    async fileChange(event) {
        const audioFile = event.target.files[0];
        console.log(audioFile);
        const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

        this.setState({
            displayText: fileInfo
        });

        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'en-US';

        const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(result => {
            let displayText;
            let res = [];
            const synthesizer = new speechsdk.SpeechSynthesizer(speechConfig);

            if (result.reason === ResultReason.RecognizedSpeech) {
                // displayText = `RECOGNIZED: Text=${result.text}`
                for (const tool of data) {
                    for (const keyword of tool.keywords) {
                        if(result.text.includes(keyword)) {
                            synthesizer.speakTextAsync(
                                tool.toolName,
                                result => {
                                return result.audioData;
                            },
                                error => {
                                console.log(error);
                                synthesizer.close();
                            });
                            
                            synthesizer.speakTextAsync(
                                tool.description,
                                result => {
                                return result.audioData;
                            },
                                error => {
                                console.log(error);
                                synthesizer.close();
                            });
                            
                            res.push([tool.toolName, tool.description, tool.link]);
                            break;
                        }
                    }
                }

                if (res.length === 0) {
                    synthesizer.speakTextAsync(
                        "No match was found. All the suggested applications are",
                        result => {
                        return result.audioData;
                    },
                        error => {
                        console.log(error);
                        synthesizer.close();
                    });
                    
                    for (const tool of data) {
                        res.push([tool.toolName, tool.description]);
                        synthesizer.speakTextAsync(
                            tool.toolName,
                            result => {
                            return result.audioData;
                        },
                            error => {
                            console.log(error);
                            synthesizer.close();
                        });
                        
                        synthesizer.speakTextAsync(
                            tool.description,
                            result => {
                            return result.audioData;
                        },
                            error => {
                            console.log(error);
                            synthesizer.close();
                        });
                    }
                }

            } else {
                displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
            }
            
            synthesizer.speakTextAsync(
                displayText,
                result => {
                synthesizer.close();
                return result.audioData;
            },
                error => {
                console.log(error);
                synthesizer.close();
            });

            this.setState({
                displayText: fileInfo + displayText,
                res: res
            });
        });
    }
    
    render() {
        return (
            <Container className="app-container">
                <div className="row align-items-md-stretch">
                    <div className="col-md-6 sp-box">
                        <div className="h-100 p-4 bg-light border shadow mb-5 box-microphone rounded-lg text-center d-flex align-items-center flex-column justify-content-center">
                            <h2 style={{color: "#494440"}}>Convert speech to text from your mic</h2>
                            <div className="mic-btn position-relative">
                                <i className="fas fa-microphone fa-lg text-center position-absolute" onClick={() => this.sttFromMic()}></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 sp-box">
                        <div className="h-100 p-4 bg-light border shadow mb-5 box-file-audio rounded-lg text-center d-flex align-items-center flex-column justify-content-center">
                            <h2 style={{color: "#494440"}}>Convert speech to text from an audio file</h2>
                                <label htmlFor="audio-file" className="file-btn position-relative"><i className="fas fa-file-audio fa-lg text-center position-absolute"></i></label>
                                    <input 
                                        type="file" 
                                        id="audio-file" 
                                        onChange={(e) => this.fileChange(e)} 
                                        style={{display: "none"}} 
                                    />
                        </div>
                    </div>
                </div>
                {(this.state.res.length === 0) ? (
                <div className="mt-2">
                    <div className="p-5 bg-light border shadow mb-5 bg-white rounded-lg">
                        <div>{this.state.displayText}</div>
                    </div>
                </div> 
            ) : (
                    <div>
                        {(this.state.res).map((v, index) => 
                            <div key={index} className="mt-2">
                                <div className="p-3 bg-light border shadow bg-white rounded-lg">
                                    <div className="border-bottom color-text-title">{v[0]}</div>
                                    <div className="color-text-description">{v[1]}</div>
                                    <div className="bottom-sign"><a className="no-underline" target="_blank" rel="noopener noreferrer" href={v[2]}>Go to tool's page</a></div>
                                </div>
                            </div>
                        )}
                    </div>
            )}
            <div className="bottom-sign p-1"><p>Developed by PROMESIP</p></div>
            </Container>
        );
    }
}