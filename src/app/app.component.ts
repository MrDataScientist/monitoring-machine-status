import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { WebSocketGateService } from './services/websocketGate.service';
import { ResponseData } from './model/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {

  connected: Subscription;
  isConnected = false;
  address: string = 'wss://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/ws/websocket';
  message: string = 'Status:';
  messages: Subject<any>;
  logs: any;

  scrollEndNow = false;

  @ViewChild('console') console: ElementRef;

  constructor(private ws: WebSocketGateService) {
    this.connected = ws.connected().subscribe((status: any) => {
      this.isConnected = status;
      console.log('status:', status);
    });
  }

  connect() {
    this.messages = <Subject<any>>this.ws
      .connect(this.address)
      .pipe(map((response: MessageEvent): any => {
        console.log(response);
        return response.data;
      }));

      console.log(this.ws);

     this.logs = this.messages.pipe(scan((current: any, responseStatus: ResponseData) => {
      this.scrollEnd();
      return [...current, `${responseStatus}`]
      }, []));
  }

  send() {
    console.log('logs:', this.logs);
    this.messages.next(this.message);
  }

  scrollEnd() {
    setTimeout( () => {
      this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
    }, 100);
  }
}
