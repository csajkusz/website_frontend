import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { combineLatest } from 'rxjs'
import { SearchFacade } from '../../state/search/search.facade'
import { SubSink } from 'subsink'
import { map } from 'rxjs/operators'

@Component({
  selector: 'verseghy-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  private subsink = new SubSink()

  posts$ = this.searchFacade.posts$
  loaded$ = this.searchFacade.loaded$
  error$ = this.searchFacade.error$

  type$ = this.route.data.pipe(map(({ type }) => type))
  term$ = this.route.params.pipe(map(({ term }) => term))

  constructor(private route: ActivatedRoute, private searchFacade: SearchFacade) {}

  ngOnInit(): void {
    this.subsink.sink = combineLatest([this.route.params, this.route.data]).subscribe(([params, data]) => {
      if (!params || !data) return

      if (data.type === 'term') this.searchFacade.queryTerm(params.term)
      if (data.type === 'label') this.searchFacade.queryLabel(params.labelID)
      if (data.type === 'author') this.searchFacade.queryAuthor(params.authorID)
    })
  }

  ngOnDestroy() {
    this.subsink.unsubscribe()
  }
}
