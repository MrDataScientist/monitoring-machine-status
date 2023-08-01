import { Injectable } from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';

@Injectable()
export class WebSocketGateService {
  private subject: Subject<MessageEvent>;
  private connected$ = new Subject<any>();

  public connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("connected: " + url);
      this.connected$.next(true);
    }
    return this.subject;
  }

  public connected(): Observable<any> {
    return this.connected$.asObservable();
  }

  private create(url: string): Subject<MessageEvent> {
    let websocket = new WebSocket(url);

    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        websocket.onmessage = obs.next.bind(obs);
        websocket.onerror = obs.error.bind(obs);
        websocket.onclose = obs.complete.bind(obs);
        return websocket.close.bind(websocket);
      })
    let observer = {
      next: (data: Object) => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify(data));
        }
      }
    }
    return Subject.create(observer, observable);
  }

}
