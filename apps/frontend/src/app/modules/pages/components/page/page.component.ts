import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { map, switchMap } from 'rxjs/operators'
import { DomSanitizer, Title } from '@angular/platform-browser'
import { SubSink } from 'subsink'
import { RequestService } from '../../services/request.service'

@Component({
  selector: 'verseghy-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private titleService: Title,
    private domSanitizer: DomSanitizer
  ) { }

  private subsink = new SubSink()

  slug$ = this.route.params.pipe(map(({ slug }) => slug))
  data$ = this.slug$.pipe(
    switchMap(slug => this.requestService.getPageBySlug(slug))
  )
  content$ = this.data$.pipe(
    map(data => {
      return this.domSanitizer.bypassSecurityTrustHtml(PageComponent._processCustomTags(data.content))
    })
  )

  private static _processCustomTags(html: string): string {
    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')
    const tables = Array.from(dom.getElementsByTagName('table'))
    const links = Array.from(dom.getElementsByTagName('a'))

    for (const table of tables) {
      const parentNode = table.parentNode
      const index = Array.from(parentNode.children).indexOf(table)

      const element = dom.createElement('div')
      element.classList.add('table-container')
      element.append(table)

      parentNode.insertBefore(element, parentNode.children[index])
    }

    links.forEach(link => {
      link.setAttribute('target', '_blank')
    })

    return dom.documentElement.innerHTML
  }

  ngOnInit(): void {


    this.subsink.sink = this.data$.subscribe(data => {
      this.titleService.setTitle(data.title)
    })
  }

  ngOnDestroy(): void {
    this.subsink.unsubscribe()
  }

}