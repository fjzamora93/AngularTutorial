import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
    imports: [CommonModule, MaterialModule]
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSub?: Subscription;
    myPost : Post = {
        _id: '',
        title: '',
        subtitle: '',
        content: '',
        list: [],
        imgUrl: '',
        attachedFile: '',
        category: '',
        creator: ''
    };

    constructor(private postsService: PostsService) {}

    ngOnInit() {
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) => {
            this.posts = posts;
        });
    }

    ngOnDestroy() {
        this.postsSub?.unsubscribe();
    }

    onDelete(postId: string): void {
        this.postsService.deletePost(postId).pipe(
            tap(response => {
                console.log('Post deleted successfully', response);
                this.postsService.getPosts();
            }),
            catchError(error => {
                console.error('Error deleting post', error);
                // Retorna un observable vacío para manejar el error
                return of(null);
            })
        ).subscribe();
    }

    onUpdate(postId: string) {
        console.log(this.myPost);
        this.postsService.updatePost(postId, this.myPost);
    }

}
