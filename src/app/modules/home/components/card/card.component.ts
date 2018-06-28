import { Component, OnInit, Input } from '@angular/core';
import { ContrastService } from '../../../../services/contrast.service';

interface Post {
  id: number;
  author: string;
  authorImage: string;
  date: Date;
  dateAgo: string;
  description: string;
  image: string;
  post: string;
  title: string;
  backgroundColor: string;
  isDark: boolean;
  type: number;
  labels: {
    title: string;
    backgroundColor: string;
    isDark: boolean;
  };
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {


  @Input() type = 0;
  @Input() post: Post;

  constructor(private contrastService: ContrastService) { }

  ngOnInit() {
    this.post.isDark = this.contrastService.getConstrast(this.post.backgroundColor);
    for (const i of Object.keys(this.post.labels)) {
      this.post.labels[i].isDark = this.contrastService.getConstrast(this.post.labels[i].backgroundColor);
    }
  }

}