import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core'
import { interval, Observable } from 'rxjs'
import { RequestService } from '../../services/request.service'
import { Post } from '../../../../models/Post'

@Component({
  selector: 'verseghy-featured-post',
  templateUrl: './featured-post.component.html',
  styleUrls: ['./featured-post.component.css'],
})
export class FeaturedPostComponent implements OnInit, AfterViewInit {
  @ViewChildren('content') content: QueryList<any>

  speed = 300
  autoplaySpeed = 10000
  current = 0
  items: Array<ElementRef>
  itemsLength: number
  isHovered = false
  posts: Observable<Post[]>

  constructor(private requestService: RequestService) {}
  ngOnInit() {
    this.posts = this.requestService.listFeaturedPosts()
  }

  ngAfterViewInit() {
    this.items = this.content.toArray()
    this.itemsLength = this.items.length
    for (const i of Object.keys(this.items)) {
      if (Number(i) !== 0) {
        this._transformRight(this.items[i])
      }
      this._transformLeft(this.items[this.itemsLength - 1])
    }
    interval(this.autoplaySpeed).subscribe(() => {
      if (!this.isHovered) {
        this.next()
      }
    })
  }

  next(): void {
    this._translateLeft(this.items[this.current])
    this._translateMiddle(this.items[this._nextId()])
    this._transformRight(this.items[this._previousId()])
    this.current = this._nextId()
  }

  previous(): void {
    this._translateRight(this.items[this.current])
    this._translateMiddle(this.items[this._previousId()])
    this.current = this._previousId()
    this._transformLeft(this.items[this._previousId()])
  }

  onMouseEnter(): void {
    this.isHovered = true
  }

  onMouseLeave(): void {
    this.isHovered = false
  }

  private _nextId(): number {
    let nextId = this.current + 1
    if (nextId > this.itemsLength - 1) {
      nextId = 0
    }
    return nextId
  }

  private _previousId(): number {
    let nextId = this.current - 1
    if (nextId < 0) {
      nextId = this.itemsLength - 1
    }
    return nextId
  }

  private _translateMiddle(element: ElementRef): void {
    element.nativeElement.style.opacity = 1
    element.nativeElement.style.transitionDuration = this.speed + 'ms'
    element.nativeElement.style.transform = 'translate3d(0, 0, 0)'
  }

  private _translateRight(element: ElementRef): void {
    element.nativeElement.style.opacity = 0
    element.nativeElement.style.transitionDuration = this.speed + 'ms'
    element.nativeElement.style.transform = 'translate3d(calc(100% + 10px), 0, 0)'
  }

  private _translateLeft(element: ElementRef): void {
    element.nativeElement.style.opacity = 0
    element.nativeElement.style.transitionDuration = this.speed + 'ms'
    element.nativeElement.style.transform = 'translate3d(calc(-100% - 10px), 0, 0)'
  }

  private _transformRight(element: ElementRef): void {
    element.nativeElement.style.opacity = 0
    element.nativeElement.style.transitionDuration = '0ms'
    element.nativeElement.style.transform = 'translate3d(calc(100% + 10px), 0, 0)'
  }

  private _transformLeft(element: ElementRef): void {
    element.nativeElement.style.opacity = 0
    element.nativeElement.style.transitionDuration = '0ms'
    element.nativeElement.style.transform = 'translate3d(calc(-100% - 10px), 0, 0)'
  }
}