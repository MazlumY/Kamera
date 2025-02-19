import { Component, OnInit } from '@angular/core';
import {
  HttpClient, HttpErrorResponse
} from '@angular/common/http';

declare var serverData: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'teller';
  private httpClient: HttpClient;

  pathToEdge: string;
  pathToCenter: string;

  pathToJson: string;

  currentRotation: number = 0;

  constructor(http: HttpClient) {
    this.httpClient = http;
  }

  ngOnInit(): void {
    // camData();
    serverData.camData(this.returnDataFromCam);
    this.getFile('/assets/picturePath.json');
  }

  returnDataFromCam(data: any) {
    console.log(data);
  }

  getFile(pathToFile: string) {
    this.httpClient.get(pathToFile, { responseType: 'json' }).subscribe(data => {
      this.pathToEdge = data["rand"];
      this.pathToCenter = data["mitte"];

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

  async stopMovement() {

  }

  async startMovement() {
    await this.rotate(0.01);
  }

  async rotate(deg: number, stop?: boolean) {



    if (deg >= 0.5 && !stop) {
      deg += 0.01;
      if (this.currentRotation >= 360) { this.currentRotation = 0; }
      this.currentRotation += deg;
      await this.delay(1);
      this.rotate(deg, true);
    }
    else if (deg < 0.5 && !stop) {
      deg += 0.01;
      if (this.currentRotation >= 360) { this.currentRotation = 0; }
      this.currentRotation += deg;
      await this.delay(1);
      this.rotate(deg);
    }
    else if (deg > 0 && stop) {
      deg -= 0.01;
      if (this.currentRotation >= 360) { this.currentRotation = 0; }
      this.currentRotation += deg;
      await this.delay(1);
      this.rotate(deg, true);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
