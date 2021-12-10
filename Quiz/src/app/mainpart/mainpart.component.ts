import { Component, OnInit } from '@angular/core';
import {
  HttpClient, HttpErrorResponse
} from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Question } from '../intro/intro.component';
import { Answer } from '../intro/intro.component';

@Component({
  selector: 'app-mainpart',
  templateUrl: './mainpart.component.html',
  styleUrls: ['./mainpart.component.scss']
})
export class MainpartComponent implements OnInit {
  private httpClient: HttpClient;
  private version: string;
  currentQuestion: number;
  currentAudioPart: string;
  completeJson: JSON;
  showFeedback: boolean = false;
  selectedAnswer: Answer;
  currentAudio = new Audio()

  constructor(http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.httpClient = http;
    this.currentQuestion = 1;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.version = params.version;
    }
    );
    switch (this.version) {
      case "compact": {
        this.getFile('/assets/textfiles/versionKompakt.json');
        break;
      }
      case "bulky": {
        this.getFile('/assets/textfiles/versionUmfangreich.json');
        break;
      }
      case "child": {
        this.getFile('/assets/textfiles/versionKinder.json');
        break;
      }
    }
  }

  playAudio(partOfQuestion: string) {
    this.currentAudio.src = this.selectAudioPath(partOfQuestion);
    this.currentAudio.load();
    this.currentAudio.play();
    // this.currentAudio.onended = () => {
    //   alert("The audio has ended");
    // }
    this.currentAudio.onpause = () => {
      if (this.checkIfAudioAutoStep()) {
        if (this.checkIfAudiopartExiste(partOfQuestion)) {
          console.log("next part " + this.nextAudioAutoplay())
          this.playAudio(this.nextAudioAutoplay())
        }
      }
      // alert("The audio has been paused");
    }
    // setTimeout(() => {
    //   // audio.pause();
    //   // audio.currentTime = 0;
    //   this.stopAudio();
    //   console.log(this.currentAudio.ended);
    //   console.log(this.currentAudio.paused);
    // }, 1000)
  }

  nextAudioAutoplay(currentQuestionIndex?: number): string {
    switch (this.currentAudioPart) {
      case "beforequestion": {
        return "question";
      }
      case "afterquestion": {
        return "";
      }
      case "question": {
        return "answer1text";
      }
      case "answer1text": {
        return "answer2text";
      }
      case "answer1feedback": {
        if (this.checkIfAudiopartExiste("afterquestion")) {
          return "afterquestion";
        }
        this.stepAfterFeedback();
        if (this.checkIfAudiopartExiste("beforequestion")) {
          return "beforequestion";
        }
        if (this.checkIfAudiopartExiste("question"))
          return "question";
        else return "";
      }
      case "answer2text": {
        return "answer3text";
      }
      case "answer2feedback": {
        if (this.checkIfAudiopartExiste("afterquestion")) {
          return "afterquestion";
        }
        this.stepAfterFeedback();
        if (this.checkIfAudiopartExiste("beforequestion")) {
          return "beforequestion";
        }
        if (this.checkIfAudiopartExiste("question"))
          return "question";
        else return "";
      }
      case "answer3feedback": {
        if (this.checkIfAudiopartExiste("afterquestion")) {
          return "afterquestion";
        }
        this.stepAfterFeedback();
        if (this.checkIfAudiopartExiste("beforequestion")) {
          return "beforequestion";
        }
        if (this.checkIfAudiopartExiste("question"))
          return "question";
        else return "";
      }
      default: {
        return "";
      }
    }
  }

  checkIfAudiopartExiste(partOfQuestion: string): boolean {
    console.log(partOfQuestion)
    if (this.selectAudioPath(partOfQuestion).length > 5) {
      return true;
    } else return false;
  }

  checkIfAudioAutoStep(): boolean {
    switch (this.currentAudioPart) {
      case "beforequestion": {
        return true;
      }
      case "afterquestion": {
        return true;
      }
      case "question": {
        return true;
      }
      case "answer1text": {
        return true;
      }
      case "answer1feedback": {
        return true;
      }
      case "answer2text": {
        return true;
      }
      case "answer2feedback": {
        return true;
      }
      case "answer3text": {
        return false;
      }
      case "answer3feedback": {
        return true;
      }
      default: {
        return false
      }
    }
  }

  selectAudioPath(partOfQuestion: string): string {
    try {
      this.currentAudioPart = partOfQuestion;
      switch (partOfQuestion) {
        case "beforequestion": {
          return this.completeJson["audio"]["question" + this.currentQuestion].beforequestion;
        }
        case "afterquestion": {
          return this.completeJson["audio"]["question" + this.currentQuestion].afterquestion;
        }
        case "question": {
          return this.completeJson["audio"]["question" + this.currentQuestion].question;
        }
        case "answer1text": {
          return this.completeJson["audio"]["question" + this.currentQuestion].answers[0].text;
        }
        case "answer1feedback": {
          return this.completeJson["audio"]["question" + this.currentQuestion].answers[0].feedback;
        }
        case "answer2text": {
          return this.completeJson["audio"]["question" + this.currentQuestion].answers[1].text;
        }
        case "answer2feedback": {
          return this.completeJson["audio"]["question" + this.currentQuestion].answers[1].feedback;
        }
        case "answer3text": {
          return this.completeJson["audio"]["question" + this.currentQuestion].answers[2].text;
        }
        case "answer3feedback": {
          return this.completeJson["audio"]["question" + this.currentQuestion].answers[2].feedback;
        }
        default: {
          return "";
        }
      }
    } catch (e) {
      return "";
      console.log("Fehler beim Pfad aufwählen der Audiodatei");
    }
  }

  stopAudio() {
    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
  }

  stepAfterFeedback() {
    // this.currentAudioStep++;
    this.currentQuestion++;
    this.showFeedback = false;
    // this.playAudio(this.currentAudioStep + 1)
  }

  answerSelect(answer: Answer, position: number) {
    this.selectedAnswer = answer;
    this.showFeedback = true;
    // const number: number = Number(this.currentQuestion.toString() + position);
    // console.log(number);
    this.playAudio("answer" + (position + 1) + "feedback");
  }


  getFile(pathToFile: string) {
    this.httpClient.get(pathToFile, { responseType: 'json' }).subscribe(data => {
      this.completeJson = JSON.parse(JSON.stringify(data));
      // this.playAudio(1);
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      }
    );
  }
}
