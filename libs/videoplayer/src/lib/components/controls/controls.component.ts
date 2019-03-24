import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  ElementRef,
  OnChanges,
  Inject,
  HostListener,
  HostBinding,
} from '@angular/core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPause, faPlay, faVolumeDown, faVolumeMute, faExpand, faCompress, faCog, faCheck } from '@fortawesome/free-solid-svg-icons'
import { DOCUMENT } from '@angular/common'
import { Buffer } from '../../videoplayer.interface'
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'verseghy-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit, OnChanges {
  @Output() qualityChange: EventEmitter<string> = new EventEmitter()
  @Input() host: ElementRef
  @Input() qualities: String[]
  @Input() video: HTMLVideoElement
  @Input() duration: number
  @Input() paused: boolean
  @Input() color: boolean
  @Input() time: number
  @ViewChild('settingsMenu') settingsMenuElement: ElementRef
  @ViewChild('settingsButton') settingsButton: ElementRef
  timeLeft: string
  muteVolume: number
  keys: string[]
  buffersArray: Buffer[]
  activeQuality = '1080p60'
  @HostBinding('class.settingsMenuOpen') settingsMenu = false

  volumeButtonVisible = true
  muteButtonVisible = false
  progressBarWidth = 0

  constructor(@Inject(DOCUMENT) private document: Document, private videoService: VideoService) {
    library.add(faPause, faPlay, faVolumeDown, faVolumeMute, faExpand, faCompress, faCog, faCheck)
  }

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if ('time' in changes) {
      this.timeLeft = this._formatTime(Math.round(this.duration - this.video.currentTime))
    }
  }

  private _formatTime(time: number): string {
    const hours = Math.floor(time / 3.6e3) % 60
    const minutes = Math.floor(time / 60) % 60
    const seconds = time % 60

    let hours2 = ('0' + hours).slice(-2) + ':'
    const minutes2 = ('0' + minutes).slice(-2)
    const seconds2 = ('0' + seconds).slice(-2)

    if (hours2 === '00:') hours2 = ''

    return hours2 + minutes2 + ':' + seconds2
  }

  setQuality(quality: string) {
    if (quality !== this.activeQuality) {
      this.activeQuality = quality
      this.qualityChange.emit(quality)
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'Space':
      case 'KeyK':
        this.video.paused ? this.video.play() : this.video.pause()
        break

      case 'KeyF':
        this.videoService.toggleFullscreen()
        break

      case 'ArrowLeft':
        this.video.currentTime < 5 ? (this.video.currentTime = 0) : (this.video.currentTime -= 5)
        break

      case 'ArrowRight':
        this.video.currentTime > this.duration - 5 ? (this.video.currentTime = this.duration) : (this.video.currentTime += 5)
        break

      case 'KeyJ':
        this.video.currentTime < 10 ? (this.video.currentTime = 0) : (this.video.currentTime -= 10)
        break

      case 'KeyL':
        this.video.currentTime > this.duration - 10 ? (this.video.currentTime = this.duration) : (this.video.currentTime += 10)
        break

      case 'Backquote':
        this.video.currentTime = 0
        break

      case 'Digit1':
        this.video.currentTime = this.duration / 10
        break

      case 'Digit2':
        this.video.currentTime = (this.duration / 10) * 2
        break

      case 'Digit3':
        this.video.currentTime = (this.duration / 10) * 3
        break

      case 'Digit4':
        this.video.currentTime = (this.duration / 10) * 4
        break

      case 'Digit5':
        this.video.currentTime = (this.duration / 10) * 5
        break

      case 'Digit6':
        this.video.currentTime = (this.duration / 10) * 6
        break

      case 'Digit7':
        this.video.currentTime = (this.duration / 10) * 7
        break

      case 'Digit8':
        this.video.currentTime = (this.duration / 10) * 8
        break

      case 'Digit9':
        this.video.currentTime = (this.duration / 10) * 9
        break
    }
  }

  toggleSettingsMenu() {
    this.settingsMenu = !this.settingsMenu
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (this.settingsMenu) {
      if (!this.settingsMenuElement.nativeElement.contains(targetElement) && !this.settingsButton.nativeElement.contains(targetElement)) {
        this.settingsMenu = false
      }
    }
  }

  onVolumeSliderClick() {
    this.muteVolume = this.video.volume
  }
}