import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Buffer } from '../videoplayer.interface';

@Injectable()
export class VideoService {

  time$: BehaviorSubject<number> = new BehaviorSubject(0)
  color: string = 'red'
  buffers$: BehaviorSubject<Buffer[]> = new BehaviorSubject([])
  duration$: Subject<number> = new Subject()
  video: HTMLVideoElement

  constructor() { }
}
